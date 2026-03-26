

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Complaint = require("../models/Complaint"); // ✅ YOU FORGOT THIS ALSO
const { protect, roleCheck } = require("../middleware/auth");

/* =========================
   ADMIN CREATE WORKER
========================= */
router.post("/create-worker", protect, roleCheck("admin"), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "Worker already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const worker = await User.create({
      name,
      email,
      password: hash,
      role: "worker"
    });

    res.json({
      msg: "Worker created successfully",
      worker: {
        id: worker._id,
        name: worker.name,
        email: worker.email,
        role: worker.role
      }
    });

  } catch (err) {
    console.error("CREATE WORKER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   GET ALL WORKERS
========================= */
router.get("/workers", protect, roleCheck("admin"), async (req, res) => {
  try {
    const workers = await User.find({ role: "worker" }).select("-password");
    res.json(workers);
  } catch (err) {
    console.error("GET WORKERS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   TRACK WORKER PERFORMANCE
========================= */
router.get("/worker-performance", protect, roleCheck("admin"), async (req, res) => {
  try {
    const workers = await User.find({ role: "worker" });

    const performance = await Promise.all(
      workers.map(async (worker) => {
        const assigned = await Complaint.countDocuments({ worker: worker._id });
        const resolved = await Complaint.countDocuments({
          worker: worker._id,
          status: "resolved"
        });

        return {
          _id: worker._id,
          name: worker.name,
          assigned,
          resolved,
          completionRate:
            assigned > 0
              ? ((resolved / assigned) * 100).toFixed(1)
              : 0
        };
      })
    );

    res.json(performance);
  } catch (err) {
    console.error("WORKER PERFORMANCE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;