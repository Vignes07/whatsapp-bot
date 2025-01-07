require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { fetchCategories } = require('./src/api');
const axios = require('axios');

const app = express();

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

app.use(bodyParser.json());

// Verify Webhook
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        res.status(200).send(challenge); // Webhook verified
    } else {
        res.sendStatus(403); // Forbidden
    }
});

// Handle Webhook Events
app.post('/webhook', async (req, res) => {
    const { body } = req;

    if (body?.messages) {
        const message = body.messages[0];
        const from = message.from; // Sender's phone number
        const messageBody = message.text?.body;

        if (messageBody === '/categories') {
            const categories = await fetchCategories();
            const responseMessage = categories.length
                ? `Here are the categories:\n- ${categories.join('\n- ')}`
                : 'Failed to fetch categories. Please try again later.';

            await sendMessage(from, responseMessage);
        }
    }

    res.sendStatus(200); // Acknowledge webhook event
});

// Function to send a WhatsApp message
const sendMessage = async (to, message) => {
    try {
        await axios.post(
            `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: 'whatsapp',
                to,
                text: { body: message },
            },
            {
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            }
        );
    } catch (error) {
        console.error('Error sending message:', error.message);
    }
};

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
