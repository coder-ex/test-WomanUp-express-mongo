import { Router } from "express";
import { body } from "express-validator";
import { classObject as controller } from "../modules/auth/auth.controller.mjs";

const router = new Router();

router.post('/registration', [
    body('name', 'Длина имени до 32 символов').isLength({ max: 32 }),
    body('email', 'поле должно содержать корректный E-Mail').isEmail(),
    body('password', 'Пароль должен быть строкой: "MyPassword"').isString(),
    body('password', 'Длина парля от 5 до 32 символов').isLength({ min: 5, max: 32 }),
], controller.registration);
router.get('/activate/:link', controller.activate);
router.post('/login', [
    body('email', 'поле должно содержать корректный E-Mail').isEmail(),
    body('password', 'Пароль должен быть строкой: "MyPassword"').isString(),
    body('password', 'Длина парля от 5 до 32 символов').isLength({ min: 5, max: 32 }),
], controller.login);
router.post('/logout', controller.logout);
router.get('/refresh', controller.refresh);

export { router }