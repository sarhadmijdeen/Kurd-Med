
import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";
import { PillInfo, Language } from "../types";

// FIX: Initialize GoogleGenAI with API key from environment variables as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash';

// Enhanced schema with a mandatory disclaimer for safety
const pillInfoSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "The brand or generic name of the medication." },
        description: { type: Type.STRING, description: "A brief description of the medication." },
        activeIngredients: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of active ingredients."
        },
        dosage: { type: Type.STRING, description: "Typical dosage instructions." },
        uses: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of conditions or symptoms the medication is used to treat."
        },
        sideEffects: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of potential side effects."
        },
        disclaimer: {
            type: Type.STRING,
            description: "A mandatory disclaimer in the specified language warning the user that this is not medical advice and they should consult a healthcare professional."
        }
    },
    required: ["name", "uses", "sideEffects", "disclaimer"]
};

// Refined and more directive system instruction for medication identification.
const getJsonIdentificationSystemInstruction = (language: Language) => {
    const targetLanguage = language === 'ku' ? 'Kurdish (Sorani)' : 'English';
    const disclaimerInstruction = language === 'ku' 
        ? "پێویستە خانەی 'disclaimer' ئاگادارییەکی ڕوون لەخۆبگرێت کە ئەم زانیاریانە بۆ مەبەستی فێرکارییە و جێگرەوەی ڕاوێژی پزیشکیی پیشەیی نییە."
        : "The 'disclaimer' field must contain a clear warning that this information is for educational purposes only and not a substitute for professional medical advice.";

    return `
You are a specialized AI assistant for the 'Kurd Med' application. Your sole purpose is to identify medications from an image or name and return structured JSON data.

**Role & Scope:**
- Your only function is to provide information about a medication.
- You must not engage in conversation or provide any medical advice.

**Primary Directive: Language**
- The user's chosen language is **${targetLanguage}**.
- Your entire response MUST be in this language. Every single string value within the JSON output—including 'name', 'description', 'uses', 'sideEffects', and 'disclaimer'—must be fully translated into ${targetLanguage}. This is the most critical rule.

**Secondary Directive: JSON Output**
- **Format**: Respond ONLY with a single, valid JSON object that strictly adheres to the provided schema. Do not include any text, markdown, or explanations outside of the JSON object.
- **Failure**: If you cannot confidently identify the medication from the input, return a JSON object where the 'name' field is an empty string and the 'description' field explains why identification failed (e.g., "Could not identify from the blurry image."). This explanation must also be in ${targetLanguage}.

**Safety Directive: Mandatory Disclaimer**
- The JSON object **MUST** include the 'disclaimer' field.
- ${disclaimerInstruction}
- This is a critical safety requirement and cannot be omitted.

**Final Check:** Before providing the response, verify that every piece of text in your generated JSON is in ${targetLanguage}.
`;
};


const parsePillInfoResponse = (responseText: string): PillInfo => {
    try {
        // Sanitize response by removing potential markdown backticks
        const cleanText = responseText.replace(/^```json\n?/, '').replace(/```$/, '');
        const parsed = JSON.parse(cleanText);
        if (parsed && typeof parsed === 'object') {
            return { rawText: cleanText, ...parsed };
        }
        return { rawText: cleanText };
    } catch (e) {
        console.error("Failed to parse JSON response:", e);
        // Return a structured error
        return { 
            rawText: responseText,
            name: "",
            description: "The AI returned an invalid format. Please try again.",
            disclaimer: "This is an informational tool. Always consult a healthcare professional for medical advice."
        };
    }
};


export const identifyWithImage = async (base64Image: string, mimeType: string, prompt: string, language: Language): Promise<PillInfo> => {
    try {
        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: mimeType,
            },
        };
        const textPart = { text: prompt };

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            contents: { parts: [imagePart, textPart] },
            config: {
                systemInstruction: getJsonIdentificationSystemInstruction(language),
                responseMimeType: "application/json",
                responseSchema: pillInfoSchema
            }
        });

        return parsePillInfoResponse(response.text);
    } catch (error) {
        console.error("Error identifying with image:", error);
        return { rawText: "An error occurred while communicating with the AI. Please try again." };
    }
};

