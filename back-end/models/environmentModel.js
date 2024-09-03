import mongoose from "mongoose";

const environmentSchema = new mongoose.Schema({
  nameEnviroment: {
    type: String,
    required: true,
  },
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
