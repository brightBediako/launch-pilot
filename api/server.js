import http from "http";
import app from "./app/app.js";
import { initPaymentReminderScheduler } from "./services/paymentReminderScheduler.js";

//creating server
const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

// Initialize payment reminder scheduler
initPaymentReminderScheduler();

server.listen(PORT, console.log(`Server is up and running on port ${PORT}`));
