import { ApiError } from "../exceptions/api.error.mjs";
import { classObject as tokenService } from "../modules/auth/token.service.mjs";

export default (req, res, next) => {
    if (req.method === "OPTIONS") {
        next();
    }

    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(ApiError.Unauthorize());
        }

        const accessToken = authorizationHeader.split(' ')[1];  // Bearer dsafkH;HWRSSDF...
        if (!accessToken) {
            return next(ApiError.Unauthorize());
        }

        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next(ApiError.Unauthorize());
        }

        req.user = userData;
        next();
    } catch (err) {
        return next(ApiError.Unauthorize());
    }
}