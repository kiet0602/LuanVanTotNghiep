import mongoose from "mongoose";

const classificationSchema = new mongoose.Schema({
  classificationName: {
    type: String,
    required: true,
    trim: true,
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

// Tạo model từ schema
const ClassificationModel = mongoose.model(
  "Classification",
  classificationSchema
);

export default ClassificationModel;
