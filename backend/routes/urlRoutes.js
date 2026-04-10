const express = require("express");
const chromeLauncher = require("chrome-launcher");

const router = express.Router();

router.post("/url", async (req, res) => {
  let { url } = req.body;
  let chrome;

  // Validate URL
  if (!url) {
    return res.status(400).json({ message: "URL is required" });
  }

  // Add protocol if missing
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  try {
    // Validate URL format
    new URL(url);

    // Dynamically import lighthouse
    const lighthouse = (await import("lighthouse")).default;

    chrome = await chromeLauncher.launch({ 
      chromeFlags: ["--headless", "--no-sandbox"] 
    });

    const options = {
      logLevel: "error",
      output: "json",
      port: chrome.port,
      onlyCategories: ["performance", "seo", "accessibility", "best-practices"],
    };

    const runnerResult = await lighthouse(url, options);

    const report = runnerResult.lhr;

    // Kill Chrome safely with error handling
    try {
      // Add delay to ensure process fully completes
      await new Promise(resolve => setTimeout(resolve, 1000));
      await chrome.kill();
    } catch (e) {
      console.warn("Warning: Failed to cleanly kill Chrome:", e.message);
    }

    // Extract detailed data from lighthouse
    const performanceAudits = report.audits;
    
    const result = {
      performance: {
        score: report.categories.performance.score * 100,
        fcp: performanceAudits["first-contentful-paint"]?.displayValue || "N/A",
        lcp: performanceAudits["largest-contentful-paint"]?.displayValue || "N/A",
        tbt: performanceAudits["total-blocking-time"]?.displayValue || "N/A",
        cls: performanceAudits["cumulative-layout-shift"]?.displayValue || "N/A",
        speedIndex: performanceAudits["speed-index"]?.displayValue || "N/A",
      },
      seo: {
        score: report.categories.seo.score * 100,
        issues: report.categories.seo.auditRefs
          .filter(audit => report.audits[audit.id]?.score === 0)
          .map(audit => report.audits[audit.id]?.title || audit.id)
          .slice(0, 5)
      },
      accessibility: {
        score: report.categories.accessibility.score * 100,
        issues: report.categories.accessibility.auditRefs
          .filter(audit => report.audits[audit.id]?.score === 0)
          .map(audit => report.audits[audit.id]?.title || audit.id)
          .slice(0, 5)
      },
      bestPractices: {
        score: report.categories["best-practices"].score * 100,
        issues: report.categories["best-practices"].auditRefs
          .filter(audit => report.audits[audit.id]?.score === 0)
          .map(audit => report.audits[audit.id]?.title || audit.id)
          .slice(0, 5)
      }
    };

    res.json(result);
    console.log("✅ Analysis complete! Sent detailed results:", JSON.stringify(result, null, 2));

  } catch (error) {
    console.error("Lighthouse error:", error.message);
    
    // Ensure Chrome is killed even on error
    if (chrome) {
      try {
        await chrome.kill();
      } catch (e) {
        console.warn("Warning: Failed to kill Chrome on error:", e.message);
      }
    }
    
    res.status(500).json({ message: "Error analyzing website", error: error.message });
  }
});

module.exports = router;