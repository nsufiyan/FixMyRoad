const mongoose = require("mongoose");
const complaintSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    description: { type: String, required: true },
    latitude: { type: Number },
    longitude: { type: Number },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "resolved", "rejected"],
      default: "pending",
    },
    resolvedUrl: { type: String },
    resolvedComment: { type: String },
    resolvedOn: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("complaint", complaintSchema);
