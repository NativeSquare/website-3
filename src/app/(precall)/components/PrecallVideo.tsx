"use client";

import { useEffect, useRef } from "react";
import posthog from "posthog-js";

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "wistia-player": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & { "media-id"?: string; aspect?: string };
    }
  }
}

/* Lecteur Wistia (composant web « Aurora »), charge sans dependance npm.
   Embed officiel : https://docs.wistia.com/docs/player-quick-start
   Evenements : https://docs.wistia.com/docs/player-events

   On mesure deux choses dans PostHog : le prospect a lance la video, et il
   l'a regardee jusqu'au bout. C'est ce qui dit s'il arrive a l'appel rechauffe. */
export default function PrecallVideo({ mediaId }: { mediaId: string }) {
  const playerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!mediaId) return;

    const ajouterScript = (src: string, module: boolean) => {
      if (document.querySelector(`script[src="${src}"]`)) return;
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      if (module) script.type = "module";
      document.head.appendChild(script);
    };
    ajouterScript(`https://fast.wistia.com/embed/${mediaId}.js`, true);
    ajouterScript("https://fast.wistia.com/player.js", false);

    const player = playerRef.current;
    if (!player) return;

    /* « play » repart a chaque reprise apres une pause : on ne compte que la
       premiere lecture. */
    let lancee = false;
    const onPlay = () => {
      if (lancee) return;
      lancee = true;
      posthog.capture("precall_video_lecture");
    };
    const onEnded = () => posthog.capture("precall_video_fin");

    player.addEventListener("play", onPlay);
    player.addEventListener("ended", onEnded);
    return () => {
      player.removeEventListener("play", onPlay);
      player.removeEventListener("ended", onEnded);
    };
  }, [mediaId]);

  if (!mediaId) {
    return (
      <div className="bc-video-empty">
        <span>The video will be here shortly.</span>
      </div>
    );
  }

  return (
    <>
      {/* Apercu flou fourni par Wistia tant que le lecteur n'est pas charge. */}
      <style>{`wistia-player[media-id='${mediaId}']:not(:defined){background:center / contain no-repeat url('https://fast.wistia.com/embed/medias/${mediaId}/swatch');display:block;filter:blur(5px);padding-top:56.25%}`}</style>
      <wistia-player ref={playerRef} media-id={mediaId} aspect="1.7777777777777777" />
    </>
  );
}
