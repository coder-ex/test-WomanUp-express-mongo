/**
 * класс обработки ошибок api интерфейса <br/>
 */
export class ApiError extends Error {
    status;
    errors;

    /**
     * конструктор
     * @param {number} status - код ошибки
     * @param {string} message - текст ошибки
     * @param {array} errors - массив ранее полученных ошибок в данном потоке
     */
    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    /**
     * ошибка Не авторизован, код 401
     */
    static Unauthorize() {
        return new ApiError(401, 'Пользователь не авторизован');
    }

    /**
     * ошибка Запрещенный запрос, код 403
     */
    static Forbidden() {
        return new ApiError(403, 'Запрещенный запрос');
    }

    /**
     * ошибка Неверный запрос код 400
     * @param {string} message - текст ошибки
     * @param {array} errors - массив ранее полученных ошибок в данном потоке
     */
    static BadRequest(message, errors=[]) {
        return new ApiError(400, message, errors);
    }

    /**
     * ошибка Не корректная транзакция, код 1024
     * @param {string} message - текст ошибки
     * @param {array} errors - массив ранее полученных ошибок в данном потоке
     */
    static RollbackTransact(message, errors = []) {
        return new ApiError(1024, message, errors);
    }
}