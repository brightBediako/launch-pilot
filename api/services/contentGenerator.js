import { generatePlatformContent } from "./aiService.js";

/**
 * Generate draft for Product Hunt
 */
export const generateProductHuntDraft = async (
  launchData,
  userContext = {}
) => {
  try {
    const result = await generatePlatformContent(
      launchData,
      "producthunt",
      userContext
    );
    const content = result.content;

    return {
      title: content.title || launchData.title,
      body:
        content.body ||
        content.description ||
        launchData.description.substring(0, 260),
      hashtags: content.hashtags || ["Launch", "ProductHunt", "Startup"],
      cta: content.cta || "Check it out and share your feedback!",
      aiProvider: result.aiProvider,
    };
  } catch (error) {
    console.error("Product Hunt draft generation error:", error.message);
    // Fallback to template
    return templateProductHuntDraft(launchData);
  }
};

/**
 * Generate draft for Twitter/X
 */
export const generateTwitterDraft = async (launchData, userContext = {}) => {
  try {
    const result = await generatePlatformContent(
      launchData,
      "twitter",
      userContext
    );
    const content = result.content;

    // Twitter thread format
    const body = Array.isArray(content.body)
      ? content.body.join("\n\n---TWEET---\n\n")
      : content.body;

    return {
      title: content.title || `🚀 Launching ${launchData.title}`,
      body: body || templateTwitterThread(launchData),
      hashtags: content.hashtags || ["Launch", "Startup", "Tech"],
      cta: content.cta || "Try it out and let me know what you think!",
      aiProvider: result.aiProvider,
    };
  } catch (error) {
    console.error("Twitter draft generation error:", error.message);
    return templateTwitterDraft(launchData);
  }
};

/**
 * Generate draft for LinkedIn
 */
export const generateLinkedInDraft = async (launchData, userContext = {}) => {
  try {
    const result = await generatePlatformContent(
      launchData,
      "linkedin",
      userContext
    );
    const content = result.content;

    return {
      title: content.title || `Excited to announce: ${launchData.title}`,
      body: content.body || templateLinkedInPost(launchData),
      hashtags: content.hashtags || [
        "ProductLaunch",
        "Innovation",
        "Technology",
      ],
      cta: content.cta || "Would love to hear your thoughts!",
      aiProvider: result.aiProvider,
    };
  } catch (error) {
    console.error("LinkedIn draft generation error:", error.message);
    return templateLinkedInDraft(launchData);
  }
};

// Template fallbacks
function templateProductHuntDraft(launchData) {
  return {
    title: launchData.title.substring(0, 60),
    body: launchData.description.substring(0, 260),
    hashtags: ["Launch", "ProductHunt", "Startup"],
    cta: "Check it out and share your feedback!",
    aiProvider: "manual",
  };
}

function templateTwitterDraft(launchData) {
  const thread = [
    `🚀 Launching ${launchData.title}!`,
    `${launchData.description.substring(0, 200)}...`,
    `Built for ${launchData.markets?.join(", ") || "everyone"}`,
    `Check it out: ${launchData.websiteUrl || "[Your URL]"}`,
  ];

  return {
    title: `🚀 Launching ${launchData.title}`,
    body: thread.join("\n\n---TWEET---\n\n"),
    hashtags: ["Launch", "Startup", "Tech"],
    cta: "Try it out and let me know what you think!",
    aiProvider: "manual",
  };
}

function templateTwitterThread(launchData) {
  const thread = [
    `🚀 Launching ${launchData.title}!`,
    `${launchData.description.substring(0, 200)}...`,
    `Built for ${launchData.markets?.join(", ") || "everyone"}`,
    `Check it out: ${launchData.websiteUrl || "[Your URL]"}`,
  ];
  return thread.join("\n\n---TWEET---\n\n");
}

function templateLinkedInDraft(launchData) {
  return {
    title: `Excited to announce: ${launchData.title}`,
    body: `I'm thrilled to share ${launchData.title}!\n\n${
      launchData.description
    }\n\nThis is designed to help ${
      launchData.markets?.join(" and ") || "teams"
    } succeed.\n\nCheck it out: ${launchData.websiteUrl || "[Your URL]"}`,
    hashtags: ["ProductLaunch", "Innovation", "Technology"],
    cta: "Would love to hear your thoughts!",
    aiProvider: "manual",
  };
}

function templateLinkedInPost(launchData) {
  return `I'm thrilled to share ${launchData.title}!\n\n${
    launchData.description
  }\n\nThis is designed to help ${
    launchData.markets?.join(" and ") || "teams"
  } succeed.\n\nCheck it out: ${launchData.websiteUrl || "[Your URL]"}`;
}

export default {
  generateProductHuntDraft,
  generateTwitterDraft,
  generateLinkedInDraft,
};
