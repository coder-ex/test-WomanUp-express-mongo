import { validationResult } from "express-validator";
import { ApiError } from "../../exceptions/api.error.mjs";
import { classObject as userService } from "./user.service.mjs";
import { UpdateUserDto } from "../../dtos/update.user.dto.mjs";

/**
 * класс предоставляет функционал управления пользователями <br/>
 */
class UserController {
    /**
     * вывод всех пользователей (только авторизованный ADMIN)
     * @param {object} req - запрос
     * @param {object} res - ответ
     * @param {object} next - продолжение сопоставления последующих маршрутов
     * @returns {json} возвращает ответ в JSON формате
     */
    async getAllUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            res.json(users);
        } catch (err) {
            next(err);
        }
    }

    /**
     * вывод данных пользователя по id пользователя (только авторизованные ADMIN | USER)
     * @param {object} req - запрос
     * @param {object} res - ответ
     * @param {object} next - продолжение сопоставления последующих маршрутов
     * @returns {json} возвращает ответ в JSON формате
     */
    async getUser(req, res, next) {
        try {
            const id = req.params.id;
            if (id !== req.user.id) {
                throw ApiError.Forbidden();
            }

            const userData = await userService.getUser(id);
            res.status(200).json({ ...userData });
        } catch (err) {
            next(err);
        }
    }

    /**
     * изменение данных пользователя по id пользователя (только авторизованный ADMIN | USER)
     * @param {object} req - запрос
     * @param {object} res - ответ
     * @param {object} next - продолжение сопоставления последующих маршрутов
     * @returns {json} возвращает ответ в JSON формате
     */
    async updateUser(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('не верные параметры', errors.mapped()));
            }

            const id = req.params.id;
            if (id !== req.user.id) {
                throw ApiError.Forbidden();
            }

            const updateData = new UpdateUserDto(req.body);
            const userData = await userService.updateUser(id, updateData);
            res.status(200).json({ user: userData });
        } catch (err) {
            next(err);
        }
    }

    /**
     * удаление пользователя по id пользователя (только авторизованный ADMIN | USER)
     * @param {object} req - запрос
     * @param {object} res - ответ
     * @param {object} next - продолжение сопоставления последующих маршрутов
     * @returns {json} возвращает ответ в JSON формате
     */
    async deleteUser(req, res, next) {
        try {
            const id = req.params.id;
            if (id !== req.user.id) {
                throw ApiError.Forbidden();
            }

            const result = await userService.deleteUser(id);
            res.status(200).json({ result });
        } catch (err) {
            next(err);
        }
    }
}

const classObject = new UserController();
export { UserController, classObject };