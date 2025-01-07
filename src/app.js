const express = require("express");
const bodyParser = require("body-parser");
const webhookController = require("./controllers/webhookController");

require("dotenv").config();

const app = express();

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Routes
app.get("/webhook", webhookController.verifyWebhook);
app.post("/webhook", webhookController.handleIncomingMessage);

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
