// models/Variant.js
import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const VariantModel = mongoose.model("Variant", variantSchema);

export default VariantModel;
