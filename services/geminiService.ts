import { GoogleGenAI } from "@google/genai";
import { SearchResult, Company } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize the client only if the key exists to avoid immediate errors on load if missing (handled in UI)
const getAiClient = () => {
  if (!apiKey) throw new Error("API Key is missing");
  return new GoogleGenAI({ apiKey });
};

export const searchSponsorshipCompanies = async (query: string, country: string): Promise<SearchResult> => {
  try {
    const ai = getAiClient();
    
    // We use gemini-2.5-flash for speed and search capability
    const modelId = 'gemini-2.5-flash';

    const prompt = `
      You are an expert recruitment data analyst specializing in the global job market.
      
      Task: Find a list of companies in "${country}" that are known to offer visa sponsorship to international workers, specifically related to this search query: "${query}".
      
      Requirements:
      1. Use Google Search to find current, up-to-date information.
      2. Return the data as a valid JSON array wrapped in a markdown code block (e.g., \`\`\`json [ ... ] \`\`\`).
      3. If specific companies cannot be confirmed, find recruitment agencies or large multinationals in "${country}" in this sector that typically sponsor.
      4. Focus on companies offering work visas (e.g., H1B in USA, TSS 482 in Australia, Skilled Worker in UK, Blue Card in EU, etc., depending on the country).
      
      JSON Structure per item:
      {
        "id": "unique_string_id",
        "name": "Company Name",
        "industry": "Industry Sector",
        "website": "Company Website URL (or empty string if not found)",
        "location": "City/Region in ${country}",
        "description": "A short summary (max 20 words) of their business and visa sponsorship reputation.",
        "sponsorshipType": "Type of visa commonly sponsored (e.g. 'Skilled Worker', 'H1B', 'General Sponsorship')"
      }

      If you find absolutely no companies, return an empty JSON array.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // responseMimeType cannot be JSON when using googleSearch, so we ask for a code block in the prompt
      },
    });

    const textResponse = response.text || "";
    
    // Extract Grounding Sources
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .map(chunk => chunk.web)
      .filter(web => web !== undefined && web !== null)
      .map(web => ({ title: web.title, uri: web.uri }));

    // Parse JSON from the text response
    let companies: Company[] = [];
    
    // Regex to capture content between ```json and ``` or just [...]
    const jsonMatch = textResponse.match(/```json\s*([\s\S]*?)\s*```/) || textResponse.match(/\[\s*\{[\s\S]*\}\s*\]/);
    
    if (jsonMatch) {
      try {
        companies = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } catch (e) {
        console.error("Failed to parse JSON from Gemini response", e);
        // Fallback: If parsing fails, we might just return empty companies and let the raw text show
      }
    }

    return {
      companies,
      rawText: companies.length === 0 ? textResponse : undefined, // Only pass raw text if structured parsing failed or was empty
      sources
    };

  } catch (error) {
    console.error("Gemini Search Error:", error);
    throw error;
  }
};