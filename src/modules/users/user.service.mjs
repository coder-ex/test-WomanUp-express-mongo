import mongoose from 'mongoose';
import bcrypt from "bcrypt";
import { User } from "../../models/user.model.mjs";
import { Profile } from "../../models/profile.model.mjs"
import { OutUserDto } from "../../dtos/outuser.dto.mjs";
import { ApiError } from '../../exceptions/api.error.mjs';

class UserService {

    async getAllUsers() {
        const mapAggregate = await User.aggregate([
            {
                $lookup: {
                    from: 'profiles',
                    localField: '_id',
                    foreignField: 'user_id',
                    as: 'profile'
                }
            }]);

        const userData = mapAggregate.map((el) => new OutUserDto(el));
        //---
        return userData;
    }

    async getUser(id) {
        try {
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
                        _id: mongoose.Types.ObjectId(id)
                    }
                }]);

            let userData = new OutUserDto(mapAggregate.find((el) => el._id.toString() === id));

            return { ...userData }
        } catch (err) {
            throw err;
        }
    }

    async updateUser(id, upData) {
        //--- обернем в транзакцию
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            let { email, password, name, country, age, originName } = upData;
            const hashPassword = bcrypt.hashSync(password, 7);

            const user = await User.findByIdAndUpdate(id, { email, password: hashPassword }, { returnDocument: 'after', session: session, upsert: false });
            const profile = await Profile.findOneAndUpdate({ user_id: user._id }, { name: name, country: country, age: age, originName: originName }, { returnDocument: 'after', session: session });
            await session.commitTransaction();

            user.profile = profile;
            const userData = new OutUserDto(user);

            return { ...userData }
        } catch (err) {
            await session.abortTransaction();
            throw ApiError.RollbackTransact(err.message);
        }
    }

    async deleteUser(id) {
        try {
            const result = await User.deleteOne({ _id: id });
            if (result === 0) {
                throw new ApiError(500, 'Ошибка при удалении прользователя');
            }

            result = await Profile.deleteOne({ user_id: id });
            if (result === 0) {
                throw new ApiError(500, 'Ошибка при удалении профиля');
            }

            return { _id: 'delete id to user' };
        } catch (err) {
            throw err;
        }
    }
}

const classObject = new UserService();
export { UserService, classObject }