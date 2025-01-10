import {
  createInteractiveMessage,
  sendMessageToWhatsApp,
} from "./messageService.js";
import apiClient from "./apiClient.js";

// Fetch categories from the external API
export const fetchCategories = async () => {
  try {
    const response = await apiClient.get("/products/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Send categories as an interactive message
export const sendCategories = async (to) => {
  try {
    const categories = await fetchCategories(); // Fetch categories from the API
    const messageData = createInteractiveMessage(
      to,
      categories,
      "Explore our tour types!",
      "Choose a type from the list below:",
      "Select Tour Type 🧳",
      "Madura Travel Services"
    );
    await sendMessageToWhatsApp(messageData); // Send the message
  } catch (error) {
    console.error("Error sending categories:", error);
  }
};
