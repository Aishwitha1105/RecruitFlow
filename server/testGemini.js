require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function testGemini() {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: "Return exactly three programming skills as a JSON array.",
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "ARRAY",
                    items: {
                        type: "STRING"
                    }
                }
            }
        });

        console.log("Gemini response:");
        console.log(response.text);

    } catch (error) {
        console.error("Gemini error:");
        console.error(error);
    }
}

testGemini();