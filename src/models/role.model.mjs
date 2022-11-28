import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
    // id формируется автоматом
    value: { type: String, unique: true, default: 'USER' },
}, { versionKey: false });  // отключим версионность документов

const Role = mongoose.model('Role', roleSchema);
export { Role }