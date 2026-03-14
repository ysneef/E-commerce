import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: process.env.DB_DATABASE
    });
    console.log("Database connected!")
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

export default dbConnect

