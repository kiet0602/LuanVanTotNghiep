import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      varianId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Variant", // Tham chiếu đến mô hình Variant
      },
      quantity: {
        type: Number,
        default: 1,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    default: 0,
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

const cartModel = mongoose.model("Cart", cartSchema);

export default cartModel;
