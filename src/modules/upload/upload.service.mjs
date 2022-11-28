import mongoose from 'mongoose';
import * as fs from 'node:fs';
import * as fsAsync from "node:fs/promises";
import { OutUserDto } from '../../dtos/outuser.dto.mjs';
import { ApiError } from "../../exceptions/api.error.mjs";
import { Profile } from '../../models/profile.model.mjs';
import { User } from '../../models/user.model.mjs';

class UploadService {
    async getAll(path) {
        try {
            const files = (await fsAsync.readdir(path)).sort().reverse();
            return { 'totalFiles': files.length, files };
        } catch (err) {
            throw err;
        }
    }

    async upAvatar(upData) {
        const { id, originalname, filename } = upData;

        //--- обернем в транзакцию
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            await Profile.findOneAndUpdate({ user_id: id }, { originName: originalname, avatarName: filename }, { returnDocument: 'after', session: session });
            await session.commitTransaction();
        } catch (err) {
            await session.abortTransaction();
            throw ApiError.RollbackTransact(err.message);
        }

        const mapAggregate = await User.aggregate([
            {
                $lookup: {
                    from: 'profiles',
                    localField: '_id',
                    foreignField: 'user_id',
                    as: 'profile'
                }
            },
            {
                $match: {
                    _id: mongoose.Types.ObjectId(id)
                }
            }]);

        let userData = new OutUserDto(mapAggregate.find((el) => el._id.toString() === id));

        return { ...userData }

    }

    checkStorage(path) {
        this.isDir(path, (res) => {
            if (!res) {
                this.createDir(path);
            }
        });
    }

    /**
     * проверка на существование каталога
     * @param {string} path путь к каталогу String
     * @return true в случае существования, иначе false
     */
    isDir(path, callback) {
        fs.stat(path, (err) => {
            if (!err) {
                callback(true);
            } else if (err.code === 'ENOENT') {
                callback(false);
            }
        });
    }

    /**
     * создает каталог рекурсивно, независимо от его существования
     * @param {String} path 
     */
    createDir(path) {
        fs.mkdir(path, { recursive: true }, (err) => {
            if (err) throw err;
        });
    }
}

const classObject = new UploadService();
export { UploadService, classObject };