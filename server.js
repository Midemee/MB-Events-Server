require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter = require("./Routes/userRouter");
const eventRouter = require("./Routes/eventRouter");

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const allowedOrigins = [
  "http://localhost:5173",
  "https://mb-events-indol.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    console.log("🔍 Incoming request from:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Test route
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "MB events server" });
});

// Routers
app.use("/api/user", userRouter);
app.use("/api/user/events", eventRouter);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port: ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
startServer();

// Error route
app.use((req, res) => {
  res.status(404).json({ success: false, message: "ROUTE NOT FOUND" });
});
