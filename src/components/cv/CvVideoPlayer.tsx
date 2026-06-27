"use client";

import { CV_VIDEOS, type CvVideoKey } from "@/data/cv";

interface CvVideoPlayerProps {
  videoKey: CvVideoKey | null;
}

/**
 * Lecteur YouTube affiché à droite du CV.
 * Se lance au survol des mots-clés d'expérience (autoplay muet).
 */
export function CvVideoPlayer({ videoKey }: CvVideoPlayerProps) {
  const entry = videoKey ? CV_VIDEOS[videoKey] : null;
  const youtubeId = entry?.youtubeId?.trim() ?? "";
  const startSeconds = entry?.startSeconds ?? 0;
  const hasVideo = youtubeId.length > 0;

  const embedSrc = hasVideo
    ? `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&rel=0&modestbranding=1${
        startSeconds > 0 ? `&start=${startSeconds}` : ""
      }`
    : "";

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
              <iframe
                key={`${videoKey}-${youtubeId}-${startSeconds}`}
                title={entry.title}
                src={embedSrc}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
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
