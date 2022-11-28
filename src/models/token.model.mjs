import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    // id формируется автоматом
    refreshToken: { type: String, required: false, index: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { /*versionKey: false*/ });   // оставим версионность документов

const Token = mongoose.model('Token', tokenSchema);
export { Token }