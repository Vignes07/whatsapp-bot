const axios = require("axios");
require("dotenv").config();

const createWelcomeMessage = (to, customerName) => {
  return {
    messaging_product: "whatsapp",
    to: to,
    type: "template",
    template: {
      name: "madura_welcome",
      language: {
        code: "en",
      },
      components: [
        {
          type: "header",
          parameters: [
            {
              type: "image",
              image: {
                id: "1821115531963896",
              },
            },
          ],
        },
        {
          type: "body",
          parameters: [
            {
              type: "text",
              parameter_name: "customer_name",
              text: customerName,
            },
          ],
        },
      ],
    },
  };
};

const createCategoryMessage = (to, categories) => {
  const sections = [
    {
      title: " ",
      rows: categories.map((category) => ({
        id: category.id,
        title: category.name,
      })),
    },
  ];

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
        text: "Madura Travel Services",
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

module.exports = {
  createWelcomeMessage,
  createCategoryMessage,
  sendMessageToWhatsApp,
};
