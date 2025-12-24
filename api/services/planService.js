import LaunchPlan from "../models/LaunchPlan.js";
import { generateLaunchPlan } from "./aiService.js";
import { NotFoundError } from "../utils/errors.js";

/**
 * Shared function to generate and save launch plan
 * @param {Object} launch - Launch document
 * @param {Object} userContext - User context (timezone, currency, markets)
 * @param {boolean} isRegeneration - Whether this is a regeneration
 * @returns {Promise<Object>} Generated plan data
 */
export const generateAndSavePlan = async (launch, userContext, isRegeneration = false) => {
  // Generate plan using AI
  const generatedPlan = await generateLaunchPlan(
    {
      title: launch.title,
      description: launch.description,
      productType: launch.productType,
      targetDate: launch.targetDate,
      markets: launch.markets,
      budget: launch.budget,
    },
    userContext
  );

  // Update launch with AI config
  launch.plan = {
    strategy: generatedPlan.strategy,
    timeline: generatedPlan.timeline,
    tactics: generatedPlan.tactics,
  };
  launch.generatedBy = "ai";
  launch.aiConfig = {
    provider: generatedPlan.aiProvider,
    model:
      generatedPlan.aiProvider === "gemini" ? "gemini-pro" : "gpt-3.5-turbo",
    temperature: 0.7,
    iterations: isRegeneration
      ? (launch.aiConfig?.iterations || 0) + 1
      : 1,
  };
  await launch.save();

  // Create or update launch plan
  const planData = {
    launchId: launch._id,
    phases: generatedPlan.timeline.map((phase) => ({
      name: phase.phase,
      duration: Math.ceil(
        (new Date(phase.endDate) - new Date(phase.startDate)) /
          (1000 * 60 * 60 * 24)
      ),
      startDate: phase.startDate,
      endDate: phase.endDate,
      tasks: phase.tasks.map((task) => ({
        title: task,
        priority: "medium",
        status: "pending",
      })),
    })),
    recommendations: {
      channels: [],
    },
    milestones: generatedPlan.milestones
      ? generatedPlan.milestones.map((m) => ({
          title: m,
          completed: false,
        }))
      : [],
  };

  const plan = await LaunchPlan.findOneAndUpdate(
    { launchId: launch._id },
    planData,
    { upsert: true, new: true }
  );

  return {
    launch,
    plan,
    aiProvider: generatedPlan.aiProvider,
  };
};

export default {
  generateAndSavePlan,
};

