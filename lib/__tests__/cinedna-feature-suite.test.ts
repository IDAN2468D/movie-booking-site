import { describe, it, expect } from "vitest";
import {
  CineDnaQuerySchema,
  CineDnaNodeSchema,
  CineDnaEdgeSchema,
} from "@/lib/schemas/cineDna.schema";
import { fetchCineDnaGraph } from "@/lib/actions/cineDnaActions";
import {
  SeatAcousticProfileSchema,
  HallAcousticQuerySchema,
} from "@/lib/schemas/acousticSweetspot.schema";
import { fetchHallAcousticProfile } from "@/lib/actions/acousticSweetspotActions";
import {
  CreateSquadRoomInputSchema,
  SquadRoomSchema,
} from "@/lib/schemas/cinesquad.schema";
import {
  createSquadRoom,
  getSquadRoom,
  joinSquadRoom,
  claimSquadSeat,
} from "@/lib/actions/cinesquadActions";
import {
  CommentaryTrackSchema,
  FetchCommentaryQuerySchema,
} from "@/lib/schemas/directorsCut.schema";
import { fetchDirectorsCutCommentary } from "@/lib/actions/directorsCutActions";
import {
  MemoryShardSchema,
  MintShardInputSchema,
} from "@/lib/schemas/memoryCapsule.schema";
import {
  mintMemoryShard,
  fetchUserMemoryVault,
} from "@/lib/actions/memoryCapsuleActions";

describe("🧬 CineDNA Feature Suite & Next-Gen Cinema Architecture Tests", () => {
  describe("1. CineDNA Graph Explorer", () => {
    it("validates CineDNA query schema correctly", () => {
      const valid = CineDnaQuerySchema.safeParse({ movieId: "693134", depth: 2 });
      expect(valid.success).toBe(true);

      const invalid = CineDnaQuerySchema.safeParse({ movieId: "", depth: 5 });
      expect(invalid.success).toBe(false);
    });

    it("fetches CineDNA graph with core nodes and stylistic edges", async () => {
      const res = await fetchCineDnaGraph({ movieId: "693134" });
      expect(res.success).toBe(true);
      expect(res.data).toBeDefined();
      if (res.data) {
        expect(res.data.nodes.length).toBeGreaterThan(0);
        expect(res.data.edges.length).toBeGreaterThan(0);
        const core = res.data.nodes.find((n) => n.type === "movie");
        expect(core).toBeDefined();
      }
    });
  });

  describe("2. Acoustic Sweet-Spot 3D Simulator", () => {
    it("validates seat acoustic profile schema", () => {
      const valid = SeatAcousticProfileSchema.safeParse({
        seatId: "D4",
        row: "D",
        number: 4,
        coordinates: { x: 0, y: 0.5, z: 0 },
        speakerDistances: {
          frontLeft: 6.2,
          frontCenter: 5.5,
          frontRight: 6.2,
          surroundLeft: 4.1,
          surroundRight: 4.1,
          subwoofer: 3.5,
        },
        immersionScore: 96,
        sweetSpotRating: "EXCELLENT",
        reverbTimeSec: 0.55,
        bassClarityIndex: 95,
        dialogueIntelligibility: 98,
        recommendedPerk: "Dolby Atmos Sweet Spot",
      });
      expect(valid.success).toBe(true);
    });

    it("computes full hall acoustic data and locates optimal sweet spot seat", async () => {
      const res = await fetchHallAcousticProfile();
      expect(res.success).toBe(true);
      expect(res.data).toBeDefined();
      if (res.data) {
        expect(res.data.totalSeats).toBe(48);
        expect(res.data.optimalSeatId).toBeDefined();
        const profile = res.data.profiles[res.data.optimalSeatId];
        expect(profile.immersionScore).toBeGreaterThanOrEqual(80);
      }
    });
  });

  describe("3. CineSquad Smart Split & Sync", () => {
    it("creates, joins and claims seats in a squad room", async () => {
      const created = await createSquadRoom({
        hostUserId: "host-1",
        hostName: "עידן המארח",
        movieId: "693134",
        movieTitle: "חולית: חלק 2",
        showtimeId: "st-1",
        showtimeLabel: "21:00",
        hallName: "אולם VIP 1",
      });
      expect(created.success).toBe(true);
      const roomId = created.data!.roomId;

      const joined = await joinSquadRoom({
        roomId,
        userId: "friend-2",
        name: "שירה לוי",
      });
      expect(joined.success).toBe(true);
      expect(joined.data!.members.length).toBe(2);

      const claimed = await claimSquadSeat({
        roomId,
        userId: "friend-2",
        seatId: "D5",
      });
      expect(claimed.success).toBe(true);
      const member = claimed.data!.members.find((m) => m.userId === "friend-2");
      expect(member?.selectedSeat).toBe("D5");
    });
  });

  describe("4. Director's Cut Audio AI Commentary", () => {
    it("fetches commentary tracks for different personas", async () => {
      const directorTrack = await fetchDirectorsCutCommentary({
        movieId: "693134",
        persona: "director",
      });
      expect(directorTrack.success).toBe(true);
      expect(directorTrack.data?.persona).toBe("director");
      expect(directorTrack.data?.segments.length).toBeGreaterThan(0);

      const easterEggTrack = await fetchDirectorsCutCommentary({
        movieId: "693134",
        persona: "easter_egg_hunter",
      });
      expect(easterEggTrack.success).toBe(true);
      expect(easterEggTrack.data?.persona).toBe("easter_egg_hunter");
    });
  });

  describe("5. Post-Show Memory Capsules", () => {
    it("mints collectible memory shards and adds them to user vault", async () => {
      const minted = await mintMemoryShard({
        movieId: "693134",
        movieTitle: "חולית: חלק 2",
        seatLabel: "D4",
        hallName: "אולם 1",
        userId: "test-user-vault",
      });
      expect(minted.success).toBe(true);
      expect(minted.data?.rarity).toBeDefined();
      expect(minted.data?.marketValueIls).toBeGreaterThan(0);

      const vault = await fetchUserMemoryVault("test-user-vault");
      expect(vault.success).toBe(true);
      expect(vault.data?.length).toBeGreaterThanOrEqual(1);
    });
  });
});
