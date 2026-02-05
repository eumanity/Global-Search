import { GoogleGenAI } from "@google/genai";
import { SearchResult, Company } from "../types";

export const searchSponsorshipCompanies = async (query: string, country: string): Promise<SearchResult> => {
  try {
    // Initialize the AI client directly before use as per recommended practice
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using gemini-3-flash-preview for high-performance search and extraction
    const modelId = 'gemini-3-flash-preview';

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
      },
    });

    const textResponse = response.text || "";
    
    // Extract Grounding Sources (URLs to display in the UI)
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .map(chunk => chunk.web)
      .filter(web => !!web)
      .map(web => ({ title: web!.title, uri: web!.uri }));

    // Parse JSON from the text response
    let companies: Company[] = [];
    
    const jsonMatch = textResponse.match(/```json\s*([\s\S]*?)\s*```/) || textResponse.match(/\[\s*\{[\s\S]*\}\s*\]/);
    
    if (jsonMatch) {
      try {
        const jsonStr = (jsonMatch[1] || jsonMatch[0]).trim();
        companies = JSON.parse(jsonStr);
      } catch (e) {
        console.error("Failed to parse JSON from Gemini response", e);
      }
    }

    return {
      companies,
      rawText: companies.length === 0 ? textResponse : undefined,
      sources
    };

  } catch (error) {
    console.error("Gemini Search Error:", error);
    throw error;
  }
};