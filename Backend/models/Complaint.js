const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ["water", "electricity", "road", "garbage", "other"],
    default: "other"
  },
  location: {
    type: String,
    required: true
  },
  image: {
  type: String
},
  status: {
    type: String,
    enum: ["pending", "assigned", "in-progress", "resolved"],
    default: "pending"
  },
  citizen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  }
},{
  timestamps:true
});

module.exports = mongoose.model("Complaint", complaintSchema);