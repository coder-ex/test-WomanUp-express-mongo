import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    // id формируется автоматом
    name: { type: String, index: true, required: true },
    country: { type: String, index: true, required: false },
    age: { type: String, index: true, required: false },
    originName: { type: String },
    avatarName: { type: String },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
}, { timestamps: true, /*versionKey: false*/ }); // оставим версионность документов

const Profile = mongoose.model('Profile', profileSchema);
export { Profile }