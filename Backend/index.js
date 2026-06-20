const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

// Config
dotenv.config();

// Validate critical env vars before anything else
const jwtConfig = require("./config/jwt");
try {
  jwtConfig();
} catch (error) {
  console.error("[FATAL] JWT configuration error:", error.message);
  process.exit(1);
}

// Database
const dbConnect = require("./config/dbconnect");
const cloudinaryConnect = require("./config/cloudinary");

// Middlewares
const { errorMiddleware } = require("./middleware/errorMiddleware");

// Routes
const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const projectRoutes = require("./routes/projectRoutes");
const skillRoutes = require("./routes/skillRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const experienceRoutes = require("./routes/experienceRoutes");
const educationRoutes = require("./routes/educationRoutes");
const profileRoutes = require("./routes/profileRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

// App
const app = express();

// Middlewares
app.use(express.json());

app.use(cookieParser());

app.use(morgan("dev"));

// CORS Configuration — allow env override, fall back to a permissive default
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
      "https://alok-portfolio-7di6.onrender.com",
      "https://portfolio-frontend-2s15.onrender.com",
    ];

// Accept any *.onrender.com origin so new Render deployments work without
// updating this list.  Remove or narrow this check for stricter security.
const isRenderOrigin = (origin) =>
  origin && origin.endsWith(".onrender.com");

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (server-to-server, curl, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin) || isRenderOrigin(origin)) {
        callback(null, true);
      } else {
        console.warn(`[CORS] Blocked request from origin: ${origin}`);
        callback(null, false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Routes
app.use("/api/auth", authRoutes);

app.use("/api/contact", contactRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/skills", skillRoutes);

app.use("/api/certificates", certificateRoutes);

app.use("/api/experience", experienceRoutes);

app.use("/api/education", educationRoutes);

app.use("/api/profile", profileRoutes);

app.use("/api/resume", resumeRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("Portfolio Backend Running");
});

// Error Middleware
app.use(errorMiddleware);

// Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await dbConnect();
    cloudinaryConnect();
    app.listen(PORT, () => {
      console.log(`Server Running On Port ${PORT}`);
    });
  } catch (error) {
    console.error("[FATAL] Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
