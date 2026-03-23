"use client";

import { useState } from "react";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

/*──────────────────────────────────────────────────────────────
  Our Work / Portfolio Section — Figma node 500:143

  ARCHITECTURE FOR ANIMATABLE GLOW
  ────────────────────────────────
  All light effects share ONE coordinate system centered on the
  card (0,0 = card top-left). Three rendering paths:

  1. PIXEL DOT LAYER — Fixed dual mask (pixel-texture ∩ radial fade)
     → glow-group inside with ellipse SVGs → illuminated dots

  2. CARD EDGE LAYER — Fixed card-shape mask (blurred rounded rect)
     → glow-group inside with ellipse SVGs → colored edge bleed

  3. BORDER GLOW + HIGHLIGHT — No mask, direct render
     → glow-group with border-glow SVGs + highlight

  ALL THREE share `.glow-group` class. Animating all `.glow-group`
  elements together keeps everything in sync while masks stay fixed.

  Below the glow layers:
  4. CARD BODY — static
  5. LOGO — static
──────────────────────────────────────────────────────────────*/

type Tab = "web" | "mobile" | "all";

const TABS: { label: string; value: Tab }[] = [
  { label: "Web", value: "web" },
  { label: "Mobile", value: "mobile" },
  { label: "All", value: "all" },
];

/*── Ellipse SVG glow images ─────────────────────────────────
  Exact positions from Figma node 505:262.
  Each has negative insets so the SVG's built-in feGaussianBlur
  extends beyond the container bounds.

  `layers`: which rendering layers this ellipse appears in.
    "dots" = pixel dot layer (Colored Part 1)
    "edge" = card edge layer (Colored Part 2)
────────────────────────────────────────────────────────────*/
const ELLIPSES = [
  // Layer 1 — tight hot spots (card edge only)
  { id: "white-l1", svg: "/portfolio/glows/ellipse-white-l1.svg", left: 894, top: -116, w: 259, h: 260, insetTB: 24.23, insetLR: 24.32, layers: ["edge"] as const },
  { id: "cyan-l1", svg: "/portfolio/glows/ellipse-cyan-l1.svg", left: -74, top: 430, w: 159, h: 157, insetTB: 22.93, insetLR: 22.64, layers: ["edge"] as const },
  // Layer 3 — wide colored glows (both layers)
  { id: "gold-l3", svg: "/portfolio/glows/ellipse-gold-l3.svg", left: 465, top: -96, w: 764, h: 403, insetTB: 92.18, insetLR: 48.63, layers: ["dots", "edge"] as const },
  { id: "cyan-l3", svg: "/portfolio/glows/ellipse-cyan-l3.svg", left: -247, top: 182, w: 839, h: 462, insetTB: 10.69, insetLR: 5.89, layers: ["dots", "edge"] as const },
  // Layer 4 — more colored glows (both layers)
  { id: "gold-l4", svg: "/portfolio/glows/ellipse-gold-l4.svg", left: 572, top: -74, w: 695, h: 252, insetTB: 137.46, insetLR: 49.84, layers: ["dots", "edge"] as const },
  { id: "cyan-l4a", svg: "/portfolio/glows/ellipse-cyan-l4a.svg", left: -304, top: 296, w: 846, h: 295, insetTB: 16.75, insetLR: 5.84, layers: ["dots", "edge"] as const },
  { id: "cyan-l4b", svg: "/portfolio/glows/ellipse-cyan-l4b.svg", left: -253, top: 334, w: 577, h: 318, insetTB: 15.53, insetLR: 8.56, layers: ["dots", "edge"] as const },
];

