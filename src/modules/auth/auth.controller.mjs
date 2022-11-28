import { validationResult } from "express-validator";
import { ApiError } from "../../exceptions/api.error.mjs";
import { classObject as authService } from "./auth.service.mjs";

/**
 * класс предоставляет функционал регистрации и авторизации <br/>
 * пользователей с использованием JWT <br/>
 */
class AuthController {
    /** время в ms == 30 дней ( 30 * 24 * 60 * 60 * 1000 ) */
    static _day30 = 2592000000;

    /**
     * регистрация пользователя
     * @param {object} req - запрос
     * @param {object} res - ответ
     * @param {object} next - продолжение сопоставления последующих маршрутов
     * @returns {json} возвращает ответ в JSON формате
     */
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('не верные параметры', errors.mapped()));
            }
            //const { email, password, role = 'USER', name = email.split('@', 1)[0], country = '', age = 0, originName = '', avatarName='' } = req.body;
            const userData = await authService.registration(req.body);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: AuthController._day30, httponly: true });     // cookies живет 30 дней
            return res.json({ 'message': 'Пользователь зарегистрирован', 'data': userData });
        } catch (err) {
            next(err);
        }
    }

    /**
     * активация созданного аккаунта
     * @param {object} req - запрос
     * @param {object} res - ответ
     * @param {object} next - продолжение сопоставления последующих маршрутов
     * @returns {json} возвращает ответ в JSON формате
     */
    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await authService.activate(activationLink);
            return res.redirect(/*process.env.CLIENT_URL*/ 'http://192.168.222.1:8000');
        } catch (err) {
            next(err);
        }
    }

    /**
     * авторизация пользователя
     * @param {object} req - запрос
     * @param {object} res - ответ
     * @param {object} next - продолжение сопоставления последующих маршрутов
     * @returns {json} возвращает ответ в JSON формате
     */
    async login(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('не верные параметры', errors.mapped()));
            }
            const { email, password } = req.body;
            const userData = await authService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: AuthController._day30, httponly: true }); // cookies живет 30 дней
            return res.json(userData);
        } catch (err) {
            next(err);
        }
    }

    /**
     * разлогинивание
     * @param {object} req - запрос
     * @param {object} res - ответ
     * @param {object} next - продолжение сопоставления последующих маршрутов
     * @returns {json} возвращает ответ в JSON формате
     */
    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const token = await authService.logout(refreshToken);
            res.clearCookie('refreshToken')
            return res.json(token);
        } catch (err) {
            next(err);
        }
    }

    /**
     * обновление refresh токена
     * @param {object} req - запрос
     * @param {object} res - ответ
     * @param {object} next - продолжение сопоставления последующих маршрутов
     * @returns {json} возвращает ответ в JSON формате
     */
    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await authService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: AuthController._day30, httpOnly: true });  // cookies живет 30 дней
            return res.json(userData);
        } catch (err) {
            next(err);
        }
    }
}

const classObject = new AuthController();
export { AuthController, classObject }