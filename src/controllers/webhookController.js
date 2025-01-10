import { sendWelcomeMsg } from "../services/welcomeService.js";
import { sendCategories } from "../services/categoryService.js";
import { sendFeaturedProducts } from "../services/featureService.js";
import { sendMessageToWhatsApp } from "../services/messageService.js";

// Webhook verification
export const verifyWebhook = (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  const {
    "hub.mode": mode,
    "hub.verify_token": token,
    "hub.challenge": challenge,
  } = req.query;

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.status(403).send("Forbidden");
  }
};

// Handle incoming messages from WhatsApp
export const handleIncomingMessage = async (req, res) => {
  const { entry } = req.body;

  if (entry && entry[0]?.changes[0]?.value?.messages) {
    const message = entry[0].changes[0].value.messages[0];
    const from = message.from;
    const name = entry[0].changes[0].value.contacts[0].profile.name;

    // Handle text messages
    if (message.text) {
      const text = message.text.body.toLowerCase();

      if (text === "hi" || text === "hello") {
        // Send welcome message
        await sendWelcomeMsg(from, name);

        try {
          // Send featured products after welcome message
          await sendFeaturedProducts(from);

          // Send categories prompt
          const categoryMessageData = {
            messaging_product: "whatsapp",
            to: from,
            type: "text",
            text: {
              body: "If you'd like to see available tour packages, type /categories",
            },
          };

          await sendMessageToWhatsApp(categoryMessageData);
        } catch (error) {
          console.error("Error sending featured products:", error);
        }
      } else if (text === "/categories") {
        // Send categories list
        await sendCategories(from);
      }
    }

    res.sendStatus(200); // Acknowledge the request
  }
};
