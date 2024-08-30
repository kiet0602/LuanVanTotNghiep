const mongoose = require("mongoose");

const familySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const familyModel = mongoose.model("Family", familySchema);
export default familyModel;
