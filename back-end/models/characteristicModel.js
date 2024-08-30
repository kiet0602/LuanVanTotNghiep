import mongoose from "mongoose";

const characteristicSchema = new mongoose.Schema({
  characteristicName: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const characteristicModel = mongoose.model(
  "Characteristic",
  characteristicSchema
);
export default characteristicModel;
