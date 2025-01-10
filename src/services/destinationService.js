import apiClient from "./apiClient.js";
import {
  createInteractiveMessage,
  sendMessageToWhatsApp,
} from "./messageService.js";

export const fetchContinents = async () => {
  try {
    const response = await apiClient.get("/data/continents");
    return response.data;
  } catch (error) {
    console.error("Error fetching continents:", error);
    throw error;
  }
};

export const fetchCountryCodes = async (continentCode) => {
  try {
    const response = await apiClient.get(`/data/continents/${continentCode}`);
    return response.data.countries;
  } catch (error) {
    console.error("Error fetching country codes:", error);
    throw error;
  }
};

export const sendContinents = async (to) => {
  try {
    const continents = await fetchContinents();
    const messageData = createInteractiveMessage(
      to,
      continents,
      "Select a continent to explore countries.",
      "Choose a continent from the list below:",
      "Select Continent",
      "Madura Travel Services"
    );
    sendMessageToWhatsApp(messageData);
  } catch (error) {
    console.error("Error sending continents:", error);
  }
};

export const sendCountries = async (to, continentCode) => {
  try {
    const countryCodes = await fetchCountryCodes(continentCode);
    const countries = await Promise.all(
      countryCodes.map(async (code) => {
        const country = await fetchCountryName(code);
        return country;
      })
    );

    const messageData = createInteractiveMessage(
      to,
      countries,
      "Select a country to explore.",
      "Choose a country from the list below:",
      "Select Country",
      "Madura Travel Services"
    );
    sendMessageToWhatsApp(messageData);
  } catch (error) {
    console.error("Error sending countries:", error);
  }
};
