import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import express from "express";
import path from "path";
import dbConnect from "../config/dbConnect.js";
import { globalErrhandler, notFound } from "../middleware/globalErrHandler.js";

//db connect
dbConnect();
const app = express();
//cors - Allow all origins in development for easier debugging
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.FRONTEND_URL ||
        "http://localhost:3000"
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

// use cors middleware
app.use(cors(corsOptions));

// pass incoming data (allow larger payloads for image uploads)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// routes
// Root route - API status
// app.get("/", (req, res) => {
//   res.json({
//     status: "success",
//     message: "Property Investment API is running",
//     version: "1.0.0",
//     endpoints: {
//       users: "/api/v1/users",
//       properties: "/api/v1/properties",
//       payments: "/api/v1/payments",
//       depositRules: "/api/v1/deposit-rules",
//       bookings: "/api/v1/bookings",
//       inquiries: "/api/v1/inquiries",
//       contracts: "/api/v1/contracts",
//       notifications: "/api/v1/notifications",
//     },
//   });
// });

// Favicon route - ignore favicon requests
app.get("/favicon.ico", (req, res) => res.status(204).end());

// API routes

// error middleware
app.use(notFound);
app.use(globalErrhandler);

export default app;
