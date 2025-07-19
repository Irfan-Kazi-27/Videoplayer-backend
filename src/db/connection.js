import mongoose from 'mongoose';
import {DB_NAME} from "../constant.js"

 const connectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`DB connected SucessFully to ${DB_NAME} host by ${connectionInstance.connection.host}`);
        
        
        } catch (error) {
        console.log("Connection Failed :",error);
        process.exit(1);
    }
}
export default connectDB;