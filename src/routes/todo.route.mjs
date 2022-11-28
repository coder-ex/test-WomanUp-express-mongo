import { Router } from "express";
import { body, query } from "express-validator";
import { classObject as todoController } from "../modules/todo/todo.controller.mjs";
import { default as authMiddleware } from "../middleware/auth.middleware.mjs";
import { default as checkRole } from "../middleware/checkrole.middleware.mjs";

const router = new Router();

router.post('/', [
    body('title', 'Длина названия от 5 до 128 символов').isLength({ min: 5, max: 128 }),
], authMiddleware, todoController.addTodo);
router.get('/:userId/:todoId', authMiddleware, todoController.getOne);
router.put('/:userId/:todoId', [
    body('title', 'Длина названия от 5 до 128 символов').isLength({ min: 5, max: 128 }),
], authMiddleware, todoController.upTodo);
router.get('/:userId', [
    query('limit', 'Только числовое значение').isNumeric({ no_symbols: true }),
    query('skip', 'Только числовое значение').isNumeric({ no_symbols: true })
], authMiddleware, todoController.getAllUser);
router.get('/', checkRole('ADMIN'), todoController.getAll);

export { router };