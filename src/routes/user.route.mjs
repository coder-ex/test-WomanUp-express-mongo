import { Router } from "express";
import { body } from "express-validator";
import { default as authMiddleware } from "../middleware/auth.middleware.mjs";
import { default as checkRole } from "../middleware/checkrole.middleware.mjs";
import { classObject as controller } from "../modules/users/user.controller.mjs";

const router = new Router()

router.get('/all', authMiddleware, checkRole('ADMIN'), controller.getAllUsers);
router.get('/:id', authMiddleware, controller.getUser);
router.patch('/:id', [
    body('name', 'Длина имени до 32 символов').isLength({ max: 32 }),
    body('email', 'поле должно содержать корректный E-Mail').isEmail(),
    body('password', 'Пароль должен быть строкой: "MyPassword"').isString(),
    body('password', 'Длина парля от 5 до 32 символов').isLength({ min: 5, max: 32 }),
], authMiddleware, controller.updateUser);
router.delete('/:id', authMiddleware, controller.deleteUser);

export { router }