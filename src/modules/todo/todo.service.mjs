import mongoose, { mongo } from "mongoose";
import { TodoDto } from "../../dtos/todo.dto.mjs";
import { ApiError } from "../../exceptions/api.error.mjs";
import { Todo } from "../../models/todo.model.mjs"
import { User } from "../../models/user.model.mjs";

class TodoService {
    async addTodo(id, title) {
        //--- обернем в транзакцию
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const user = await User.findById(id).exec();
            const todo = await Todo.create([{ title, completed: false, user_id: user._id }], { session });
            await session.commitTransaction();

            return { user: user.email, todo }
        } catch (err) {
            await session.abortTransaction();
            throw ApiError.RollbackTransact(err.message);
        }
    }

    async getOne(params = {}) {
        try {
            const { userId, todoId } = params;

            const todoData = await Todo.findOne({ _id: mongoose.Types.ObjectId(todoId), user_id: mongoose.Types.ObjectId(userId) }).select('title completed createdAt').exec();
            if (!todoData) {
                throw ApiError.BadRequest(`пользователю задача id: ${todoId} не принадлежит, доступ закрыт`);
            }

            return { todo: todoData };
        } catch (err) {
            throw err;
        }
    }

    async upTodo(params = {}) {
        const { userId, todoId, title, completed } = params;

        const todoData = await Todo.findOne({ _id: mongoose.Types.ObjectId(todoId), user_id: mongoose.Types.ObjectId(userId) }).select('title completed createdAt').exec();
        if (!todoData) {
            throw ApiError.BadRequest(`пользователю задача id: ${todoId} не принадлежит, доступ закрыт`);
        }

        //--- обернем в транзакцию
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const todoData = await Todo.findByIdAndUpdate(todoId, { title, completed }, { returnDocument: 'after', session: session, upsert: false });
            await session.commitTransaction();

            return { todo: todoData };
        } catch (err) {
            await session.abortTransaction();
            throw ApiError.RollbackTransact(err.message);
        }
    }

    async getAllUser(reqQuery) {
        //--- реализация через timestamp (2022-11-01T23:33:33.002Z) даст пропуск, если в одно время несколько значений
        const { id, limit, skip, sort = 'asc', completed = 'false' } = reqQuery;

        if (sort !== 'asc' && sort !== 'desc') {
            throw new ApiError(403, 'Поле sort: сортировка asc по возрастанию / desc по убыванию');
        }

        const limitQ = parseInt(limit);
        const offset = parseInt(skip);
        const completedQ = completed === 'true' ? true : false;

        try {
            const todoCollection = await Todo.aggregate([
                {
                    $sort: {
                        updatedAt: 1
                    }
                },
                { $skip: offset },
                {
                    $match: {
                        user_id: mongoose.Types.ObjectId(id),
                        completed: completedQ
                    }
                },
                { $limit: limitQ },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user_id',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
            ]);

            let todoData = [];
            for (let el of todoCollection) {
                todoData.push(new TodoDto(el));
            }

            const todoTotal = await Todo.find({ user_id: id }).where({ completed: completedQ }).count()
            const totalPages = Math.ceil(todoTotal / limitQ);
            const currentPage = Math.ceil(offset / limitQ);

            return {
                data: todoData,
                paging: {
                    total: todoTotal,
                    page: currentPage,
                    pages: totalPages,
                },
            };
        } catch (err) {
            throw err;;
        }
    }

    async getAll(reqQuery) {

        //--- реализация через timestamp (2022-11-01T23:33:33.002Z) даст пропуск, если в одно время несколько значений
        const { limit, skip, sort = 'asc' } = reqQuery;

        if (sort !== 'asc' && sort !== 'desc') {
            throw new ApiError(403, 'Поле sort: сортировка asc по возрастанию / desc по убыванию');
        }

        const limitQ = parseInt(limit);
        const offset = parseInt(skip);

        try {
            const mapAggregate = await Todo.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user_id',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $sort: {
                        updatedAt: 1
                    }
                },
                { $skip: offset },
                { $limit: limitQ }
            ]);

            let todoData = [];
            for (let el of mapAggregate) {
                todoData.push(new TodoDto(el));
            }

            const todoTotal = await Todo.find({}).count()
            const totalPages = Math.ceil(todoTotal / limitQ);
            const currentPage = Math.ceil(offset / limitQ);

            return {
                data: todoData,
                paging: {
                    total: todoTotal,
                    page: currentPage,
                    pages: totalPages,
                },
            };
        } catch (err) {
            throw err;
        }
    }
}

const classObject = new TodoService();
export { TodoService, classObject };