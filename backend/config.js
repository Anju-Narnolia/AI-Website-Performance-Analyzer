// Centralized configuration
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key_change_in_production_for_security";

console.log("========================================");
console.log("🔑 JWT Configuration:");
console.log("JWT_SECRET length:", JWT_SECRET.length);
console.log("JWT_SECRET first 10 chars:", JWT_SECRET.substring(0, 10));
console.log("Source:", process.env.JWT_SECRET ? "✅ From .env file" : "⚠️  Using default fallback");
console.log("========================================");

module.exports = {
  JWT_SECRET
};
