const OpenAI = require("openai");

console.log("🔍 Initializing OpenAI...");
console.log("API Key available:", !!process.env.OPENAI_API_KEY);

if (!process.env.OPENAI_API_KEY) {
  console.warn("⚠️  WARNING: OPENAI_API_KEY not found in environment variables!");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getAISuggestions(category, categoryData) {
  try {
    console.log("🤖 AI Suggestion request received for category:", category);
    console.log("Category data keys:", Object.keys(categoryData));

    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API Key is not configured. Please add OPENAI_API_KEY to your .env file.");
    }

    const prompt = `You are a web performance expert. Analyze this ${category} data and provide detailed, actionable improvement suggestions.

${category.charAt(0).toUpperCase() + category.slice(1)} DATA:
${JSON.stringify(categoryData, null, 2)}

Please provide improvement suggestions in this EXACT format:

## 🎯 CRITICAL ISSUES (Fix First)
For each critical issue:
- **Issue**: [What is the problem?]
- **Why**: [Why is this happening?]
- **Solution**: [How to fix it - step by step]

## ⚠️ HIGH PRIORITY IMPROVEMENTS
For each high priority item:
- **Issue**: [What is the problem?]
- **Why**: [Why is this happening?]
- **Solution**: [How to fix it - step by step]

## 💡 GOOD TO HAVE IMPROVEMENTS
For each good to have item:
- **Issue**: [What is the problem?]
- **Why**: [Why is this happening?]
- **Solution**: [How to fix it - step by step]

Be specific, technical, and actionable. Focus on the actual issues found in the report.`;

    console.log("📝 Sending prompt to OpenAI...");
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const suggestions = response.choices[0].message.content;
    console.log("✅ AI suggestions generated successfully");
    return suggestions;
    
  } catch (error) {
    console.error("❌ AI Suggestion Error Details:", {
      message: error.message,
      code: error.code,
      status: error.status,
      type: error.type,
    });
    throw error;
  }
}

module.exports = { getAISuggestions };