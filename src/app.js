import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

export const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    Credential : true
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());