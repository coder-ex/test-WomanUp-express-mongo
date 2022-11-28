import mongoose from 'mongoose';
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import { Role } from "../../models/role.model.mjs";
import { User } from "../../models/user.model.mjs";
import { Profile } from "../../models/profile.model.mjs";
import { UserDto } from "../../dtos/user.dto.mjs"
import { classObject as mailService } from "./mail.service.mjs";
import { classObject as tokenService } from "./token.service.mjs";
import { ApiError } from "../../exceptions/api.error.mjs";
import { OutUserDto } from '../../dtos/outuser.dto.mjs';

class AuthService {
    async registration(reqBody = {}) {
        const { email, password, role = 'USER', name = email.split('@', 1)[0], country = '', age = 0, originName = '', avatarName = '' } = reqBody;

        const candidate = await User.findOne({ email: email }).exec();
        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с E-Mail ${email} уже существует`);
        }

        const roleObject = await Role.findOne({ value: role }).exec();
        if (!roleObject) {
            throw new ApiError(500, 'Роли не заданы');
        }

        const hashPassword = bcrypt.hashSync(password, 7);
        const activationLink = uuidv4();

        //--- обернем в транзакцию
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const user = await User.create([{ email, password: hashPassword, role: roleObject, activationLink }], { session });
            await Profile.create([{ name, user_id: user[0], country, age, originName, avatarName }], { session });
            await session.commitTransaction();
        } catch (err) {
            await session.abortTransaction();
            throw ApiError.RollbackTransact(err.message);
        }

        //--- смапим данные из двух таблиц
        const mapAggregate = await User.aggregate([
            {
                $lookup: {
                    from: 'profiles',
                    localField: '_id',
                    foreignField: 'user_id',
                    as: 'profile'
                }
            },
            {
                $match: {
                    email: email
                }
            }]);

        const userData = new OutUserDto(mapAggregate.find((el) => el.email === email));

        //--- отправим email
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/auth/activate/${activationLink}`);

        const userDto = new UserDto(userData);      // id, email, isActivated, role
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        //---
        return { ...tokens, user: { ...userData } }
    }

    async activate(link) {
        //--- обернем в транзакцию
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const user = await User.findOne({ activationLink: link }).session(session);;
            if (!link) {
                throw ApiError.badRequest('Некорректная ссылка активации');
            }

            user.isActivated = true;

            await user.save();
            await session.commitTransaction();
        } catch (err) {
            await session.abortTransaction();
            throw ApiError.RollbackTransact(err.message);
        }
    }

    async login(email, password) {
        try {
            const user = await User.findOne({ email: email });
            if (!user) {
                throw ApiError.BadRequest(`Пользователь ${email} не существует`);
            }

            const validPassword = await bcrypt.compareSync(password.toString(), user.password);
            if (!validPassword) {
                throw ApiError.BadRequest('Введен не верный пароль');
            }

            const userDto = new UserDto(user);      // id, email, isActivated, role
            const tokens = tokenService.generateTokens({ ...userDto });
            await tokenService.saveToken(userDto.id, tokens.refreshToken);
            //---
            return { ...tokens, user: userDto }
        } catch (err) {
            throw err;
        }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        try {
            if (!refreshToken) {
                throw ApiError.Unauthorize();
            }

            const userData = tokenService.validateRefreshToken(refreshToken);
            const tokenFromDb = await tokenService.findToken(refreshToken);
            if (!userData || !tokenFromDb) {
                throw ApiError.Unauthorize();
            }

            const user = await User.findById(userData.id);
            const userDto = new UserDto(user);  // id, email, isActivated
            const tokens = tokenService.generateTokens({ ...userDto });
            await tokenService.saveToken(userDto.id, tokens.refreshToken);

            return { ...tokens, user: userDto }
        } catch (err) {
            throw err;
        }
    }
}


const classObject = new AuthService();
export { AuthService, classObject }