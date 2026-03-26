const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("DB Connected");

    const email = "admin@civicore.com";

    const existing = await User.findOne({ email });
    if (existing) {
      console.log("Admin already exists");
      process.exit();
    }

    const hash = await bcrypt.hash("admin123", 10);

    await User.create({
      name: "Priyanshu",
      email,
      password: hash,
      role: "admin"
    });

    console.log("Admin created successfully");
    process.exit();
  })
  .catch(err => console.log(err));