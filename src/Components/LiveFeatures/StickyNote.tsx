"use client";

import { motion } from "framer-motion";
import * as React from "react";

const COLOR_THEMES = {
  yellow: {
    paperTop: "#FFF1A3",
    paperMiddle: "#FFF6BF",
    paperBottom: "#FFF0A0",
    curlLight: "#FFF8C8",
    curlDark: "#F4D968",
  },
  pink: {
    paperTop: "#FFD6E7",
    paperMiddle: "#FFE5F0",
    paperBottom: "#FFC6DD",
    curlLight: "#FFEAF3",
    curlDark: "#F3A2C3",
  },
  blue: {
    paperTop: "#BFE3FF",
    paperMiddle: "#D8F0FF",
    paperBottom: "#AAD9FA",
    curlLight: "#E7F6FF",
    curlDark: "#79BDEB",
  },
  green: {
    paperTop: "#CFF6B8",
    paperMiddle: "#E1FBCF",
    paperBottom: "#B9EFA1",
    curlLight: "#ECFFE1",
    curlDark: "#8ED26F",
  },
  orange: {
    paperTop: "#FFD39B",
    paperMiddle: "#FFE2BA",
    paperBottom: "#FFC478",
    curlLight: "#FFEBD1",
    curlDark: "#E8A34F",
  },
};

const paperRestPath = "M20 18 L380 18 L380 498 C260 506 140 510 20 502 Z";
const paperHoverPath = "M20 18 L380 18 L380 462 C342 482 270 498 20 502 Z";
const curlRestPath = "M317 496 C335 466 362 438.5 380 434.5 L380 492 C357 494.5 338.5 495 317 496 Z";
const curlHoverPath = "M304 482 C328 424 360 400.5 380 394.5 L380 459 C356 470.5 329.5 477 304 482 Z";

type StickyNoteProps = {
  text?: string;
  theme?: "yellow" | "pink" | "blue" | "green" | "orange";
  textColor?: string;
  textAlign?: "left" | "center" | "right";
  verticalAlign?: "flex-start" | "center" | "flex-end";
  font?: React.CSSProperties;
  style?: React.CSSProperties;
};

export default function StickyNote({
  text = "Sticky note\n\nPick a color\nCustomize type\nHover to curl",
  theme = "yellow",
  textColor = "#050505",
  textAlign = "left",
  verticalAlign = "flex-start",
  font,
  style,
}: StickyNoteProps) {
  const colors = COLOR_THEMES[theme] ?? COLOR_THEMES.yellow;
  const paperId = React.useId();
  const curlId = React.useId();

  return (
    <motion.div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "visible",
        perspective: 900,
        ...style,
      }}
    >
      <motion.div
        initial={{ rotate: -1.5, y: 0 }}
        whileHover={{ rotate: 1, y: -8 }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        <motion.div
          initial={{ opacity: 0.22, x: 8, y: 0, scaleX: 0.82, scaleY: 0.55 }}
          whileHover={{ opacity: 0.34, x: 18, scaleX: 1, scaleY: 0.68 }}
          transition={{ type: "spring", stiffness: 180, damping: 18 }}
          style={{
            position: "absolute",
            right: "8%",
            bottom: "-4%",
            width: "58%",
            height: "11%",
            borderRadius: "50%",
            background: "rgba(0,0,0,0.32)",
            filter: "blur(14px)",
            zIndex: 0,
            pointerEvents: "none",
            willChange: "transform, opacity",
          }}
        />

        <svg
          width="100%"
          height="100%"
          viewBox="0 0 400 520"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            inset: 0,
            overflow: "visible",
            zIndex: 1,
            filter: "drop-shadow(0px 6px 6px rgba(0,0,0,0.08)) drop-shadow(0px 14px 14px rgba(0,0,0,0.08))",
          }}
        >
          <defs>
            <linearGradient id={paperId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.paperTop} />
              <stop offset="18%" stopColor={colors.paperMiddle} />
              <stop offset="100%" stopColor={colors.paperBottom} />
            </linearGradient>
            <linearGradient id={curlId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={colors.curlLight} />
              <stop offset="100%" stopColor={colors.curlDark} />
            </linearGradient>
          </defs>

          <motion.path
            d={paperRestPath}
            fill={`url(#${paperId})`}
            initial={{ d: paperRestPath }}
            whileHover={{ d: paperHoverPath }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
          <motion.path
            d={curlRestPath}
            fill={`url(#${curlId})`}
            opacity={0.3}
            initial={{ d: curlRestPath, opacity: 0.3 }}
            whileHover={{ d: curlHoverPath, opacity: 0.55 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </svg>

        <div
          style={{
            position: "relative",
            zIndex: 2,
            padding: 36,
            color: textColor,
            textAlign,
            width: "100%",
            height: "100%",
            boxSizing: "border-box",
            pointerEvents: "none",
            whiteSpace: "pre-wrap",
            display: "flex",
            flexDirection: "column",
            justifyContent: verticalAlign,
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            ...font,
          }}
        >
          {text}
        </div>
      </motion.div>
    </motion.div>
  );
}
