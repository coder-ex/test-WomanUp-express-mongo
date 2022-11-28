import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    // id формируется автоматом
    title: { type: String, index: true, required: true },
    completed: { type: Boolean, default: false },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
}, { timestamps: true, /*versionKey: false*/ }); // оставим версионность документов

const Todo = mongoose.model('Todo', todoSchema);
export { Todo }