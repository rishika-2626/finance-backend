const express = require("express"); // used to create the backend server
const dotenv = require("dotenv"); // loads env variables
const cors = require("cors"); // without cors browser blocks requests.. this allows your fronted and backend to communicate if they running on different ports/domains.
const connectDB = require("./src/config/db"); // connects to the database

const recordRoutes = require("./src/routes/recordRoutes");  // api end points
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");

const rateLimit = require("express-rate-limit");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // max 100 requests per IP
});

app.use(limiter);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/records", recordRoutes);
app.use("/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


/*
Start server
   ↓
Load env variables
   ↓
Connect database
   ↓
Apply middleware
   ↓
Apply rate limiting
   ↓
Register routes
   ↓
Listen on port
*/