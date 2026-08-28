import { SubtitleCue } from "@/lib/schemas/subtitleSync";

function formatSrtTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  const millis = ms % 1000;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")},${String(millis).padStart(3, "0")}`;
}

export function exportToSrt(cues: SubtitleCue[], movieTitle = "CineSub_Subtitles"): void {
  if (!cues.length || typeof window === "undefined") return;

  const srtContent = cues
    .map((cue, index) => {
      const start = formatSrtTime(cue.startTimeMs);
      const end = formatSrtTime(cue.endTimeMs);
      return `${index + 1}\n${start} --> ${end}\n[${cue.speaker}] ${cue.translatedText}\n(${cue.originalText})\n`;
    })
    .join("\n");

  const blob = new Blob([srtContent], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${movieTitle.replace(/\s+/g, "_")}_subtitles.srt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
