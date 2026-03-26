const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");
const { protect } = require("../middleware/auth");

router.post("/send", protect, async (req, res) => {
  const { complaintId, message } = req.body;

  const chat = await Chat.create({
    complaint: complaintId,
    sender: req.user.id,
    message
  });

  res.json(chat);
});

router.get("/:complaintId", protect, async (req, res) => {
  const chats = await Chat.find({ complaint: req.params.complaintId })
    .populate("sender", "name")
    .sort({ createdAt: 1 });

  res.json(chats);
});

module.exports = router;