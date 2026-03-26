const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register (Citizen)
// Register (Citizen)
router.post("/register", async(req,res)=>{
  try{
    const { name, email, password } = req.body;

    if(!name || !email || !password){
      console.log("❌ Missing fields");
      return res.status(400).json({ msg:"All fields required" });
    }

    const existing = await User.findOne({ email });
    if(existing){
      console.log("❌ User already exists");
      return res.status(400).json({ msg:"User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await User.create({
      name,
      email,
      password: hash,
      role:"citizen"
    });

    res.json({ msg:"Registered successfully" });

  }catch(err){
    res.status(500).json({ error:err.message });
  }
});
// Login (All roles)
router.post("/login", async(req,res)=>{
  try{
    
    const { email, password } = req.body;

    if(!email || !password){
      return res.status(400).json({ msg:"Email and password required" });
    }

    const user = await User.findOne({ email });
   
  // console.log("LOGIN USER:", user);
    if(!user) return res.status(400).json({ msg:"Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if(!match) return res.status(400).json({ msg:"Invalid credentials" });

    const token = jwt.sign(
      { id:user._id, role:user.role },
      process.env.JWT_SECRET,
      { expiresIn:"1d" }
    );

    res.json({
      token,
      user:{
        id:user._id,
        name:user.name,
        role:user.role
      }
    });

  }catch(err){
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error:err.message });
  }
});

module.exports = router;
