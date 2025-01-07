const categoryService = require('../services/categoryService');
const messageService = require('../services/messageService');

require('dotenv').config();

async function verifyWebhook(req, res) {
    const queryParams = req.query;
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
    
  
    if (queryParams['hub.mode'] === 'subscribe' && queryParams['hub.challenge'] && queryParams['hub.verify_token'] === VERIFY_TOKEN) {
        res.status(200).send(queryParams['hub.challenge']);
    } else {
        res.status(403).send('Forbidden');
    }
}

async function handleIncomingMessage(req, res) {
    const body = req.body;
    
    if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
        const message = body.entry[0].changes[0].value.messages[0];

        if (message.text) {
            const messageText = message.text.body.toLowerCase();
            if (messageText === '/categories') {
                categoryService.sendCategories(message.from);
            }
        }

        if (message.interactive) {
            const selectedButton = message.interactive.button_reply.id;
            messageService.handleCategorySelection(message.from, selectedButton);
        }
    }

    res.sendStatus(200);
}

module.exports = { verifyWebhook, handleIncomingMessage };
