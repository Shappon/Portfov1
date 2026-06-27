"use client";

import { useEffect, useRef } from "react";
import { CV_VIDEOS, type CvVideoKey } from "@/data/cv";

const CV_VIDEO_VOLUME = 30;

interface CvVideoPlayerProps {
  videoKey: CvVideoKey | null;
}

interface YouTubePlayer {
  destroy: () => void;
  setVolume: (volume: number) => void;
  unMute: () => void;
  playVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
}

interface YouTubePlayerEvent {
  target: YouTubePlayer;
}

interface YouTubePlayerConstructor {
  new (
    element: HTMLElement,
    options: {
      videoId: string;
      playerVars?: Record<string, number | string>;
      events?: {
        onReady?: (event: YouTubePlayerEvent) => void;
      };
    }
  ): YouTubePlayer;
}

declare global {
  interface Window {
    YT?: { Player: YouTubePlayerConstructor };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youtubeApiPromise: Promise<void> | null = null;

function ensureYouTubeIframeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();

  if (!youtubeApiPromise) {
    youtubeApiPromise = new Promise((resolve) => {
      const previousReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previousReady?.();
        resolve();
      };

      if (!document.getElementById("youtube-iframe-api")) {
        const script = document.createElement("script");
        script.id = "youtube-iframe-api";
        script.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(script);
      }
    });
  }

  return youtubeApiPromise;
}

/**
 * Lecteur YouTube affiché à droite du CV.
 * Se lance au survol des mots-clés d'expérience (volume réglé à 30 %).
 * Reste affichée jusqu'au prochain survol d'un autre élément vidéo.
 */
export function CvVideoPlayer({ videoKey }: CvVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const entry = videoKey ? CV_VIDEOS[videoKey] : null;
  const youtubeId = entry?.youtubeId?.trim() ?? "";
  const startSeconds = entry?.startSeconds ?? 0;
  const hasVideo = youtubeId.length > 0;

  useEffect(() => {
    const container = containerRef.current;
    if (!videoKey || !entry || !hasVideo || !container) return;

    let player: YouTubePlayer | null = null;
    let cancelled = false;

    // Nœud-hôte recréé manuellement : YouTube le remplace par son iframe.
    // React ne suit jamais ce nœud → aucun conflit removeChild au changement de vidéo.
    const host = document.createElement("div");
    container.replaceChildren(host);

    void ensureYouTubeIframeApi().then(() => {
      if (cancelled || !window.YT?.Player) return;

      const playerVars: Record<string, number | string> = {
        autoplay: 1,
        mute: 1,
        rel: 0,
        modestbranding: 1,
        playsinline: 1,
      };
      if (startSeconds > 0) playerVars.start = startSeconds;

      player = new window.YT.Player(host, {
        videoId: youtubeId,
        playerVars,
        events: {
          onReady: (event) => {
            event.target.setVolume(CV_VIDEO_VOLUME);
            event.target.unMute();
            if (startSeconds > 0) {
              event.target.seekTo(startSeconds, true);
            }
            event.target.playVideo();
          },
        },
      });
    });

    return () => {
      cancelled = true;
      try {
        player?.destroy();
      } catch {
        /* destroy peut échouer si l'iframe a déjà disparu : sans gravité */
      }
      // Retire tout résidu (hôte ou iframe) laissé par YouTube.
      container.replaceChildren();
    };
  }, [videoKey, entry, hasVideo, youtubeId, startSeconds]);

  return (
    <div
      className={`cv-video-player${videoKey ? " cv-video-player--active" : ""}`}
      aria-live="polite"
      aria-label={entry ? `Vidéo : ${entry.title}` : "Lecteur vidéo expérience"}
    >
      {videoKey && entry ? (
        <>
          <p className="cv-video-player-label">{entry.title}</p>
          <div className="cv-video-player-frame">
            {hasVideo ? (
              <div ref={containerRef} className="cv-video-player-embed" />
            ) : (
              <div className="cv-video-player-placeholder">
                <span className="cv-video-player-placeholder-icon" aria-hidden>
                  ▶
                </span>
                <p>Vidéo à configurer</p>
                <p className="cv-video-player-placeholder-hint">
                  Ajoute l&apos;ID YouTube dans <code>src/data/cv.ts</code>
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="cv-video-player-idle">
          <p>Survole une expérience ou une formation</p>
          <p className="cv-video-player-idle-hint">
            I2A · France Travail · Simpliciti · BTS SIO B · BAC STI2D
          </p>
        </div>
      )}
    </div>
  );
}
