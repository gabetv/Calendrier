import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateHolidayMessage = async (person: string, day: number): Promise<string> => {
  if (!ai) return "Joyeux Noël ! (Clé API manquante)";

  try {
    const prompt = `
      Écris un court message de Noël chaleureux, drôle ou romantique (1-2 phrases maximum) pour ${person}.
      C'est le jour ${day} du calendrier de l'avent.
      Ne mets pas de guillemets. Utilise des emojis de Noël.
      Langue: Français.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating message:", error);
    return `Joyeux jour ${day} ${person} ! 🎄`;
  }
};
