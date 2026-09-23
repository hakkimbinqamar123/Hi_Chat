import { GoogleGenerativeAI } from "@google/generative-ai";

async function test() {
    try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-image" });
        const result = await model.generateContent("hello");
        console.log("Success text:", result.response.text());

        const result2 = await model.generateContent("create an image of a dog");
        console.log("Success image:", result2.response.text());
    } catch (e) {
        console.error("Failed:", e.message);
    }
}
test();
