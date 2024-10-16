import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    street: {
      // Tên đường và số nhà
      type: String,
      required: true,
    },
    ward: {
      // Xã
      type: String,
      required: true,
    },
    district: {
      // Huyện
      type: String,
      required: true,
    },
    province: {
      // Tỉnh/Thành phố
      type: String,
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const AddressModel = mongoose.model("Address", addressSchema);

export default AddressModel;
