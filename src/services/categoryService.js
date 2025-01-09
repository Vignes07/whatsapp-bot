const axios = require("axios");
const messageService = require("./messageService");

require("dotenv").config();

async function fetchCategories() {
  const username = process.env.Consumer_Key;
  const password = process.env.Consumer_Secret;

  const auth = Buffer.from(username + ":" + password).toString("base64");

  try {
    const response = await axios.get(
      "https://maduratravel.com/api-call/wc/v3/products/categories",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

async function sendCategories(to) {
  try {
    const categories = await fetchCategories();
    const messageData = messageService.createCategoryMessage(to, categories);
    messageService.sendMessageToWhatsApp(messageData);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}

module.exports = { fetchCategories, sendCategories };
