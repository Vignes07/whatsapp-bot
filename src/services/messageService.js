const axios = require("axios");
require("dotenv").config();

const createCategoryMessage = (to, categories) => {
  // Limit the number of sections to 10
  const limitedCategories = categories.slice(0, 10);

  const sections = limitedCategories.map((category, index) => ({
    title: `Category ${index + 1}`, // Ensure this is a valid string
    rows: [
      {
        id: category.slug, // Use the slug as the row ID
        title: category.name, // Use the name as the row title
        description: `Browse products in the ${category.name} category.`,
      },
    ],
  }));

  return {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: to,
    type: "interactive",
    interactive: {
      type: "list",
      header: {
        type: "text",
        text: "Select a category to explore our products.",
      },
      body: {
        text: "Choose a category from the list below:",
      },
      footer: {
        text: "Powered by WhatsApp Bot",
      },
      action: {
        button: "Select Category",
        sections: sections,
      },
    },
  };
};

function sendMessageToWhatsApp(messageData) {
  const url = `https://graph.facebook.com/v21.0/${process.env.PHONE_NUMBER_ID}/messages`;

  axios
    .post(url, messageData, {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      console.log("Message sent successfully:", response.data);
    })
    .catch((error) => {
      if (error.response) {
        console.error("Error sending message:", error.response.data);
      } else {
        console.error("Error sending message:", error.message);
      }
    });
}

module.exports = { createCategoryMessage, sendMessageToWhatsApp };
