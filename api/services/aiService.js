import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import { ruleBasedPlanner } from "./ruleBasedPlanner.js";
import logger from "../utils/logger.js";
import { ExternalServiceError } from "../utils/errors.js";

// Initialize AI clients
const genAI = process.env.GOOGLE_GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY)
  : null;

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

/**
 * Generate launch plan using AI with fallback strategy
 * @param {Object} launchData - Launch information
 * @param {Object} userContext - User context (timezone, currency, market)
 * @returns {Promise<Object>} Generated launch plan
 */
export const generateLaunchPlan = async (launchData, userContext = {}) => {
  const primaryProvider = process.env.AI_PROVIDER_PRIMARY || "gemini";

  try {
    // Try primary provider first
    if (primaryProvider === "gemini" && genAI) {
      return await generateWithGemini(launchData, userContext);
    } else if (primaryProvider === "openai" && openai) {
      return await generateWithOpenAI(launchData, userContext);
    }

    // If primary provider not available, try the other
    if (genAI) {
      return await generateWithGemini(launchData, userContext);
    } else if (openai) {
      return await generateWithOpenAI(launchData, userContext);
    }

    // If both AI providers fail, use rule-based fallback
    logger.warn("No AI providers available, using rule-based planner");
    return ruleBasedPlanner(launchData, userContext);
  } catch (error) {
    logger.error(`AI generation error: ${error.message}`);

    // Try alternative provider
    try {
      if (primaryProvider === "gemini" && openai) {
        logger.info("Gemini failed, trying OpenAI...");
        return await generateWithOpenAI(launchData, userContext);
      } else if (primaryProvider === "openai" && genAI) {
        logger.info("OpenAI failed, trying Gemini...");
        return await generateWithGemini(launchData, userContext);
      }
    } catch (fallbackError) {
      logger.error(`Fallback AI provider also failed: ${fallbackError.message}`);
    }

    // Final fallback to rule-based planner
    logger.warn("All AI providers failed, using rule-based planner");
    return ruleBasedPlanner(launchData, userContext);
  }
};

/**
 * Create a promise with timeout
 * @param {Promise} promise - Promise to wrap
 * @param {number} timeoutMs - Timeout in milliseconds
 * @param {string} errorMessage - Error message if timeout
 * @returns {Promise}
 */
function withTimeout(promise, timeoutMs, errorMessage) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
    ),
  ]);
}

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} initialDelay - Initial delay in ms
 * @returns {Promise}
 */
