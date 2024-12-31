const mongoose = require("mongoose");

const { Schema } = mongoose;

const SelfAssessmentSchema = new mongoose.Schema({
  organization: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
  },
  report: [
    {
      category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
      subCategory: {
        type: Schema.Types.ObjectId,
        ref: "SubCategory",
      },
      targetScore: {
        type: Number,
        required: false,
      },
      prevScore: {
        type: Number,
        required: false,
      },
      score: {
        type: Number,
        required: true,
      },
      note: {
        type: String,
        required: false,
      },
    },
  ],
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SelfAssessment", SelfAssessmentSchema);
