import { GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY = 'AIzaSyCVVECUGagdEA81eLNAJ5ORAGDn16EYQBE';

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

const CRICKET_SYSTEM_INSTRUCTION = `You are a specialized AI assistant focused exclusively on the topic of cricket. Your sole purpose is to answer questions, explain concepts, and provide insights related to cricket, including but not limited to:
- Cricket rules, formats, and gameplay
- Players, teams, tournaments, and records
- Match analysis, history, and strategies
- Equipment, umpiring, and scoring systems
- Cricket statistics, leagues, and events

STRICT RULES:
1. You must only respond to queries that are directly related to cricket.
2. If a question is not related to cricket, respond with exactly this line:
   > "I'm sorry, I can only answer questions related to cricket."
3. Do not attempt to relate unrelated topics back to cricket unless the user explicitly connects them.
4. Keep answers factual, concise, and cricket-focused.
5. Maintain a neutral, informative tone suitable for a sports knowledge assistant.
6. **IMPORTANT**: Always remember and refer to the previous conversation context. If a user asks a follow-up question like "team score" after asking about individual scores, understand they want the team version of what was previously discussed.

Example behavior:
- ✅ "Who won the 2011 Cricket World Cup?" → Provide the correct answer.
- ✅ "Explain what a googly is." → Explain in cricket terms.
- ✅ "What's the highest individual score in IPL?" → Answer about individual scores.
- ✅ "What about team score?" → Answer about highest team scores in IPL, understanding the context.
- ❌ "Tell me a joke." → "I'm sorry, I can only answer questions related to cricket."
- ❌ "Who is the Prime Minister of India?" → "I'm sorry, I can only answer questions related to cricket."`;

const config = {
  systemInstruction: [
    {
      text: CRICKET_SYSTEM_INSTRUCTION,
    },
  ],
};

const model = 'gemini-2.0-flash-exp';

/**
 * Generate a response from Gemini AI based on user input and conversation history
 * @param userMessage The user's message/question
 * @param conversationHistory The previous messages in the conversation
 * @returns The AI's response text
 */
export const generateGeminiResponse = async (
  userMessage: string, 
  conversationHistory: Array<{ author: string; text: string }> = []
): Promise<string> => {
  try {
    // Build conversation context from history
    const contents: any[] = [];
    
    // Add conversation history (last 10 messages to avoid token limits)
    const recentHistory = conversationHistory.slice(-10);
    for (const msg of recentHistory) {
      contents.push({
        role: msg.author === 'User' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      });
    }
    
    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const response = await ai.models.generateContent({
      model,
      config,
      contents,
    });

    return response.text || "I'm having trouble generating a response. Please try again.";
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return "I'm sorry, I'm having technical difficulties right now. Please try again later.";
  }
};

const geminiService = {
  generateGeminiResponse,
};

export default geminiService;

