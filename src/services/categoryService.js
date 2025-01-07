const axios = require('axios');
const messageService = require('./messageService');

async function fetchCategories() {
    const response = await axios.get('https://dummyjson.com/products/categories');
    return response.data;
}

async function sendCategories(to) {
    try {
        const categories = await fetchCategories();
        const messageData = messageService.createCategoryMessage(to, categories);
        messageService.sendMessageToWhatsApp(messageData);
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

module.exports = { fetchCategories, sendCategories };
