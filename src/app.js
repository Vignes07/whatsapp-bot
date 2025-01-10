import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import webhookRoutes from "./routes/webhook.js";

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/webhook", webhookRoutes);

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