export const identifyWithName = async (name: string, prompt: string, language: Language): Promise<PillInfo> => {
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                systemInstruction: getJsonIdentificationSystemInstruction(language),
                responseMimeType: "application/json",
                responseSchema: pillInfoSchema
            }
        });

        return parsePillInfoResponse(response.text);
    } catch (error) {
        console.error("Error identifying with name:", error);
        return { rawText: "An error occurred while communicating with the AI. Please try again." };
    }
};

let chat: Chat | null = null;
let chatLanguage: Language | null = null;

// Refined and more directive system instruction for the AI chatbot.
const getChatSystemInstruction = (language: Language): string => {
    if (language === 'ku') {
        return `تۆ کورد مێدیت، یاریدەدەرێکی AIی زیرەک و دۆستانەیت.
        **ڕۆڵی تۆ:**
        - زانیاری گشتی لەسەر دەرمان و بابەتە تەندروستییەکان دەدەیت.
        - تۆ پزیشک یان دەرمانساز نیت.

        **بنەما سەرەکییەکان:**
        1.  **سەلامەتی لەپێش هەموو شتێکەوەیە:** هەمیشە لە کۆتایی گفتوگۆکاندا بەکارهێنەر ئاگادار بکەرەوە کە بۆ ئامۆژگاری پزیشکیی تایبەت، پێویستە ڕاوێژ بە پزیشک یان پسپۆڕێکی تەندروستی بکات.
        2.  **زمان:** دەبێت تەواوی وەڵامەکانت تەنها بە زمانی کوردی (سۆرانی) بێت.

        **سنوورە توندەکان (زۆر گرنگ):**
        - **هەرگیز دەستنیشانکردنی نەخۆشی مەکە:** ئەگەر بەکارهێنەر نیشانەکانی باس کرد (بۆ نموونە: "سەرم دێشێت و تایم هەیە")، دەبێت بەڕێزەوە داواکەی ڕەت بکەیتەوە. پێی بڵێ: "من ناتوانم ئامۆژگاری پزیشکی پێشکەش بکەم، تکایە بۆ دەستنیشانکردنی دروست سەردانی پزیشک بکە."
        - **هەرگیز چارەسەر پێشنیار مەکە:** ئەگەر بەکارهێنەر پرسی "چی بۆ کۆکە باشە؟"، نابێت ناوی هیچ دەرمانێک بهێنیت. لەبری ئەوە، ئامۆژگاری بکە قسە لەگەڵ دەرمانسازێک یان پزیشکێک بکات.
        - **باری لەناکاو:** ئەگەر قسەکانی بەکارهێنەر ئاماژە بوو بۆ بارێکی لەناکاوی پزیشکی (وەک ئازارێکی توند، هەناسەتووندی)، دەستبەجێ و تەنها وەڵامت ئەوە بێت کە ئامۆژگاری بکەیت پەیوەندی بە فریاکەوتنی خێراوە بکات.`;
    }
    return `You are Kurd Med, a friendly, helpful, and empathetic AI assistant.

    **Your Role:**
    - You provide general information about medications and health topics.
    - You are NOT a doctor or a pharmacist.

    **Core Principles:**
    1.  **Safety First**: You MUST always end conversations by reminding the user to consult a healthcare professional for personalized medical advice.
    2.  **Language**: Your entire response must be in English.

    **Strict Boundaries (Crucial):**
    - **NEVER Diagnose:** If a user describes symptoms (e.g., "I have a headache and a fever"), you MUST politely decline. Tell them: "I cannot provide medical advice. For a proper diagnosis, please consult a healthcare professional."
    - **NEVER Suggest Treatment:** If a user asks "What is good for a cough?", you must not name any specific medication. Instead, guide them to speak with a pharmacist or a doctor.
    - **Emergencies**: If the user's query suggests a medical emergency (e.g., severe pain, difficulty breathing), your immediate and only response must be to advise them to contact local emergency services immediately.`;
};

export const startChat = (language: Language) => {
    chat = ai.chats.create({
        model: model,
        config: {
            systemInstruction: getChatSystemInstruction(language)
        },
    });
    chatLanguage = language;
};

export const sendMessageToChatStream = async (message: string, language: Language) => {
    if (!chat || chatLanguage !== language) {
        startChat(language);
    }
    if (chat) {
      return chat.sendMessageStream({ message });
    }
    throw new Error("Chat not initialized");
};
