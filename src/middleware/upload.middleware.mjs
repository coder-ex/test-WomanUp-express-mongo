import multer from 'multer';
import path, { dirname } from "node:path";
import { fileURLToPath } from 'url';

export default (req, res, next) => {
    if (req.method === "OPTIONS") {
        next();
    }

    //--- т.к. в ES6 нет __dirname & __filename
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const uploadsDir = path.join(__dirname, "../public", "uploads");

    req.uploadsDir = uploadsDir;
    next();
}