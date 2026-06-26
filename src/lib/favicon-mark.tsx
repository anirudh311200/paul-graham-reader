import { faviconColors } from "./favicon-font";

interface PgFaviconMarkProps {
  fontSize: number;
  borderRadius: number;
  borderWidth: number;
  shiftX?: number;
  paddingTop?: number;
}

export function PgFaviconMark({
  fontSize,
  borderRadius,
  borderWidth,
  shiftX = -2,
  paddingTop = 0,
}: PgFaviconMarkProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: faviconColors.background,
        borderRadius,
        border: `${borderWidth}px solid ${faviconColors.border}`,
        overflow: "hidden",
      }}
    >
      <span
        style={{
          display: "flex",
          color: faviconColors.foreground,
          fontFamily: "Pinyon Script",
          fontSize,
          lineHeight: 1,
          letterSpacing: -0.04 * fontSize,
          transform: `translateX(${shiftX}px)`,
          paddingTop,
          paddingRight: Math.max(1, fontSize * 0.06),
          paddingLeft: Math.max(1, fontSize * 0.02),
        }}
      >
        PG
      </span>
    </div>
  );
}
