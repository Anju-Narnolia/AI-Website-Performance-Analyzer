const express = require("express");
const chromeLauncher = require("chrome-launcher");
const Website = require("../model/website");
const Lighthouse = require("../model/lighthouse");

const router = express.Router();

router.post("/url", async (req, res) => {
  let { url } = req.body;
  let chrome;

  console.log("📝 Analyze request received");
  console.log("UserID from auth middleware:", req.userId);

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

    // Check if URL already exists in DB
    let website = await Website.findOne({ url });
    if (!website) {
      const name = url.replace(/(^\w+:|^)\/\//, "").split("/")[0]; // Extract domain
      website = new Website({
        userId: req.userId, // From auth middleware
        URL: url,
        name: name,
        createdAt: new Date(),
      });
      await website.save();
      console.log("✅ Website saved to database:", website._id);
    } else {
      console.log("📌 Website already exists in database:", website._id);
    }

    // Dynamically import lighthouse
    const lighthouse = (await import("lighthouse")).default;

    chrome = await chromeLauncher.launch({
      chromeFlags: ["--headless", "--no-sandbox"],
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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await chrome.kill();
    } catch (e) {
      console.warn("Warning: Failed to cleanly kill Chrome:", e.message);
    }

    // Extract detailed data from lighthouse
    const performanceAudits = report.audits;

    // Extract metrics from report
    const metrics = {
      fcp: performanceAudits["first-contentful-paint"]?.numericValue || null,
      lcp: performanceAudits["largest-contentful-paint"]?.numericValue || null,
      cls: performanceAudits["cumulative-layout-shift"]?.numericValue || null,
      tbt: performanceAudits["total-blocking-time"]?.numericValue || null,
      speedIndex: performanceAudits["speed-index"]?.numericValue || null,
    };

    // Save Lighthouse report to database
    const lighthouseResult = new Lighthouse({
      projectId: website._id,
      userId: req.userId,
      testedAt: new Date(),
      scores: {
        performance: report.categories.performance.score * 100,
        accessibility: report.categories.accessibility.score * 100,
        bestPractices: report.categories["best-practices"].score * 100,
        seo: report.categories.seo.score * 100,
      },
      metrics: metrics,
      environment: {
        device: "mobile",
        location: "India",
      },
      rawReport: report,
    });

    await lighthouseResult.save();
    console.log("✅ Lighthouse report saved to database:", lighthouseResult._id);

    const result = {
      performance: {
        score: report.categories.performance.score * 100,
        fcp: performanceAudits["first-contentful-paint"]?.displayValue || "N/A",
        lcp:
          performanceAudits["largest-contentful-paint"]?.displayValue || "N/A",
        tbt: performanceAudits["total-blocking-time"]?.displayValue || "N/A",
        cls:
          performanceAudits["cumulative-layout-shift"]?.displayValue || "N/A",
        speedIndex: performanceAudits["speed-index"]?.displayValue || "N/A",
      },
      seo: {
        score: report.categories.seo.score * 100,
        issues: report.categories.seo.auditRefs
          .filter((audit) => report.audits[audit.id]?.score === 0)
          .map((audit) => report.audits[audit.id]?.title || audit.id)
          .slice(0, 5),
      },
      accessibility: {
        score: report.categories.accessibility.score * 100,
        issues: report.categories.accessibility.auditRefs
          .filter((audit) => report.audits[audit.id]?.score === 0)
          .map((audit) => report.audits[audit.id]?.title || audit.id)
          .slice(0, 5),
      },
      bestPractices: {
        score: report.categories["best-practices"].score * 100,
        issues: report.categories["best-practices"].auditRefs
          .filter((audit) => report.audits[audit.id]?.score === 0)
          .map((audit) => report.audits[audit.id]?.title || audit.id)
          .slice(0, 5),
      },
    };

    res.json(result);
    console.log(
      "✅ Analysis complete! Sent detailed results:",
      JSON.stringify(result, null, 2),
    );
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

    res
      .status(500)
      .json({ message: "Error analyzing website", error: error.message });
  }
});

module.exports = router;
