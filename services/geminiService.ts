
import { GoogleGenAI, Chat } from "@google/genai";

// This is a placeholder for the API key, which is expected to be in the environment.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might show a persistent error to the user.
  // Here, we'll log a warning. The app will still load but Gemini features will fail.
  console.warn(
    "Gemini API key not found in environment variables. The AI Assistant feature will not work."
  );
}

// FIX: Correctly instantiate GoogleGenAI with a named apiKey parameter.
const ai = new GoogleGenAI({ apiKey: API_KEY! });

const systemInstruction = `You are an AI Assistant for "Mind Sprouts", a friendly and knowledgeable AI for a gamified environmental education platform.
Your audience is students in schools and colleges.
Your goal is to provide clear, concise, and encouraging information about environmental topics.
Use simple language, and when explaining complex topics, use analogies related to student life.
Always be positive and focus on actionable steps.
Do not answer questions unrelated to environmental science, sustainability, conservation, or eco-friendly practices. If asked an unrelated question, politely decline and steer the conversation back to environmental topics.`;

export const startAiAssistantChat = (): Chat | null => {
  if (!API_KEY) {
    return null;
  }
  return ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction,
    },
  });
};

export const getPersonalizedTip = async (context: {
  completedChallengeTitles: string[];
  ecoGoal: string | null;
}): Promise<string> => {
  if (!API_KEY) {
    throw new Error("Gemini API key not found.");
  }

  let prompt = `You are an AI assistant for "Mind Sprouts", an eco-learning app for students. Your goal is to provide a clear, concise, actionable, and encouraging eco-tip (2-3 sentences). Be friendly and address the student directly.`;

  if (context.completedChallengeTitles.length > 0) {
    const lastChallenge = context.completedChallengeTitles[context.completedChallengeTitles.length - 1];
    prompt += ` The student recently completed the challenge: "${lastChallenge}".`;
  }
  if (context.ecoGoal) {
    prompt += ` Their current personal goal is: "${context.ecoGoal}".`;
  }
  prompt += ` Based on this, provide a relevant and inspiring eco-tip. If there's no specific context, give a generally useful and interesting tip about sustainability.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating personalized tip:", error);
    throw new Error("Failed to generate tip from Gemini API.");
  }
};
