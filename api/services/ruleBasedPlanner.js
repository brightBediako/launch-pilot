/**
 * Rule-based launch planner - Fallback when AI is unavailable
 * Provides template-based launch plans based on product type and market
 */

export const ruleBasedPlanner = (launchData, userContext = {}) => {
  const { productType, targetDate, markets, budget } = launchData;
  const { timezone, currency } = userContext;

  const plan = {
    strategy: generateStrategy(productType, markets),
    timeline: generateTimeline(productType, targetDate),
    tactics: generateTactics(productType, markets),
    marketSpecific: generateMarketSpecific(markets, budget),
    milestones: generateMilestones(productType),
    aiProvider: "rule-based",
    generatedAt: new Date(),
  };

  return plan;
};

function generateStrategy(productType, markets) {
  const strategies = {
    saas: "Launch with a freemium model, focus on product-led growth, leverage community feedback, and build in public on social media.",
    "mobile-app":
      "Soft launch in target market, gather early user feedback, optimize app store presence, and leverage local influencers.",
    "web-app":
      "Create buzz with beta access, use waitlist strategy, engage tech communities, and highlight unique value proposition.",
    "physical-product":
      "Build anticipation with pre-orders, showcase product demos, leverage unboxing content, and partner with local retailers.",
    service:
      "Establish credibility through case studies, offer limited early-bird pricing, network in business communities.",
    other:
      "Create awareness through targeted content marketing, build community engagement, and leverage word-of-mouth.",
  };

  const marketAddition = markets?.includes("NG")
    ? " Prioritize Nigerian tech ecosystem (Lagos, Abuja) with local payment integration."
    : markets?.includes("GH")
    ? " Focus on Ghanaian startup scene (Accra) with mobile-first approach."
    : " Adopt mobile-first approach for African markets.";

  return (strategies[productType] || strategies.other) + marketAddition;
}

function generateTimeline(productType, targetDate) {
  const launchDate = new Date(targetDate);
  const today = new Date();
  const daysUntilLaunch = Math.ceil(
    (launchDate - today) / (1000 * 60 * 60 * 24)
  );

  const phases = [
    {
      phase: "Pre-Launch Setup",
      duration: Math.ceil(daysUntilLaunch * 0.25),
      tasks: [
        "Set up analytics and tracking",
        "Create landing page with email capture",
        "Prepare product demo/screenshots",
        "Set up social media profiles",
        "Identify key influencers and communities",
      ],
    },
    {
      phase: "Content Creation",
      duration: Math.ceil(daysUntilLaunch * 0.2),
      tasks: [
        "Write Product Hunt description and tagline",
        "Create Twitter/X launch thread",
        "Design LinkedIn announcement post",
        "Prepare blog post/article",
        "Create demo video",
      ],
    },
    {
      phase: "Community Building",
      duration: Math.ceil(daysUntilLaunch * 0.25),
      tasks: [
        "Engage with target communities",
        "Build email list with lead magnet",
        "Reach out to potential supporters",
        "Join relevant WhatsApp/Telegram groups",
        "Network with local tech community",
      ],
    },
    {
      phase: "Launch Preparation",
      duration: Math.ceil(daysUntilLaunch * 0.15),
      tasks: [
        "Schedule Product Hunt launch",
        "Prepare social media content calendar",
        "Brief supporters and team",
        "Set up customer support channels",
        "Test all systems and links",
      ],
    },
    {
      phase: "Launch Day",
      duration: 1,
      tasks: [
        "Post on Product Hunt at optimal time",
        "Publish on social media platforms",
        "Engage with comments and questions",
        "Monitor analytics and metrics",
        "Celebrate and share milestones",
      ],
    },
    {
      phase: "Post-Launch",
      duration: Math.ceil(daysUntilLaunch * 0.15),
      tasks: [
        "Gather user feedback",
        "Share launch results and learnings",
        "Follow up with leads",
        "Optimize based on metrics",
        "Plan next iteration",
      ],
    },
  ];

  // Calculate dates for each phase
  let currentDate = new Date(today);
  return phases.map((phase) => {
    const startDate = new Date(currentDate);
    currentDate.setDate(currentDate.getDate() + phase.duration);
    const endDate = new Date(currentDate);

    return {
      phase: phase.phase,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      tasks: phase.tasks,
    };
  });
}

function generateTactics(productType, markets) {
  const baseTactics = [
    "Launch on Product Hunt with hunter support",
    "Create launch announcement thread on Twitter/X",
    "Post in relevant LinkedIn groups",
    "Share in indie hacker communities",
    "Engage with tech influencers",
    "Email existing subscribers/waitlist",
  ];

  const marketTactics = {
    NG: [
      "Post in Nigerian tech WhatsApp/Telegram groups",
      "Engage with Lagos/Abuja tech communities",
      "Use local payment methods (Paystack)",
      "Partner with Nigerian tech influencers",
      "List on local directories (Techpoint, TechCabal)",
    ],
    GH: [
      "Engage with Accra startup ecosystem",
      "Promote in Ghanaian tech communities",
      "Integrate Mobile Money payments",
      "Partner with local tech hubs",
      "Feature on Ghana tech blogs",
    ],
  };

  let tactics = [...baseTactics];

  markets?.forEach((market) => {
    if (marketTactics[market]) {
      tactics = [...tactics, ...marketTactics[market]];
    }
  });

  return tactics;
}

function generateMarketSpecific(markets, budget) {
  const marketSpecific = {};
  const totalBudget = budget?.amount || 10000;
  const currency = budget?.currency || "NGN";

  if (markets?.includes("NG")) {
    marketSpecific.NG = {
      strategy:
        "Focus on Lagos and Abuja tech ecosystems, leverage local payment methods, engage with Nigerian tech communities",
      channels: [
        "Product Hunt",
        "Twitter/X",
        "LinkedIn",
        "WhatsApp groups",
        "Techpoint Africa",
        "TechCabal",
        "Radar (by TechCabal)",
      ],
      budget: Math.ceil(totalBudget * 0.6), // 60% for primary market
    };
  }

  if (markets?.includes("GH")) {
    marketSpecific.GH = {
      strategy:
        "Target Accra startup scene, emphasize mobile-first approach, integrate with local payment systems",
      channels: [
        "Product Hunt",
        "Twitter/X",
        "LinkedIn",
        "Ghana Tech Lab",
        "MEST Africa",
        "Local tech blogs",
      ],
      budget: Math.ceil(totalBudget * 0.4), // 40% for secondary market
    };
  }

  if (!markets || markets.length === 0) {
    marketSpecific.global = {
      strategy:
        "Broad tech community approach with emphasis on emerging markets",
      channels: [
        "Product Hunt",
        "Twitter/X",
        "LinkedIn",
        "Indie Hackers",
        "Hacker News",
      ],
      budget: totalBudget,
    };
  }

  return marketSpecific;
}

function generateMilestones(productType) {
  return [
    "Landing page live with 100+ email signups",
    "Product Hunt launch scheduled with 5+ hunters contacted",
    "Social media content calendar completed",
    "500+ views on launch day",
    "50+ upvotes on Product Hunt",
    "100+ product signups/downloads in first week",
    "First paying customer",
    "Featured on at least one tech publication",
  ];
}

export default ruleBasedPlanner;
