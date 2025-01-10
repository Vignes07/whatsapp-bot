import axios from "axios";

// Function to create a welcome message using a WhatsApp template
export const createWelcomeMessage = (to, customerName) => {
  return {
    messaging_product: "whatsapp",
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

const truncateText = (text, limit) => {
  if (text.length > limit) {
    return text.substring(0, limit) + "..."; // Truncate and add ellipsis
  }
  return text; // Return the text as is if it's within the limit
};

// Function to create an interactive message (list type)
export const createInteractiveMessage = (
  to,
  items,
  title,
  bodyText,
  buttonLabel,
  footerText
) => {
  const MAX_ROWS = 10;

  const section = {
    title: " ",
    rows: items.slice(0, MAX_ROWS).map((item) => {
      const truncatedTitle = truncateText(item.name, 20);

      const truncatedDescription = truncateText(item.description, 69);

      return {
        id: item.id,
        title: truncatedTitle,
        description: truncatedDescription,
      };
    }),
  };

  return {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: to,
    type: "interactive",
    interactive: {
      type: "list",
      header: {
        type: "text",
        text: title, // Title for the message
      },
      body: { text: bodyText }, // Body text for the message
      footer: { text: footerText }, // Footer text for the message
      action: {
        button: buttonLabel, // Label for the button
        sections: [section], // The section that contains rows
      },
    },
  };
};

export const sendMessageToWhatsApp = async (messageData) => {
  const url = `https://graph.facebook.com/v21.0/${process.env.PHONE_NUMBER_ID}/messages`;

  try {
    const response = await axios.post(url, messageData, {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Message sent successfully:", response.data);
  } catch (error) {
    console.error(
      "Error sending message:",
      error.response ? error.response.data : error.message
    );
  }
};
