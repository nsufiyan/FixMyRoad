const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, unique: true, required: true },
    phone: { type: String, unique: true, required: true },
    password: { type: String },
    address: { type: String },
    userType: {
      type: String,
      enum: ["admin", "citizen"],
      default: "citizen",
    },
    points: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", userSchema);
