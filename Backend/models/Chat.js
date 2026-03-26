const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  complaint: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Complaint"
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  message: String
}, { timestamps: true });

module.exports = mongoose.model("Chat", chatSchema);