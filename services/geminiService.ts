
import { GoogleGenAI, Type, FunctionDeclaration, GenerateContentResponse } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Tool definition for qualifying leads
const qualifyLeadTool: FunctionDeclaration = {
  name: 'qualifyLead',
  parameters: {
    type: Type.OBJECT,
    description: 'Update the lead status to qualified when a user provides their name and budget.',
    properties: {
      name: {
        type: Type.STRING,
        description: 'The full name of the potential client.',
      },
      budget: {
        type: Type.STRING,
        description: 'The property budget or price range mentioned by the client (e.g., "$2M", "around 5 million").',
      },
    },
    required: ['name', 'budget'],
  },
};

export const geminiService = {
  /**
   * AI Concierge
   */
  async chatWithConcierge(history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
    const ai = getAI();
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: history,
      config: {
        systemInstruction: "You are the 'Bionic Brokerage AI Concierge', a luxury real estate assistant for an elite $100M firm. You are professional, sophisticated, and goal-oriented. Your primary objective is to assist brokers and qualify leads. If a user shares their name and budget, use the 'qualifyLead' tool immediately to register them in the system. Be concise and high-end in your tone.",
        tools: [{ functionDeclarations: [qualifyLeadTool] }],
      },
    });

    return response;
  },

  /**
   * Agent Multiplier: Marketing text generation
   */
  async generateMarketingMagic(notes: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: `Transform these raw real estate notes into a professional marketing suite: ${notes}` }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            professionalListing: { type: Type.STRING, description: 'A high-end, professional real estate listing description' },
            instagramCaption: { type: Type.STRING, description: 'A snappy, engaging Instagram caption with hashtags' },
            flyerPoints: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: 'Exactly 3 punchy bullet points for a marketing flyer' 
            }
          },
          required: ['professionalListing', 'instagramCaption', 'flyerPoints']
        }
      }
    });
    return JSON.parse(response.text || '{}');
  },

  /**
   * Agent Multiplier: Room Photo Analysis
   */
  async analyzeRoomImage(base64Image: string, mimeType: string) {
    const ai = getAI();
    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: base64Image,
      },
    };
    const textPart = {
      text: "Analyze this luxury room photo. Identify the 'Architectural Style' (e.g., Mid-Century Modern, Contemporary, Spanish Colonial) and the 'Top 3 Selling Features' that would appeal to high-net-worth buyers. Return the result in a clean JSON format."
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            architecturalStyle: { type: Type.STRING },
            topSellingFeatures: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: 'Exactly 3 features' 
            }
          },
          required: ['architecturalStyle', 'topSellingFeatures']
        }
      }
    });
    return JSON.parse(response.text || '{}');
  },

  /**
   * Predictive Hunter: High Propensity Analysis
   */
  async identifyHighPropensitySellers(leads: any[]) {
    const ai = getAI();
    const prompt = `
      Analyze these 10 homeowners and identify which 3 are most likely to sell in the next 6 months.
      Consider factors like years owned (7-10 years is a common move cycle), equity, and value trends.
      
      Leads Data: ${JSON.stringify(leads)}
      
      Return a JSON array of objects for the TOP 3 ONLY.
      Each object must include: 'id', 'score' (1-100), 'category' ('Hot' for score > 85, 'Warm' for 70-85), and 'reasoning'.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              score: { type: Type.NUMBER },
              category: { type: Type.STRING, enum: ['Hot', 'Warm'] },
              reasoning: { type: Type.STRING }
            },
            required: ['id', 'score', 'category', 'reasoning']
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  }
};
