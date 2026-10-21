const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      match: /^[A-Za-z0-9-]+$/,
    },
    name: { type: String, required: true, trim: true },
    classification: {
      type: String,
      required: true,
      enum: ["Individual", "Corporate"],
    },
    riskCategory: {
      type: String,
      required: true,
      enum: ["Low", "Moderate", "High"],
    },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true },
    advisor: { type: String, required: true },
    status: { type: String, required: true },
    portfolioValue: { type: Number, required: true, min: 0 },
    lastReview: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    nextReview: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    kycComplete: { type: Boolean, required: true },
    objective: { type: String, required: true },
    notes: { type: String, required: true },
  },
  { versionKey: false, strict: "throw" },
);
module.exports = mongoose.model("Client", schema);
