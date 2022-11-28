import jwt from "jsonwebtoken";
import mongoose from 'mongoose';
import { ApiError } from "../../exceptions/api.error.mjs";
import { Token } from "../../models/token.model.mjs";

class TokenService {
    generateTokens(payload) {
        //--- дни==d / часы==h / минуты==m / секунды==s
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '60m' }); // для теста 10 минут
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '2h' }); // для теста
        return { accessToken, refreshToken };
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (err) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (err) {
            return null;
        }
    }

    async saveToken(userId, refreshToken) {
        //--- обернем в транзакцию
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const tokenData = await Token.findByIdAndUpdate(userId, { refreshToken: refreshToken }, { returnDocument: 'after', session: session, upsert: true });
            await session.commitTransaction();
            return tokenData; // token;
        } catch (err) {
            await session.abortTransaction();
            throw ApiError.RollbackTransact(err.message);
        }
    }

    async removeToken(refreshToken) {
        const tokenData = await Token.findOneAndDelete({ refreshToken: refreshToken });
        return tokenData;
    }

    async findToken(refreshToken) {
        const tokenData = await Token.findOne({ refreshToken: refreshToken });
        return tokenData;
    }
}

const classObject = new TokenService();
export { TokenService, classObject }