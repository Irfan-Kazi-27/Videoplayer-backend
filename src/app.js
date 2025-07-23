import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

export const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials : true
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

//Router Importing 
import userRouter from "./routes/users.routes.js"


//declaring Routesa
app.use("/api/v1/users", userRouter);


