import crypto from "crypto";

function generateApiKey() {
  return crypto.randomBytes(32).toString("hex");
}

export function hashApiKey(apiKey: string) {
  return crypto.createHash("sha256").update(apiKey).digest("hex");
}

export function generateAPIKey() {
  const apiKey = generateApiKey();
  const hashedApiKey = hashApiKey(apiKey);
  return {
    apiKey,
    hashedApiKey,
  };
}
