const mongoose = require("mongoose");

const JobApplicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  contactNumber: { type: String, required: true },
  interest: { type: String, required: true },
  education: { type: String, required: true },
  remark: { type: String },
  cv: { type: String}, 
}, { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } });

module.exports = mongoose.model("JobApplication", JobApplicationSchema);

