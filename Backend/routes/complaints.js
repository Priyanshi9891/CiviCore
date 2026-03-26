
const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");
const User = require("../models/User");
const { protect, roleCheck } = require("../middleware/auth");
const upload = require("../middleware/upload");

/* =========================
   CITIZEN CREATE COMPLAINT
========================= */

router.post(
  "/create",
  protect,
  roleCheck("citizen"),
  upload.single("image"),  
  async (req, res) => {
    try {
      const { title, description, category, location } = req.body;

      if (!title || !description || !location) {
        return res.status(400).json({ msg: "All fields required" });
      }
      console.log("USER:", req.user);
      const complaint = await Complaint.create({
        title,
        description,
        category,
        location,
        citizen:  req.user._id || req.user.id,
        image: req.file ? req.file.path : null, 
      });

      res.json({ msg: "Complaint created", complaint });

    } catch (err) {
  //      console.error("====== CREATE COMPLAINT ERROR ======");
  // console.error("Error message:", err.message);
  // console.error("Full error:", err);
  // console.error("Stack:", err.stack);
  // console.error("====================================");

  res.status(500).json({ error: err.message });
    }
  }
);
/* =========================
   ✅ CITIZEN DELETE OWN COMPLAINT
========================= */

router.delete(
  "/delete/:id",
  protect,
  roleCheck("citizen"),
  async (req, res) => {
    try {
      const complaint = await Complaint.findById(req.params.id);

      if (!complaint) {
        return res.status(404).json({ msg: "Complaint not found" });
      }

      // Ensure only owner can delete
      if (complaint.citizen.toString() !== req.user.id) {
        return res.status(401).json({ msg: "Not authorized" });
      }

      // Optional: Only allow delete if still pending
      if (complaint.status !== "pending") {
        return res.status(400).json({
          msg: "Only pending complaints can be deleted"
        });
      }

      await complaint.deleteOne();

      res.json({ msg: "Complaint deleted successfully" });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);
/* =========================
   CITIZEN VIEW OWN COMPLAINTS
========================= */
router.get("/my", protect, roleCheck("citizen"), async (req, res) => {
  try {
    const complaints = await Complaint.find({ citizen: req.user.id })
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   ADMIN VIEW ALL COMPLAINTS
========================= */
router.get("/all", protect, roleCheck("admin"), async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("citizen", "name email")
      .populate("worker", "name email")
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   ADMIN ASSIGN WORKER
========================= */
router.put("/assign/:id", protect, roleCheck("admin"), async (req, res) => {
  try {
    const { workerId } = req.body;

    const worker = await User.findById(workerId);
    if (!worker || worker.role !== "worker") {
      return res.status(400).json({ msg: "Invalid worker" });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        worker: workerId,
        status: "assigned"
      },
      { new: true }
    );

    res.json({ msg: "Worker assigned", complaint });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   WORKER VIEW TASKS
========================= */
router.get("/worker", protect, roleCheck("worker"), async (req, res) => {
  try {
    const tasks = await Complaint.find({ worker: req.user.id })
      .populate("citizen", "name email")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   WORKER UPDATE STATUS
========================= */
router.put("/status/:id", protect, roleCheck("worker"), async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = ["in-progress", "resolved"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const complaint = await Complaint.findOneAndUpdate(
      { _id: req.params.id, worker: req.user.id },
      { status },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ msg: "Complaint not found" });
    }

    res.json({ msg: "Status updated", complaint });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;