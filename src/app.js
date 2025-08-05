import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

export const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials : true
}))
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(cookieParser());

//Router Importing 
import userRouter from "./routes/users.routes.js"
import tweetRouter from "./routes/tweet.routes.js"


//declaring Routesa
app.use("/api/v1/users", userRouter);
//https/api/v1/users
app.use("/api/v1/tweets",tweetRouter)
// https/api/v1/tweets/c/:owner

