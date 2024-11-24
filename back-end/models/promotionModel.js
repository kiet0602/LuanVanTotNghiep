import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema({
  promotionName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

promotionSchema.virtual("isActive").get(function () {
  const currentDate = new Date();
  return currentDate >= this.startDate && currentDate <= this.endDate;
});

const promotionModel = mongoose.model("Promotion", promotionSchema);

export default promotionModel;
