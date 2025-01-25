import mongoose from "mongoose";
import { config } from "dotenv";
config()

type ConnectionObject = {
    isConnected?: number;
}

const { DB_CONNECTION_STRING } = process.env;
const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
    
    if (connection.isConnected) {
        console.log('Already Connected to database');
        return;
    }

    try {
        const db = await mongoose.connect(DB_CONNECTION_STRING || '');

        connection.isConnected = db.connection.readyState;
        console.log('db connect successfully');
    } catch (error) {
        console.log(`Database connection failed: ${error}`);
        process.exit(1);
    }
}

export default dbConnect;