import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://haidangteen3:haidangteen1234@cluster0.c5xw71l.mongodb.net/"
    );
    console.log(`Mongoose Connected successfully!`);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
export default connectDB;
