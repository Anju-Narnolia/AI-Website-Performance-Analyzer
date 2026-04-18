import express, { raw } from "express";
import * as chromeLauncher from "chrome-launcher";
import Lighthouse from "../model/lighthouse.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();
let genAI = null;
let model = null;
const getModel = () => {
  if (!genAI) {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable is not set");
    }
    console.log("🔑 Initializing GoogleGenerativeAI with API_KEY");
    genAI = new GoogleGenerativeAI(process.env.API_KEY);
    model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
    });
  }
  return model;
};

router.post("/url", authMiddleware, async (req, res) => {
  const lighthouse = (await import("lighthouse")).default;
  console.log("Received URL analysis request:", req.body);
  let { url } = req.body;
  let chrome;
  if (!url) {
    return res.status(400).json({ message: "URL is required" });
  }
  console.log("🚀 Starting analysis for URL:", url);
  try {
    new URL(url);
    let website = await Lighthouse.findOne({
      url,
      createdAt: { $gte: Date.now() - 60 * 60 * 1000 },
    });
    if (website) {
      console.log("⚡ Returning cached result for URL:", url);
      return res.json(website);
    }
    chrome = await chromeLauncher.launch({
      chromeFlags: ["--headless", "--no-sandbox"],
    });
    const options = {
      logLevel: "error",
      output: "json",
      port: chrome.port,
      onlyCategories: ["performance", "seo", "accessibility", "best-practices"],
    };
    const name = url.replace(/(^\w+:|^)\/\//, "").split("/")[0];
    const runnerResult = await lighthouse(url, options);
    const report = runnerResult.lhr;

    try {
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      // await chrome.kill();
    } catch (e) {
      console.warn("Warning: Failed to cleanly kill Chrome:", e.message);
    }
    const performanceAudits = report.audits;
    const metrics = {
      fcp: performanceAudits["first-contentful-paint"]?.displayValue || "N/A",
      lcp: performanceAudits["largest-contentful-paint"]?.displayValue || "N/A",
      cls: performanceAudits["cumulative-layout-shift"]?.displayValue || "N/A",
      tbt: performanceAudits["total-blocking-time"]?.displayValue || "N/A",
      speedIndex: performanceAudits["speed-index"]?.displayValue || "N/A",
    };

    const lighthouseResult = {
      websiteURL: url,
      name: name,
      performance: {
        score: report.categories.performance.score * 100,
        issues: report.categories.performance.auditRefs
          .filter((audit) => report.audits[audit.id]?.score === 0)
          .map((audit) => report.audits[audit.id]?.title || audit.id),
      },
      accessibility: {
        score: report.categories.accessibility.score * 100,
        issues: report.categories.accessibility.auditRefs
          .filter((audit) => report.audits[audit.id]?.score === 0)
          .map((audit) => report.audits[audit.id]?.title || audit.id),
      },
      bestPractices: {
        score: report.categories["best-practices"].score * 100,
        issues: report.categories["best-practices"].auditRefs
          .filter((audit) => report.audits[audit.id]?.score === 0)
          .map((audit) => report.audits[audit.id]?.title || audit.id),
      },
      seo: {
        score: report.categories.seo.score * 100,
        issues: report.categories.seo.auditRefs
          .filter((audit) => report.audits[audit.id]?.score === 0)
          .map((audit) => report.audits[audit.id]?.title || audit.id),
      },

      metrics: metrics,
      rawReport: {
        performance: report.categories.performance,
        seo: report.categories.seo,
        audits: report.audits["largest-contentful-paint"],
      },
    };
    console.log("✅ Lighthouse analysis complete for URL:", lighthouseResult);
    const generatePrompt = (data) => {
      return `You are a senior web performance engineer and frontend expert.Analyze the following Lighthouse performance data and generate detailed, developer-focused optimization suggestions.
        IMPORTANT:
          - Focus on REAL, actionable improvements
          - Avoid generic advice
          - Provide clear explanations + code fixes
          - Keep suggestions concise but technical
        PERFORMANCE DATA
          Performance Score: ${data.performance.score}
          FCP: ${data.metrics.fcp}
          LCP: ${data.metrics.lcp}
          TBT: ${data.metrics.tbt}
          CLS: ${data.metrics.cls}
          Speed Index: ${data.metrics.speedIndex}
          Performance Issues: ${data.performance.issues.join(", ")}
          SEO Score: ${data.seo.score}
          SEO Issues: ${data.seo.issues.join(", ")}
          Accessibility Score: ${data.accessibility.score}
          Accessibility Issues: ${data.accessibility.issues.join(", ")}
          Best Practices Score: ${data.bestPractices.score}
          Best Practices Issues: ${data.bestPractices.issues.join(", ")}
        OUTPUT FORMAT (STRICT JSON ONLY)
          Return ONLY valid JSON. No explanation outside JSON.
          {
          "performance": [
            {
              "issue": "Describe the issue clearly",
              "severity": "high | medium | low",
              "explanation": "Why this issue affects performance",
              "fix": "What should be done",
              "code": "Provide real code example (HTML/CSS/JS)"
            }
          ],
          "seo": [
            {
              "issue": "",
              "severity": "",
              "explanation": "",
              "fix": "",
              "code": ""
            }
          ],
          "accessibility": [
            {
              "issue": "",
              "severity": "",
              "explanation": "",
              "fix": "",
              "code": ""
            }
          ],
          "bestPractices": [
            {
              "issue": "",
              "severity": "",
              "explanation": "",
              "fix": "",
              "code": ""
            }
          ]
        }
      RULES
        1. Code must be real and usable (not pseudo code)
        2. Keep suggestions specific to the given issues
        3. Avoid repeating same suggestion
        4. If no issue, return empty array []
        5. Keep each suggestion short but meaningful
        6. Prefer modern best practices (lazy loading, WebP, CDN, async JS, etc.)
        `;
    };
    const prompt = generatePrompt(lighthouseResult);
    console.log("prompt:", prompt);
    const suggestionsResponse = await getModel().generateContent(prompt);
    const suggestionsText = suggestionsResponse.response.text();
    console.log("✅ Generated suggestions based on Lighthouse data");

    let suggestions = {};
    try {
      suggestions = JSON.parse(suggestionsText);
      console.log("✅ Parsed suggestions as JSON");
      console.log(suggestions);
    } catch (parseError) {
      console.warn(
        "⚠️  Could not parse suggestions as JSON, returning raw text",
      );
      suggestions = { raw: suggestionsText };
    }
    console.log("✅ Final suggestions object ready to be saved", suggestions);

    const safeSuggestions = {
      performance: suggestions.performance || [],
      seo: suggestions.seo || [],
      accessibility: suggestions.accessibility || [],
      bestPractices: suggestions.bestPractices || [],
    };

    console.log("safeSuggestions:", safeSuggestions);
    const formattedSuggestions = [
      ...suggestions.performance.map((s) => ({
        ...s,
        category: "performance",
      })),
      ...suggestions.seo.map((s) => ({ ...s, category: "seo" })),
      ...suggestions.accessibility.map((s) => ({
        ...s,
        category: "accessibility",
      })),
      ...suggestions.bestPractices.map((s) => ({
        ...s,
        category: "bestPractices",
      })),
    ];
    console.log("✅ Formatted suggestions for database:", formattedSuggestions);

    const issues = report.categories.performance.auditRefs
      .filter((audit) => report.audits[audit.id]?.score === 0)
      .map((audit) => ({
        category: "performance",
        message: report.audits[audit.id]?.title,
        severity: "high",
      }));
    console.log("Identified performance issues:", issues);

    const result = new Lighthouse({
      userId: req.userId,
      url: url,
      name: name,
      scores: {
        performance: lighthouseResult.performance.score,
        accessibility: lighthouseResult.accessibility.score,
        bestPractices: lighthouseResult.bestPractices.score,
        seo: lighthouseResult.seo.score,
      },
      metrics: lighthouseResult.metrics,
      issues: issues,
      aiSuggestions: formattedSuggestions,
      rawReport: {
        performance: lighthouseResult.rawReport.performance,
        seo: lighthouseResult.rawReport.seo,
        audits: lighthouseResult.rawReport.audits["largest-contentful-paint"],
      },
      testedAt: new Date(),
    });
    console.log("✅ Final result object ready to be saved:", result);
    await result.save();

    res.json({ result });
    console.log(
      "✅ Analysis complete! Sent detailed results:",
      JSON.stringify(result, null, 2),
    );
  } catch (error) {
    console.error("Lighthouse error:", error.message);
    return res.status(500).json({
      message: "Error analyzing website",
      error: error.message,
    });
  }
});

export default router;
