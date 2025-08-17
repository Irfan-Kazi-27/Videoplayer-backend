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
import commentRouter from "./routes/comment.routes.js"
import videoRouter from "./routes/video.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import likeRouter from "./routes/like.routes.js"

//declaring Routes
app.use("/api/v1/users", userRouter);
//https/api/v1/users
app.use("/api/v1/tweets",tweetRouter)
// https/api/v1/tweets/c/:owner
app.use("/api/v1/comments",commentRouter)
//https/api/v1/comments
app.use("/api/v1/videos",videoRouter)
//https/api/v1/videos/
app.use("/api/v1/playlist",playlistRouter)
//https/api/v1/playlist/
app.use("/api/v1/likes",likeRouter)
