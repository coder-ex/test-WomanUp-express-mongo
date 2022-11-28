import { Router } from "express";
import { router as authRouter } from "./auth.route.mjs";
import { router as userRouter } from "./user.route.mjs";
import { router as uploadRouter } from "./upload.router.mjs";
import { router as todoRouter } from "./todo.route.mjs";
import { router as seedRouter } from "./seed.route.mjs";

const router = new Router();

router.use('/seed', seedRouter);
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/upload', uploadRouter);
router.use('/todo', todoRouter);

export { router }