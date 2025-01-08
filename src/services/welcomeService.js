const axios = require("axios");
const messageService = require("./messageService");

async function sendWelcomeMsg(to, name) {
  try {
    const messageData = messageService.createWelcomeMessage(to, name);
    messageService.sendMessageToWhatsApp(messageData);
  } catch (error) {
    console.error("Error Sending message", error);
  }
}

module.exports = { sendWelcomeMsg };
