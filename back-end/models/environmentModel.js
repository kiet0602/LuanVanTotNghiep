import mongoose from "mongoose";

const environmentSchema = new mongoose.Schema({
  nameEnviroment: {
    type: String,
    required: true,
  },
  // Thêm các trường khác nếu cần
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const EnvironmentModel = mongoose.model("Environment", environmentSchema);

export default EnvironmentModel;
