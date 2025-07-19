
import dotenv from "dotenv"
import {DB_NAME} from "./constant.js"
import connectDB from "./db/connection.js"

dotenv.config({path:".env"})

connectDB();

