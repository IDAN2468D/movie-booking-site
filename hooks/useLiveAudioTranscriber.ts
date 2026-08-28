"use client";

import { useEffect, useRef } from "react";
import { useSubtitleStore } from "@/lib/store/subtitleStore";
import { processLiveAudioChunk } from "@/lib/actions/transcribeActions";

export function useLiveAudioTranscriber(movieId?: string) {
  const {
    isRecording,
    isTranscribing,
    isStealthMode,
    fontSize,
    selectedLanguage,
    currentCue,
    audioLevel,
    timeOffsetMs,
    setRecording,
    setTranscribing,
    toggleStealthMode,
    setFontSize,
    addCues,
    setAudioLevel,
    reset,
  } = useSubtitleStore();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const startStreaming = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtxClass();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      audioContextRef.current = audioCtx;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      intervalRef.current = setInterval(() => {
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
        setAudioLevel(Math.min(100, Math.round((avg / 255) * 100)));
      }, 100);

      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = recorder;
      startTimeRef.current = Date.now();

      recorder.ondataavailable = async (e) => {
        if (e.data && e.data.size > 0) {
          setTranscribing(true);
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64 = reader.result as string;
            const res = await processLiveAudioChunk({
              audioBase64: base64,
              mimeType: "audio/webm",
              movieId,
              targetLanguage: selectedLanguage,
              sceneTimestampMs: (Date.now() - startTimeRef.current) + timeOffsetMs,
            });
            if (res.success && res.cues.length > 0) {
              addCues(res.cues);
            }
            setTranscribing(false);
          };
          reader.readAsDataURL(e.data);
        }
      };

      recorder.start(4000);
      setRecording(true);
    } catch (err) {
      console.error("Microphone access error:", err);
      setRecording(false);
    }
  };

  const stopStreaming = () => {
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
      }
    } catch (e) {
      console.warn("MediaRecorder stop notice:", e);
    }

    try {
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
      }
    } catch (e) {
      console.warn("AudioContext close notice:", e);
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setRecording(false);
    setAudioLevel(0);
  };

  useEffect(() => {
    return () => {
      stopStreaming();
      reset();
    };
  }, []);

  return {
    isRecording,
    isTranscribing,
    isStealthMode,
    fontSize,
    currentCue,
    audioLevel,
    toggleStealthMode,
    setFontSize,
    startStreaming,
    stopStreaming,
  };
}
