"use server";

import { storyBranchSchema } from "@/lib/schemas/storyBranching";

export async function generateStoryBranchScenario(movieId: string, userChoicePrompt: string) {
  try {
    return {
      success: true,
      data: {
        nodeId: `node_${Date.now()}`,
        movieId,
        title: `תרחיש חלופי: ${userChoicePrompt}`,
        choiceText: userChoicePrompt,
        consequenceSummary: "תפנית עלילתית בלתי צפויה שמתרחשת בעקבות החלטת הדמות הראשית.",
        parentId: "root_node",
        childNodeIds: [],
        aiConfidenceScore: 94,
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to generate story branch";
    return { success: false, error: message };
  }
}

export async function getMovieStoryTree(movieId: string) {
  try {
    return {
      success: true,
      data: [
        {
          nodeId: "root_1",
          movieId,
          title: "נקודת ההתפצלות המקורית",
          choiceText: "הגיבור בוחר להיכנס לפורטל",
          consequenceSummary: "העלילה המקורית שודרה בקולנוע.",
          parentId: null,
          childNodeIds: ["branch_a", "branch_b"],
          aiConfidenceScore: 100,
        },
        {
          nodeId: "branch_a",
          movieId,
          title: "מה אם? תרחיש A",
          choiceText: "הגיבור מסרב להיכנס לפורטל ומקים בסיס סודי",
          consequenceSummary: "האנושות נלחמת באיום ללא טכנולוגיית הפורטל.",
          parentId: "root_1",
          childNodeIds: [],
          aiConfidenceScore: 92,
        },
      ],
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch story tree";
    return { success: false, error: message };
  }
}
