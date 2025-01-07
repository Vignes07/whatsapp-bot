const axios = require('axios');

// Fetch categories from DummyJSON
const fetchCategories = async () => {
    try {
        const response = await axios.get('https://dummyjson.com/products/categories');
        return response.data; // Returns an array of categories
    } catch (error) {
        console.error('Error fetching categories:', error.message);
        return [];
    }
};

module.exports = { fetchCategories };
