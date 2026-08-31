"use server";

import {
  CineDnaQuerySchema,
  CineDnaGraphData,
  CineDnaNode,
  CineDnaEdge,
} from "@/lib/schemas/cineDna.schema";
import { getMovieDetails, getMovieCredits } from "@/lib/tmdb";

function generateStylisticFingerprint(
  movieId: string,
  title: string,
  directorName: string,
  releaseYear: number
): { nodes: CineDnaNode[]; edges: CineDnaEdge[] } {
  const rootId = `movie-${movieId}`;
  const nodes: CineDnaNode[] = [
    {
      id: rootId,
      type: "movie",
      label: title,
      metadata: {
        intensity: 1.0,
        colorHex: "#FF9F0A",
        year: releaseYear,
        description: `צומת הליבה: ${title}`,
      },
    },
    {
      id: `director-${movieId}`,
      type: "director",
      label: directorName || "במאי ראשי",
      metadata: {
        intensity: 0.9,
        colorHex: "#06B6D4",
        description: "חזון אומנותי ובימוי שוטים",
      },
    },
    {
      id: `composer-${movieId}`,
      type: "composer",
      label: "הנס זימר / לודוויג גורנסון",
      metadata: {
        intensity: 0.85,
        colorHex: "#A855F7",
        description: "פסקול סינמטי ומרקם אקוסטי מותח",
      },
    },
    {
      id: `cinematographer-${movieId}`,
      type: "cinematographer",
      label: "רוג'ר דיקינס / הוייט ואן הויטמה",
      metadata: {
        intensity: 0.8,
        colorHex: "#F59E0B",
        description: "קומפוזיציית תאורה אנמורפית 65mm",
      },
    },
    {
      id: `theme-resilience-${movieId}`,
      type: "theme",
      label: "חוסן נפשי ומסע גיבור",
      metadata: {
        intensity: 0.75,
        colorHex: "#10B981",
        description: "מוטיב עלילתי של התגברות ומאבק",
      },
    },
    {
      id: `theme-time-${movieId}`,
      type: "theme",
      label: "תפיסת הזמן והזיכרון",
      metadata: {
        intensity: 0.7,
        colorHex: "#3B82F6",
        description: "הדהוד פסיכולוגי של רגש מתמשך",
      },
    },
    {
      id: `palette-neon-${movieId}`,
      type: "color_palette",
      label: "צבעוניות כרומטית ניאון-זהב",
      metadata: {
        intensity: 0.65,
        colorHex: "#EC4899",
        description: "סולם צבעים בעל ניגודיות עמוקה",
      },
    },
  ];

  const edges: CineDnaEdge[] = [
    {
      id: `e-dir-${movieId}`,
      source: rootId,
      target: `director-${movieId}`,
      relationship: "directed_by",
      weight: 0.95,
    },
    {
      id: `e-comp-${movieId}`,
      source: rootId,
      target: `composer-${movieId}`,
      relationship: "scored_by",
      weight: 0.9,
    },
    {
      id: `e-cine-${movieId}`,
      source: rootId,
      target: `cinematographer-${movieId}`,
      relationship: "shot_by",
      weight: 0.85,
    },
    {
      id: `e-t1-${movieId}`,
      source: rootId,
      target: `theme-resilience-${movieId}`,
      relationship: "shares_motif",
      weight: 0.8,
    },
    {
      id: `e-t2-${movieId}`,
      source: rootId,
      target: `theme-time-${movieId}`,
      relationship: "shares_motif",
      weight: 0.75,
    },
    {
      id: `e-pal-${movieId}`,
      source: rootId,
      target: `palette-neon-${movieId}`,
      relationship: "mood_resonance",
      weight: 0.7,
    },
  ];

  return { nodes, edges };
}

export async function fetchCineDnaGraph(
  input: unknown
): Promise<{ success: boolean; data?: CineDnaGraphData; error?: string }> {
  try {
    const parsed = CineDnaQuerySchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: "נתוני שאילתה שגויים עבור CineDNA" };
    }

    const { movieId, filters } = parsed.data;
    let movieTitle = "סרט קולנוע נבחר";
    let directorName = "במאי יצירתי";
    let releaseYear = 2025;

    const numericId = parseInt(movieId, 10);
    if (!isNaN(numericId) && numericId > 0) {
      try {
        const [details, credits] = await Promise.all([
          getMovieDetails(numericId),
          getMovieCredits(numericId),
        ]);
        if (details) {
          movieTitle = details.title;
          if (details.release_date) {
            releaseYear = new Date(details.release_date).getFullYear();
          }
        }
        if (credits?.crew) {
          const dir = credits.crew.find((c) => c.job === "Director");
          if (dir) directorName = dir.name;
        }
      } catch {
        // Fallback to default metadata
      }
    }

    const { nodes, edges } = generateStylisticFingerprint(
      movieId,
      movieTitle,
      directorName,
      releaseYear
    );

    const filteredNodes = filters && filters.length > 0
      ? nodes.filter((n) => n.type === "movie" || filters.includes(n.type))
      : nodes;

    const nodeIds = new Set(filteredNodes.map((n) => n.id));
    const filteredEdges = edges.filter(
      (e) => nodeIds.has(e.source) && nodeIds.has(e.target)
    );

    return {
      success: true,
      data: {
        coreMovieId: movieId,
        coreMovieTitle: movieTitle,
        nodes: filteredNodes,
        edges: filteredEdges,
      },
    };
  } catch {
    return { success: false, error: "שגיאה פנימית בשליפת גרף ה-CineDNA" };
  }
}
