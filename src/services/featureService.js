import apiClient from "./apiClient.js";
import {
  createInteractiveMessage,
  sendMessageToWhatsApp,
} from "./messageService.js";

// Function to fetch featured products from /products API
const fetchFeaturedProducts = async () => {
  try {
    const response = await apiClient.get("/products", {
      params: {
        featured: true, // Only fetch featured products
        status: "publish", // Only fetch products that are published
      },
    });
    // console.log("Fetched products:", response.data); // Log the fetched data
    return response.data; // Assuming the response contains an array of products
  } catch (error) {
    console.error("Error fetching featured products:", error);
    throw error; // Rethrow the error to handle it downstream
  }
};

// Function to send the featured products as an interactive message
const sendFeaturedProducts = async (to) => {
  try {
    const featuredProducts = await fetchFeaturedProducts();

    if (featuredProducts && featuredProducts.length > 0) {
      // Map the products to extract the required data
      const processedFeaturedProducts = featuredProducts.map((product) => {
        // Find the meta data item where key matches 'ovabrw_address'
        const metaItem = product.meta_data.find(
          (item) => item.key === "ovabrw_address"
        );

        // Set name as the value of 'ovabrw_address' or default to "No Address Available"
        const name = metaItem ? metaItem.value : "No Address Available";

        // Prepare the product data for the interactive message
        return {
          id: product.id, // Use the product's ID as the row ID
          name: name, // Show the value of 'ovabrw_address' in the name field
          description: product.name, // Use the product's name in the description field
        };
      });

      //   console.log("Processed featured products:", processedFeaturedProducts); // Log the processed products

      // Create the interactive message with the processed featured products
      const messageData = createInteractiveMessage(
        to,
        processedFeaturedProducts,
        "Check out our Featured Packages!",
        "Explore the top picks for your next journey:",
        "Select Package 🧳",
        "Madura Travel Services"
      );

      // Send the interactive message with featured products
      await sendMessageToWhatsApp(messageData);
    } else {
      console.log("No featured products available.");
    }
  } catch (error) {
    console.error("Error sending featured products:", error);
  }
};

export { sendFeaturedProducts };
