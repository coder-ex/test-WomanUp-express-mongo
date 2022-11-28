import { Router } from "express";
import fetch from 'node-fetch';
import { Role } from "../models/role.model.mjs";
import { User } from "../models/user.model.mjs";
import { Todo } from "../models/todo.model.mjs";

const router = new Router();

//--- TODO необходимо переписать под CLI команду
router.get('/roles', async (req, res, next) => {
    try {
        const roles = await Role.find();

        let nameRole = [];

        if (!roles.find((r) => r.value === 'ADMIN')) {
            const adminRole = new Role({ value: 'ADMIN' });
            await adminRole.save();
            nameRole.push('ADMIN');
        }

        if (!roles.find((r) => r.value === 'USER')) {
            const userRole = new Role();
            await userRole.save();
            nameRole.push('USER');
        }

        if (nameRole.length === 0) {
            return res.status(200).json({ 'success': `roles already exist` })
        }

        res.status(200).json({ 'success': `roles created: [ ${nameRole} ]` })
    } catch (err) {
        next(err);
    }
});

router.get('/todos', async (req, res, next) => {
    const url = 'https://jsonplaceholder.typicode.com/todos';
    try {
        const response = await fetch(url);
        const todos = await response.json();

        const users = await User.find();
        const userCollectionCount = await User.count();
        const limit = Math.floor(todos.length / (userCollectionCount - 1));
        let offset = 0;

        const roleUser = await Role.findOne({ value: 'USER' }).exec();

        const newTodos = [];
        for (let u of users) {
            if (u.role[0].toString() === roleUser.id) {
                let cnt = 0;
                for (let i = offset; i < todos.length; i++) {
                    todos[i].userId = u._id;

                    newTodos.push({
                        user_id: u._id,
                        title: `${todos[i].title}. [ ${i}. ${u.email} ]`,
                        completed: todos[i].completed,
                    });

                    cnt++;
                    if (limit < cnt) {
                        offset += limit;
                        break;
                    }
                }
            } else {
                continue;
            }
        }

        await Todo.insertMany(newTodos, { ordered: true });

        res.status(200).json({ 'total': newTodos.length, ...newTodos });
    } catch (err) {
        next(err);
    }
});

export { router };