import mongoose from 'mongoose';

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MONGO_DB connected !! DB HOST: ${conn.connection.host}`);
    } catch (error) {
        console.error(error)
        console.error(`MONGO_DB connection error ${error.message}`);
        process.exit(1);
    }
}

export default connectDb;