import { ApiError } from "../exceptions/api.error.mjs";
import { Role } from "../models/role.model.mjs";
import { classObject as tokenService } from "../modules/auth/token.service.mjs";

export default (role) => {
    return async function (req, res, next) {
        if (req.method === "OPTIONS") {
            next();
        }

        try {
            const authorizationHeader = req.headers.authorization;
            if (!authorizationHeader) {
                return next(ApiError.Unauthorize());
            }

            const accessToken = authorizationHeader.split(' ')[1];
            if (!accessToken) {
                return next(ApiError.Unauthorize());
            }

            const userData = tokenService.validateAccessToken(accessToken);
            if (!userData) {
                return next(ApiError.Unauthorize());
            }

            const roleDb = await Role.findOne({ value: role });
            if (userData.role[0] !== roleDb._id.toString()) {
                return next(ApiError.Forbidden('Нет доступа'));
            }

            req.user = userData;
            next();
        } catch (e) {
            return next(ApiError.Unauthorize());
        }
    }
}