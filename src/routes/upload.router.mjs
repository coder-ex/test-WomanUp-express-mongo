import { Router } from 'express';
import multer from 'multer';
import path, { dirname } from "node:path";
import { fileURLToPath } from 'url';
import { default as authMiddleware } from "../middleware/auth.middleware.mjs";
import { default as uploadMiddleware } from "../middleware/upload.middleware.mjs";
import { classObject as controller } from "../modules/upload/upload.controller.mjs";

//--- т.к. в ES6 нет __dirname & __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadsDir = path.join(__dirname, "../public", "uploads");

const fileFilter = (req, file, cb) => {
    cb(null, file.mimetype.match(/^image\//));
};

const upload = multer({
    dest: uploadsDir,
    fileFilter,
    limits: { fileSize: 1 * 100 * 1024 }   // max size 100 kb
});

const router = new Router();

router.get("/", authMiddleware, uploadMiddleware, controller.getAll);
router.put("/:id", authMiddleware, upload.single('avatar'), controller.upAvatar);

export { router }