import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

console.log("API Key:", process.env.API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-flash-latest",
});

/**
 * Generate AI suggestions based on website performance metrics
 * @param {Object} performanceData - Performance metrics from Lighthouse
 * @returns {Promise<string>} AI-generated suggestions
 */
async function getAISuggestions(performanceData) {
  try {
    const {
      performance = 0,
      fcp = 0, // First Contentful Paint
      lcp = 0, // Largest Contentful Paint
      tbt = 0, // Total Blocking Time
      cls = 0, // Cumulative Layout Shift
      speedIndex = 0,
      timeToInteractive = 0,
    } = performanceData || {};

    const prompt = `
    You are a web performance optimization expert. Analyze the following website performance metrics and provide actionable, specific suggestions to improve performance.

    Website Performance Metrics:
    - Overall Performance Score: ${performance}/100
    - First Contentful Paint (FCP): ${fcp}s
    - Largest Contentful Paint (LCP): ${lcp}s
    - Total Blocking Time (TBT): ${tbt}ms
    - Cumulative Layout Shift (CLS): ${cls}
    - Speed Index: ${speedIndex}s
    - Time to Interactive: ${timeToInteractive}s

    Please provide:
    1. Top 3 critical issues to fix
    2. Specific optimization techniques for each issue
    3. Expected performance improvement percentage
    4. Implementation priority (High/Medium/Low) for each suggestion

    Format your response in a clear, structured way with bullet points and in jsx format so that i can pass it easily.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating AI suggestions:", error);
    throw new Error("Failed to generate suggestions from AI model");
  }
}

/**
 * Analyze website and generate suggestions based on URL
 * @param {string} url - Website URL to analyze
 * @param {Object} lighthouseData - Lighthouse audit results
 * @returns {Promise<string>} Combined analysis and suggestions
 */
async function analyzeWebsitePerformance(url, lighthouseData) {
  try {
    const metrics = extractMetrics(lighthouseData);
    const suggestions = await getAISuggestions(metrics);
    return suggestions;
  } catch (error) {
    console.error("Error analyzing website performance:", error);
    throw error;
  }
}

/**
 * Extract key metrics from Lighthouse audit data
 * @param {Object} lighthouseData - Raw Lighthouse audit data
 * @returns {Object} Extracted metrics
 */
function extractMetrics(lighthouseData) {
  if (!lighthouseData || !lighthouseData.audits) {
    return {
      performance: 0,
      fcp: 0,
      lcp: 0,
      tbt: 0,
      cls: 0,
      speedIndex: 0,
      timeToInteractive: 0,
    };
  }

  const audits = lighthouseData.audits;
  const categories = lighthouseData.categories;

  return {
    performance: categories?.performance?.score * 100 || 0,
    fcp: audits["first-contentful-paint"]?.displayValue || "N/A",
    lcp: audits["largest-contentful-paint"]?.displayValue || "N/A",
    tbt: audits["total-blocking-time"]?.displayValue || "N/A",
    cls: audits["cumulative-layout-shift"]?.displayValue || "N/A",
    speedIndex: audits["speed-index"]?.displayValue || "N/A",
    timeToInteractive: audits["interactive"]?.displayValue || "N/A",
  };
}

module.exports = { getAISuggestions, analyzeWebsitePerformance, extractMetrics };