async function retryWithBackoff(fn, maxRetries = 3, initialDelay = 1000) {
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) {
        const delay = initialDelay * Math.pow(2, attempt);
        logger.warn(
          `AI request failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
}

/**
 * Generate launch plan using Google Gemini
 */
async function generateWithGemini(launchData, userContext) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const prompt = buildLaunchPlanPrompt(launchData, userContext);
  const timeoutMs = parseInt(process.env.AI_TIMEOUT_MS) || 30000; // 30 seconds default

  try {
    const result = await retryWithBackoff(
      () =>
        withTimeout(
          model.generateContent(prompt),
          timeoutMs,
          "Gemini API request timed out"
        ),
      2, // 2 retries
      1000 // 1 second initial delay
    );

    const response = await result.response;
    const text = response.text();

    // Parse JSON from response
    const parsed = parseAIResponse(text);

    return {
      ...parsed,
      aiProvider: "gemini",
      generatedAt: new Date(),
    };
  } catch (error) {
    logger.error(`Gemini generation failed: ${error.message}`);
    throw new ExternalServiceError("Gemini", error.message);
  }
}

/**
 * Generate launch plan using OpenAI
 */
async function generateWithOpenAI(launchData, userContext) {
  const prompt = buildLaunchPlanPrompt(launchData, userContext);
  const timeoutMs = parseInt(process.env.AI_TIMEOUT_MS) || 30000; // 30 seconds default

  try {
    const completion = await retryWithBackoff(
      () =>
        withTimeout(
          openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "You are an expert product launch strategist specializing in African markets, particularly Nigeria and Ghana. Provide practical, market-specific launch plans in JSON format.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            temperature: 0.7,
            response_format: { type: "json_object" },
          }),
          timeoutMs,
          "OpenAI API request timed out"
        ),
      2, // 2 retries
      1000 // 1 second initial delay
    );

    const text = completion.choices[0].message.content;
    const parsed = parseAIResponse(text);

    return {
      ...parsed,
      aiProvider: "openai",
      generatedAt: new Date(),
    };
  } catch (error) {
    logger.error(`OpenAI generation failed: ${error.message}`);
    throw new ExternalServiceError("OpenAI", error.message);
  }
}

/**
 * Build prompt for AI launch plan generation
 */
function buildLaunchPlanPrompt(launchData, userContext) {
  const { title, description, productType, targetDate, markets, budget } =
    launchData;
  const { timezone, currency } = userContext;

  const marketContext = markets?.includes("NG")
    ? "Nigeria (Lagos tech ecosystem, Naira currency, mobile-first users)"
    : markets?.includes("GH")
    ? "Ghana (Accra startup scene, Cedi currency, growing tech adoption)"
    : "African markets (mobile-first, cost-conscious, social media driven)";

  return `Generate a comprehensive product launch plan for the following product:

Title: ${title}
Description: ${description}
Product Type: ${productType}
Target Launch Date: ${targetDate}
Target Markets: ${markets?.join(", ") || "General"}
Budget: ${budget?.amount || "Not specified"} ${
    budget?.currency || currency || "NGN"
  }
Market Context: ${marketContext}

Please provide a detailed launch plan including:
1. Launch strategy overview
2. 4-6 launch phases with specific timelines
3. Key tasks for each phase (at least 5 tasks per phase)
4. Budget allocation recommendations
5. Market-specific tactics for ${markets?.join(" and ") || "the target market"}
6. Recommended channels (Product Hunt, Twitter/X, LinkedIn, local platforms)
7. Success metrics and milestones

Consider African market specifics:
- Mobile-first approach (high mobile internet usage)
- Cost-effectiveness (budget constraints)
- Community-driven marketing (WhatsApp groups, Twitter spaces)
- Local payment methods (Paystack for Nigeria, Mobile Money for Ghana)
- Timezone: ${timezone || "Africa/Lagos (WAT)"}

Return response in this JSON format:
{
  "strategy": "Overall launch strategy summary",
  "timeline": [
    {
      "phase": "Phase name",
      "startDate": "Date",
      "endDate": "Date",
      "tasks": ["Task 1", "Task 2", "..."]
    }
  ],
  "tactics": ["Tactic 1", "Tactic 2", "..."],
  "marketSpecific": {
    "NG": {"strategy": "...", "channels": ["..."], "budget": 0},
    "GH": {"strategy": "...", "channels": ["..."], "budget": 0}
  },
  "milestones": ["Milestone 1", "Milestone 2", "..."]
}`;
}

/**
 * Parse AI response to extract JSON
 */
function parseAIResponse(text) {
  try {
    // Try to find JSON in markdown code blocks
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }

    // Try to find raw JSON
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;
    if (jsonStart !== -1 && jsonEnd > jsonStart) {
      return JSON.parse(text.substring(jsonStart, jsonEnd));
    }

    // If no JSON found, try parsing entire response
    return JSON.parse(text);
  } catch (error) {
    logger.error(`Failed to parse AI response: ${error.message}`);
    throw new Error("Invalid AI response format");
  }
}

/**
 * Generate content for social media platforms
 */
export const generatePlatformContent = async (
  launchData,
  platform,
  userContext = {}
) => {
  const primaryProvider = process.env.AI_PROVIDER_PRIMARY || "gemini";

  try {
    const prompt = buildPlatformContentPrompt(
      launchData,
      platform,
      userContext
    );

    if (primaryProvider === "gemini" && genAI) {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return {
        content: parseAIResponse(response.text()),
        aiProvider: "gemini",
      };
    } else if (openai) {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a social media expert specializing in ${platform} content for African tech products. Create engaging, culturally relevant content.`,
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.8,
        response_format: { type: "json_object" },
      });

      return {
        content: parseAIResponse(completion.choices[0].message.content),
        aiProvider: "openai",
      };
    }

    throw new Error("No AI provider available");
  } catch (error) {
    logger.error(
      `Platform content generation error for ${platform}: ${error.message}`
    );
    throw error;
  }
};

/**
 * Build prompt for platform-specific content
 */
function buildPlatformContentPrompt(launchData, platform, userContext) {
  const { title, description } = launchData;
  const { markets } = userContext;

  const platformSpecs = {
    producthunt: {
      taglineLimit: 60,
      descriptionLimit: 260,
      tips: "Catchy tagline, clear value prop, tech-focused language",
    },
    twitter: {
      limit: 280,
      tips: "Thread format, hooks, hashtags, emojis (moderate use)",
    },
    linkedin: {
      limit: 3000,
      tips: "Professional tone, storytelling, problem-solution format",
    },
  };

  const spec = platformSpecs[platform] || platformSpecs.twitter;

  return `Create ${platform} launch content for:
Product: ${title}
Description: ${description}
Markets: ${markets?.join(", ") || "African markets"}

Requirements:
- ${
    platform === "producthunt"
      ? "Tagline (max 60 chars) and description (max 260 chars)"
      : ""
  }
- ${platform === "twitter" ? "A 5-tweet thread with hooks and hashtags" : ""}
- ${
    platform === "linkedin"
      ? "Professional post (500-1000 words) with storytelling"
      : ""
  }
- Include relevant hashtags for African tech community
- Mention value for ${markets?.includes("NG") ? "Nigerian" : "African"} users
- Tips: ${spec.tips}

Return JSON format:
{
  "title": "Main title/tagline",
  "body": "Main content or array of tweets",
  "hashtags": ["tag1", "tag2", "..."],
  "cta": "Call to action"
}`;
}

export default {
  generateLaunchPlan,
  generatePlatformContent,
};
