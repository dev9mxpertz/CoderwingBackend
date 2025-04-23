const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
        course: { type: String, required: true }, 
    },
    { timestamps: true } 
);

module.exports = mongoose.model("Application", ApplicationSchema);
