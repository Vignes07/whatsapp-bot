const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();

// Use body-parser to parse JSON body
app.use(bodyParser.json());

// Set port
const PORT = process.env.PORT || 4000;

// Webhook endpoint to handle incoming messages
app.post('/webhook', (req, res) => {
    const body = req.body;
    console.log('Received webhook:', body);
    console.log(body.entry[0].changes);
    

    // Ensure the webhook contains messages
    if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
        const message = body.entry[0].changes[0].value.messages[0];
        
        // Check if the message contains text
        if (message.text) {
            const messageText = message.text.toLowerCase();
            if (messageText === '/categories') {
                // If it's the /categories command, call the sendCategories function
                sendCategories(message.from);
            }
        }

        // Check if it's a reply to an interactive button
        if (message.interactive) {
            const selectedButton = message.interactive.button_reply.id;

            // Handle button click based on the selected category
            sendMessage(message.from, `You selected category: ${selectedButton}`);
        }
    }

    // Respond with 200 to acknowledge receipt
    res.sendStatus(200);
});

// Function to send message with categories as individual buttons
async function sendCategories(to) {
    try {
        // Fetch categories from DummyJSON
        const response = await axios.get('https://dummyjson.com/products/categories');
        const categories = response.data;

        // Create individual buttons for each category
        const buttons = categories.map(category => {
            return {
                type: 'reply',
                reply: {
                    id: category, // ID will be the category name
                    title: category
                }
            };
        });

        const messageData = {
            to: to,
            type: 'interactive',
            interactive: {
                type: 'button',
                body: {
                    text: 'Here are the available categories:'
                },
                action: {
                    buttons: buttons
                }
            }
        };

        sendMessageToWhatsApp(messageData);
    } catch (error) {
        console.error('Error fetching categories from DummyJSON:', error);
    }
}

// Function to send a message to WhatsApp using the API
function sendMessageToWhatsApp(messageData) {
    const url = `https://graph.facebook.com/v14.0/${process.env.PHONE_NUMBER_ID}/messages`;
    
    axios.post(url, messageData, {
        headers: {
            'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log('Message sent successfully:', response.data);
    })
    .catch(error => {
        console.error('Error sending message:', error.response.data);
    });
}

// Function to send a response back to the user
function sendMessage(to, message) {
    const messageData = {
        to: to,
        type: 'text',
        text: {
            body: message
        }
    };

    sendMessageToWhatsApp(messageData);
}

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
