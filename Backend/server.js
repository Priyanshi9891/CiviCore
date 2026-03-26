const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
// app.use(cors());
app.use(cors({
  origin: "http://localhost:5173", // react vite default
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("CiviCore API Running");
});

app.use("/api/auth", require("./routes/auth"));      // login/register
app.use("/api/admin", require("./routes/admin"));    // admin routes
app.use("/api/complaints", require("./routes/complaints")); // complaints
app.use("/api/chat", require("./routes/chat"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);