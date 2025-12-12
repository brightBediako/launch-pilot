import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import express from "express";
import path from "path";
import compression from "compression";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import morgan from "morgan";
import dbConnect from "../config/dbConnect.js";
import { globalErrhandler, notFound } from "../middleware/globalErrHandler.js";
import logger from "../utils/logger.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../config/swagger.js";
// API routes
import authRoutes from "../routes/authRoutes.js";
import userRoutes from "../routes/userRoutes.js";
import launchRoutes from "../routes/launchRoutes.js";
import draftRoutes from "../routes/draftRoutes.js";
import partnerRoutes from "../routes/partnerRoutes.js";
import taskRoutes from "../routes/taskRoutes.js";
import launchPageRoutes from "../routes/launchPageRoutes.js";
import analyticsRoutes from "../routes/analyticsRoutes.js";

//db connect
dbConnect();
const app = express();

//cors - Allow all origins in development for easier debugging
export const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL || "http://localhost:3000"
      : true, // Allow all origins in development
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ],
  exposedHeaders: ["Authorization"],
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Security middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(hpp());

// use cors middleware
app.use(cors(corsOptions));

// Performance middleware
app.use(compression());

// HTTP request logging
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined", { stream: logger.stream }));
} else {
  app.use(morgan("dev"));
}

// pass incoming data (allow larger payloads for image uploads)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Favicon route - ignore favicon requests
app.get("/favicon.ico", (req, res) => res.status(204).end());

// Swagger API Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "LaunchPilot API Docs",
  })
);
// JSON endpoint for OpenAPI spec
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/launches", launchRoutes);
app.use("/api/drafts", draftRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/launch-pages", launchPageRoutes);
app.use("/api/analytics", analyticsRoutes);

// error middleware
app.use(notFound);
app.use(globalErrhandler);

export default app;
