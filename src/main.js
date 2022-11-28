import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import * as Route from "./routes/index.mjs";
import errorMiddleware from "./middleware/error.middleware.mjs";

const app = express();
const router = Route.router;

const PORT = process.env.APP_PORT;
const IP_ADD = process.env.APP_IP;
//const URL_DB = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWD}@cluster0.nvgn15a.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
//const URL_DB = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
const URL_DB = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWD}@n1-c2-mongodb-clevercloud-customers.services.clever-cloud.com:${process.env.DB_PORT},n2-c2-mongodb-clevercloud-customers.services.clever-cloud.com:${process.env.DB_PORT}/${process.env.DB_NAME}?replicaSet=rs0`;

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use('/api', router);
app.use(errorMiddleware);

const start = async () => {
    try {
        await mongoose.connect(URL_DB);

        app.listen(PORT, () => console.log(`Listen to http://${IP_ADD}:${PORT}`));
    } catch (err) {
        console.log('My error out --->');
        console.log(err);
    }
}

start();
