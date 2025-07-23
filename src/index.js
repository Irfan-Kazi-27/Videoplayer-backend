import express from "express"
import dotenv from "dotenv"
import { app } from "./app.js";

import connectDB from "./db/connection.js"

dotenv.config({path:".env"})

connectDB()
.then(()=>{
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
        
    });
}).catch((error) => {
    console.error("Database connection failed:", error);
} );

// app.get("/", (req, res) => {
//     res.send("Welcome to Video Playlist API");  
// });

