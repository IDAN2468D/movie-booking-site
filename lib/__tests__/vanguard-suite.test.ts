import { describe, it, expect } from "vitest";
import { SquadPodSessionSchema } from "../validations/squadPod";
import { SmartTrayResponseSchema } from "../validations/smartTray";
import { createSquadPodAction } from "../../app/actions/squadPodActions";
import { getSmartTrayRecommendationAction } from "../../app/actions/smartTrayActions";
import { getCinemaWrappedAction } from "../../app/actions/cinemaWrappedActions";
import { getAfterglowTriviaAction } from "../../app/actions/afterglowActions";

describe("Vanguard Next-Gen Suite (Sprints 57-60)", () => {
  it("validates Squad Pod session schema and action output", async () => {
    const res = await createSquadPodAction("אווטאר 3", 101);
    expect(res.success).toBe(true);
    expect(res.data?.members.length).toBeGreaterThan(0);
    const valid = SquadPodSessionSchema.safeParse(res.data);
    expect(valid.success).toBe(true);
  });

  it("validates Smart F&B Tray menu recommendation", async () => {
    const res = await getSmartTrayRecommendationAction("Action Sci-Fi");
    expect(res.success).toBe(true);
    expect(res.data?.totalPrice).toBeGreaterThan(0);
    const valid = SmartTrayResponseSchema.safeParse(res.data);
    expect(valid.success).toBe(true);
  });

  it("returns annual Cinema Wrapped data", async () => {
    const res = await getCinemaWrappedAction();
    expect(res.success).toBe(true);
    expect(res.data?.totalMoviesWatched).toBeGreaterThan(0);
  });

  it("returns Afterglow trivia questions", async () => {
    const res = await getAfterglowTriviaAction("סייברפאנק");
    expect(res.success).toBe(true);
    expect(res.data?.length).toBeGreaterThan(0);
  });
});
