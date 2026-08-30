"use client";

import { useEffect, useRef } from "react";

/* The reference grid.mp4 behind the hero text. The <source> is attached only
   when (min-width:1024px) matches and reduced motion is off — same gate as the
   mockup — so phones never download the video and the static hero background
   remains the universal fallback. */
export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || video.querySelector("source")) return;
    if (
      !matchMedia("(min-width:1024px)").matches ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const source = document.createElement("source");
    source.type = "video/mp4";
    source.src = "/videos/hero-grid.mp4";
    video.appendChild(source);
    video.load();
    video.play()?.catch(() => {});
  }, []);

  return (
    <video
      ref={videoRef}
      className="hero-video"
      muted
      autoPlay
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
