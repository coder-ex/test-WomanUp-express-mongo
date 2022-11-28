import { ApiError } from "../../exceptions/api.error.mjs";
import { classObject as uploadService } from "./upload.service.mjs"

/**
 * класс предоставляет функционал загрузки и просмотра аватарок пользователей <br/>
 */
class UploadController {
    /**
     * просмотр всех загруженных аватарок на сервере
     * @param {object} req - запрос
     * @param {object} res - ответ
     * @param {object} next - продолжение сопоставления последующих маршрутов
     * @returns {json} возвращает ответ в JSON формате
     */
    async getAll(req, res, next) {
        try {
            uploadService.checkStorage(req.uploadsDir);
            const files = await uploadService.getAll(req.uploadsDir);
            res.json({ data: { ...files } });
        } catch (err) {
            next(err);
        }
    }

    /**
     * загрузка аватара на сервер
     * @param {object} req - запрос
     * @param {object} res - ответ
     * @param {object} next - продолжение сопоставления последующих маршрутов
     * @returns {json} возвращает ответ в JSON формате
     */
    async upAvatar(req, res, next) {
        try {
            const id = req.params.id;
            if (id !== req.user.id) {
                throw ApiError.Forbidden();
            }

            const data = await uploadService.upAvatar({ id, ...req.file });
            res.json({ data: { ...data } });
        } catch (err) {
            next(err);
        }
    }
}

const classObject = new UploadController();
export { UploadController, classObject };