/*── Border glow SVGs ──────────────────────────────────────────
  All 5 border glow layers from Figma, stacked bottom→top.
  Multiple white layers build up the incandescent border effect.
  Each SVG contains white/blue ellipses with feGaussianBlur.
────────────────────────────────────────────────────────────*/
const BORDER_GLOWS = [
  { svg: "/portfolio/glows/border-glow-4.svg", insetTB: 29.51, insetLR: 14.84 },
  { svg: "/portfolio/glows/border-glow-3.svg", insetTB: 2.03, insetLR: 1.02 },
  { svg: "/portfolio/glows/border-glow-2.svg", insetTB: 2.03, insetLR: 1.02 },
  { svg: "/portfolio/glows/border-glow-1.svg", insetTB: 1.24, insetLR: 0.62 },
  { svg: "/portfolio/glows/border-glow-0.svg", insetTB: 0, insetLR: 0 },
];

/* ── Card dimensions ── */
const CARD_W = 1046;
const CARD_H = 520;
/* Pixel-mask container extends this far beyond the card in all directions */
const PIX_PAD = 500;

/* ── Render a single ellipse SVG with its negative inset container ── */
function EllipseSVG({ e }: { e: (typeof ELLIPSES)[number] }) {
  return (
    <div
      className="absolute"
      style={{
        left: e.left,
        top: e.top,
        width: e.w,
        height: e.h,
      }}
    >
      <div
        className="absolute"
        style={{
          top: `${-e.insetTB}%`,
          right: `${-e.insetLR}%`,
          bottom: `${-e.insetTB}%`,
          left: `${-e.insetLR}%`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={e.svg}
          alt=""
          className="block w-full h-full"
          style={{ maxWidth: "none" }}
        />
      </div>
    </div>
  );
}

const OurWork: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("web");
  const { ref, isVisible } = useScrollAnimation(0.15);

  return (
    <section className="relative bg-[#07070a] overflow-x-clip overflow-y-visible">
      <div className="relative mx-auto max-w-[1216px] px-6 lg:px-8 pt-14 pb-48">

        {/* ═══════════════════════════════════════════════════════
            CONTENT HEADER
        ═══════════════════════════════════════════════════════ */}
        <div
          ref={ref}
          className={`relative z-10 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <h2
            className="text-[36px] leading-[40px] tracking-[-0.9px] font-normal"
            style={{ color: "#f5f5f5" }}
          >
            Explore Our Latest Work
          </h2>
          <p
            className="mt-2 max-w-[540px] text-[15.9px] leading-[22px] tracking-[-0.4px]"
            style={{ color: "#a3a3a3" }}
          >
            We understand the challenges developers face. We build products that
            streamline workflows, eliminate friction, and help you focus on
            making great products.
          </p>
          <div className="flex items-center gap-[25px] mt-7">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`text-[14px] leading-[20px] tracking-[-0.35px] transition-all duration-300 ${
                  activeTab === tab.value
                    ? "text-[#d4d4d4] underline underline-offset-4 decoration-[#d4d4d4]"
                    : "text-[#d4d4d4]/60 hover:text-[#d4d4d4]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            PORTFOLIO CARD CONTAINER
        ═══════════════════════════════════════════════════════ */}
        <div
          className={`relative mt-16 mx-auto transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ width: CARD_W, maxWidth: "100%", height: CARD_H }}
        >

          {/* ─────────────────────────────────────────────────────
              LAYER 1: PIXEL DOT TEXTURE
              Fixed dual mask: pixel-texture ∩ radial fade.
              Glow SVGs inside (.glow-group) produce illuminated dots.
          ───────────────────────────────────────────────────── */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: -PIX_PAD,
              top: -PIX_PAD,
              width: CARD_W + PIX_PAD * 2,
              height: CARD_H + PIX_PAD * 2,
              overflow: "visible",
              WebkitMaskImage:
                "url(/kpi/pixel-texture.png), radial-gradient(ellipse 55% 55% at 50% 45%, black 30%, transparent 100%)",
              maskImage:
                "url(/kpi/pixel-texture.png), radial-gradient(ellipse 55% 55% at 50% 45%, black 30%, transparent 100%)",
              WebkitMaskSize: "100px 100px, 100% 100%",
              maskSize: "100px 100px, 100% 100%" as string,
              WebkitMaskRepeat: "repeat, no-repeat",
              maskRepeat: "repeat, no-repeat" as string,
              WebkitMaskComposite: "source-in",
              maskComposite: "intersect" as string,
            }}
          >
            {/* .glow-group — will animate together later */}
            <div
              className="glow-group absolute"
              style={{
                left: PIX_PAD,
                top: PIX_PAD,
                width: CARD_W,
                height: CARD_H,
                overflow: "visible",
              }}
            >
              {ELLIPSES.filter((e) => e.layers.includes("dots")).map((e) => (
                <EllipseSVG key={`dot-${e.id}`} e={e} />
              ))}
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────
              LAYER 2A: CARD EDGE — Colored Part 1 (Figma 539:7461)
              Layers 3+4 only, tighter mask (43567).
          ───────────────────────────────────────────────────── */}
          <div
            className="absolute pointer-events-none mix-blend-hard-light"
            style={{
              left: -45,
              top: -45,
              width: 1136,
              height: 610,
              overflow: "visible",
              WebkitMaskImage: "url(/portfolio/glows/mask-ellipse-43567.svg)",
              maskImage: "url(/portfolio/glows/mask-ellipse-43567.svg)",
              WebkitMaskSize: "100% 100%",
              maskSize: "100% 100%" as string,
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat" as string,
            }}
          >
            <div
              className="glow-group absolute"
              style={{ top: 45, left: 45, width: CARD_W, height: CARD_H, overflow: "visible" }}
            >
              {ELLIPSES.filter((e) => e.layers.includes("dots")).map((e) => (
                <EllipseSVG key={`cp1-${e.id}`} e={e} />
              ))}
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────
              LAYER 2B: CARD EDGE — Colored Part 2 (Figma 539:7506)
              ALL ellipses including L1 hotspots, larger mask (43574).
          ───────────────────────────────────────────────────── */}
          <div
            className="absolute pointer-events-none mix-blend-hard-light"
            style={{
              left: -94,
              top: -95,
              width: 1235,
              height: 710,
              overflow: "visible",
              WebkitMaskImage: "url(/portfolio/glows/mask-ellipse-43574.svg)",
              maskImage: "url(/portfolio/glows/mask-ellipse-43574.svg)",
              WebkitMaskSize: "100% 100%",
              maskSize: "100% 100%" as string,
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat" as string,
            }}
          >
            <div
              className="glow-group absolute"
              style={{ top: 95, left: 94, width: CARD_W, height: CARD_H, overflow: "visible" }}
            >
              {ELLIPSES.filter((e) => e.layers.includes("edge")).map((e) => (
                <EllipseSVG key={`cp2-${e.id}`} e={e} />
              ))}
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────
              BORDER GLOWS — behind card body, only visible in 6px
              ring around card. SVGs have internal masks.
              .glow-group for animation sync.
          ───────────────────────────────────────────────────── */}
          <div
            className="glow-group absolute pointer-events-none"
            style={{
              left: 0,
              top: 0,
              width: CARD_W,
              height: CARD_H,
              overflow: "visible",
            }}
          >
            {/* Render border glows twice — stacking builds up white */}
            {[0, 1].map((pass) =>
              BORDER_GLOWS.map((bg, i) => (
                <div
                  key={`border-glow-${pass}-${i}`}
                  className="absolute"
                  style={{ left: -6, top: -6, width: 1058, height: 532 }}
                >
                  <div
                    className="absolute"
                    style={
                      bg.insetTB === 0 && bg.insetLR === 0
                        ? { inset: 0 }
                        : {
                            top: `${-bg.insetTB}%`,
                            right: `${-bg.insetLR}%`,
                            bottom: `${-bg.insetTB}%`,
                            left: `${-bg.insetLR}%`,
                          }
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={bg.svg}
                      alt=""
                      className="block w-full h-full"
                      style={{ maxWidth: "none" }}
                    />
                  </div>
                </div>
              ))
            )}

          </div>

          {/* ─────────────────────────────────────────────────────
              CARD BODY (static — does NOT rotate with glows)
              Covers center, leaving only border ring visible.
          ───────────────────────────────────────────────────── */}
          <div className="absolute inset-0 rounded-[48px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/portfolio/glows/card-bg.png"
              alt=""
              className="block w-full h-full object-cover"
              style={{ maxWidth: "none" }}
            />
          </div>
          <div className="absolute inset-0 rounded-[48px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/portfolio/glows/card-bg.png"
              alt=""
              className="block w-full h-full object-cover"
              style={{ maxWidth: "none", opacity: 0.5 }}
            />
          </div>

          {/* ─────────────────────────────────────────────────────
              BORDER HIGHLIGHT — on top of card body.
              mix-blend-overlay per Figma (node 539:7454).
              .glow-group for animation sync.
          ───────────────────────────────────────────────────── */}
          <div
            className="glow-group absolute pointer-events-none mix-blend-overlay"
            style={{
              left: -6,
              top: -6,
              width: 1058,
              height: 532,
              overflow: "visible",
            }}
          >
            {/* Two stacked highlight layers — builds up white intensity
                at hotspot positions via overlay blending */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/portfolio/glows/border-highlight.svg"
              alt=""
              className="absolute block w-full h-full"
              style={{ maxWidth: "none" }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/portfolio/glows/border-highlight.svg"
              alt=""
              className="absolute block w-full h-full"
              style={{ maxWidth: "none" }}
            />
          </div>

          {/* ─────────────────────────────────────────────────────
              HOTSPOT WHITE BOOST — extra white at hotspot positions
              using screen blend for maximum brightness.
              .glow-group for animation sync.
          ───────────────────────────────────────────────────── */}
          <div
            className="glow-group absolute pointer-events-none mix-blend-screen"
            style={{
              left: -6,
              top: -6,
              width: 1058,
              height: 532,
              overflow: "visible",
            }}
          >
            {/* Multiple stacked copies at hotspot positions — sharp + blurred */}
            {[0, 2, 5].map((blur) => (
              <div key={`bl-${blur}`} className="absolute inset-0" style={{ filter: blur ? `blur(${blur}px)` : undefined }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/portfolio/glows/border-highlight.svg"
                  alt=""
                  className="absolute block w-full h-full"
                  style={{
                    maxWidth: "none",
                    WebkitMaskImage:
                      "radial-gradient(ellipse 50% 70% at 5% 80%, black 0%, black 20%, transparent 70%)",
                    maskImage:
                      "radial-gradient(ellipse 50% 70% at 5% 80%, black 0%, black 20%, transparent 70%)",
                  }}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/portfolio/glows/border-highlight.svg"
                  alt=""
                  className="absolute block w-full h-full"
                  style={{
                    maxWidth: "none",
                    WebkitMaskImage:
                      "radial-gradient(ellipse 45% 55% at 95% 15%, black 0%, black 20%, transparent 70%)",
                    maskImage:
                      "radial-gradient(ellipse 45% 55% at 95% 15%, black 0%, black 20%, transparent 70%)",
                  }}
                />
              </div>
            ))}
          </div>

          {/* ─────────────────────────────────────────────────────
              LOGO (static)
          ───────────────────────────────────────────────────── */}
          <div className="absolute inset-0 rounded-[48px] overflow-hidden flex items-center justify-center">
            {activeTab !== "mobile" ? (
              <div
                className="mix-blend-screen"
                style={{
                  width: 255.4,
                  height: 126,
                  borderRadius: 6.811,
                  backgroundImage: "url(/portfolio/glows/logo-velum.png)",
                  backgroundSize: "cover",
                  backgroundPosition: "top left",
                }}
              />
            ) : (
              <span
                className="text-[48px] font-bold italic tracking-wide select-none font-serif"
                style={{
                  color: "rgba(255,255,255,0.5)",
                  textShadow: "0 2px 20px rgba(0,0,0,0.3)",
                }}
              >
                Dango
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurWork;
