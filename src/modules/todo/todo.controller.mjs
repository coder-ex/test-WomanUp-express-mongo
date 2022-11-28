import { validationResult } from "express-validator";
import { ApiError } from "../../exceptions/api.error.mjs";
import { classObject as todoService } from "./todo.service.mjs";

/**
 * класс предоставляет функционал создания и просмотра заметок <br/>
 */
class TodoController {
    /**
     * создание заметки
     * @param {object} req - запрос
     * @param {object} res - ответ
     * @param {object} next - продолжение сопоставления последующих маршрутов
     * @returns {json} возвращает ответ в JSON формате
     */
    async addTodo(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('не верные параметры', errors.mapped()));
            }

            const todoData = await todoService.addTodo(req.user.id, req.body.title)

            res.status(200).send({ ...todoData });
        } catch (err) {
            next(err);
        }
    }

    /**
     * Посмотреть заметку по id
     * @param {object} req - запрос
     * @param {object} res - ответ
     * @param {object} next - продолжение сопоставления последующих маршрутов
     * @returns {json} возвращает ответ в JSON формате
     */
    async getOne(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('не верные параметры', errors.mapped()));
            }

            const id = req.params.userId;
            if (id !== req.user.id) {
                return next(ApiError.Forbidden());
            }

            const todoData = await todoService.getOne(req.params);

            res.status(200).send({ ...todoData });
        } catch (err) {
            next(err);
        }
    }

    /**
     * Редактирование заметки
     * @param {object} req - запрос
     * @param {object} res - ответ
     * @param {object} next - продолжение сопоставления последующих маршрутов
     * @returns {json} возвращает ответ в JSON формате
     */
    async upTodo(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('не верные параметры', errors.mapped()));
            }

            const id = req.params.userId;
            if (id !== req.user.id) {
                return next(ApiError.Forbidden());
            }

            const todoData = await todoService.upTodo({...req.params, ...req.body });

            res.status(200).send({ ...todoData });
        } catch (err) {
            next(err);
        }
    }

    /**
     * получить все заметки по авторизованному пользователю
     * @param {object} req - запрос
     * @param {object} res - ответ
     * @param {object} next - продолжение сопоставления последующих маршрутов
     * @returns {json} возвращает ответ в JSON формате
     */
    async getAllUser(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('не верные параметры', errors.mapped()));
            }

            const id = req.params.userId;
            if (id !== req.user.id) {
                return next(ApiError.Forbidden());
            }

            const todoData = await todoService.getAllUser({ id, ...req.query });

            res.status(200).send({ ...todoData });
        } catch (err) {
            next(err);
        }
    }

    /**
     * получить заметки всех пользователей
     * @param {object} req - запрос
     * @param {object} res - ответ
     * @param {object} next - продолжение сопоставления последующих маршрутов
     * @returns {json} возвращает ответ в JSON формате
     */
    async getAll(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('не верные параметры', errors.mapped()));
            }

            const todoData = await todoService.getAll(req.query);

            res.status(200).send({ ...todoData });
        } catch (err) {
            next(err);
        }
    }
}

const classObject = new TodoController();
export { TodoController, classObject }