import {
  createWelcomeMessage,
  sendMessageToWhatsApp,
} from "./messageService.js";

async function sendWelcomeMsg(to, name) {
  try {
    const messageData = createWelcomeMessage(to, name);
    await sendMessageToWhatsApp(messageData);
  } catch (error) {
    console.error("Error Sending welcome message:", error);
  }
}

export { sendWelcomeMsg };
