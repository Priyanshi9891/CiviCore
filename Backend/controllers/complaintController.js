const Complaint = require("../models/Complaint");

const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ msg: "Complaint not found" });
    }

    // Only owner can delete
    if (complaint.citizen.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await complaint.deleteOne();

    res.json({ msg: "Complaint deleted successfully" });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
