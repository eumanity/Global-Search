import { GoogleGenAI } from "@google/genai";
import { SearchResult, Company } from "../types";

export const searchSponsorshipCompanies = async (query: string, country: string): Promise<SearchResult> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const modelId = 'gemini-3-flash-preview';

    const prompt = `
      You are an expert recruitment data analyst and migration researcher.
      
      Task: Find a list of companies in "${country}" that are known to offer visa sponsorship to international workers, specifically for the role/industry: "${query}".
      
      If the country is Australia, specifically look for companies with a history of sponsoring:
      - TSS 482 (Temporary Skill Shortage)
      - 186 ENS (Employer Nomination Scheme)
      - 494 (Skilled Employer Sponsored Regional)
      
      Requirements:
      1. Use Google Search to find current, up-to-date data for 2024-2025.
      2. Return the data as a valid JSON array wrapped in a markdown code block.
      3. Focus on specific company names rather than general advice.
      4. Include the specific sponsorship visa types commonly used by the company if known.
      
      JSON Structure per item:
      {
        "id": "unique_id",
        "name": "Company Name",
        "industry": "Industry Sector",
        "website": "Direct link to careers page or homepage",
        "location": "Primary city or HQ in ${country}",
        "description": "Short summary of their sponsorship reputation (max 25 words).",
        "sponsorshipType": "Specific visa subclass or general type"
      }

      If no structured data is found, provide a detailed summary of the current landscape for "${query}" in "${country}".
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const textResponse = response.text || "";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .map(chunk => chunk.web)
      .filter(web => !!web)
      .map(web => ({ title: web!.title, uri: web!.uri }));

    let companies: Company[] = [];
    const jsonMatch = textResponse.match(/```json\s*([\s\S]*?)\s*```/) || textResponse.match(/\[\s*\{[\s\S]*\}\s*\]/);
    
    if (jsonMatch) {
      try {
        const jsonStr = (jsonMatch[1] || jsonMatch[0]).trim();
        companies = JSON.parse(jsonStr);
      } catch (e) {
        console.error("JSON parse error", e);
      }
    }

    return {
      companies,
      rawText: companies.length === 0 ? textResponse : undefined,
      sources
    };
  } catch (error) {
    console.error("Gemini Service Error:", error);
    throw error;
  }
};