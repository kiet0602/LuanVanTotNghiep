const mongoose = require("mongoose");

const characteristicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  family: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Family", // Tham chiếu đến model Category
    required: true,
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
