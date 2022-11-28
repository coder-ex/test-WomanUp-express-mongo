import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    // id формируется автоматом
    email: { type: String, unique: true, required: true, lowercase: true },
    password: { type: String, required: true },
    role: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
    isActivated: { type: Boolean, default: false },
    activationLink: { type: String }
}, { /*versionKey: false*/ }); // оставим версионность документов

const User = mongoose.model('User', userSchema);
export { User }