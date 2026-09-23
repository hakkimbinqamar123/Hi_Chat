import { StreamChat } from "stream-chat";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

// Initialize the Stream Chat Server Client (Requires your Secret Key)
const serverClient = StreamChat.getInstance(
    process.env.VITE_STREAM_API_KEY, // Make sure your API key is in .env
    process.env.STREAM_API_SECRET    // Make sure your SECRET is in .env
);

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });

// The ID for your AI Bot
const AI_BOT_ID = "gemini-ai-bot";

// 1. (Optional) A function to explicitly create the bot user in Stream
export async function initializeAIBot() {
    await serverClient.upsertUser({
        id: AI_BOT_ID,
        name: "Gemini AI",
        image: "https://api.dicebear.com/9.x/bottts/svg?seed=Gemini",
        role: "admin", // Admin role allows it to bypass some rate limits
    });
    console.log("AI Bot initialized in Stream!");
}

// 2. The Webhook handler
export async function handleStreamWebhook(req, res) {
    try {
        const { type, message, channel_id, user } = req.body;

        fs.appendFileSync('webhook_log.txt', `[${new Date().toISOString()}] Webhook hit: type=${type}, user=${user?.id}, msg=${message?.text}, channel=${channel_id}\n`);

        // Immediately respond with 200 OK so Stream knows we received it
        res.status(200).send("OK");

        // Only respond to NEW messages, and NEVER respond to our own bot's messages (prevents infinite loops)
        if (type !== "message.new" || user.id === AI_BOT_ID) {
            return;
        }

        // Check if this channel involves the AI Bot
        // (You can determine this by checking if the bot is a member of the channel)
        const channel = serverClient.channel("messaging", channel_id);
        const channelState = await channel.watch();
        const membersList = Array.isArray(channelState.members) 
            ? channelState.members.map(m => m.user_id || m.user?.id) 
            : Object.keys(channelState.members || {});
            
        if (!membersList.includes(AI_BOT_ID)) {
            fs.appendFileSync('webhook_log.txt', `[${new Date().toISOString()}] Bot not in chat. Members list: ${membersList.join(',')}. Original: ${JSON.stringify(channelState.members)}\n`);
            return; // The bot isn't in this chat, ignore the message
        }

        console.log(`Received message for AI: ${message.text}`);

        // Ask Gemini for a response
        const result = await model.generateContent(message.text);
        const aiResponse = result.response.text();

        // Send the response back to the Stream Chat channel as the Bot
        await channel.sendMessage({
            text: aiResponse,
            user: { id: AI_BOT_ID },
        });

        fs.appendFileSync('webhook_log.txt', `[${new Date().toISOString()}] Replied successfully\n`);

    } catch (error) {
        fs.appendFileSync('webhook_log.txt', `[${new Date().toISOString()}] Error: ${error.stack}\n`);
        console.error("Error in AI Webhook:", error);

        try {
            const channel = serverClient.channel("messaging", req.body.channel_id);
            let fallbackText = "Sorry, I encountered an error while processing your request.";
            if (error.message && error.message.includes("503")) {
                fallbackText = "I am currently experiencing extremely high demand and cannot fulfill your request right now. Please try again later.";
            } else if (error.message && error.message.includes("429")) {
                fallbackText = "I am receiving too many requests right now. Please try again in a moment.";
            }
            
            await channel.sendMessage({
                text: fallbackText,
                user: { id: AI_BOT_ID },
            });
        } catch (fallbackError) {
            console.error("Failed to send fallback message:", fallbackError);
        }
    }
}
