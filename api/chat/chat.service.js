import { ChatGPTAPI } from 'chatgpt';
import 'dotenv/config';

export const chatService = {
    sendMessageToChatGPT,
}

const api = new ChatGPTAPI({
    apiKey: process.env.CHAT_ID,
});

export async function sendMessageToChatGPT(message) {
    try {
        const response = await api.sendMessage(message);
        return response.text;
    } catch (err) {
        console.error('Error sending message to ChatGPT:', err);
        throw err;
    }
}
