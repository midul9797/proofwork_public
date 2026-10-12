import { ImageResponse } from "next/og";

export const alt = "Proofwork: see how candidates work with AI, not just what they ship.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#111418",
          color: "#f3f5f2",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 32, fontWeight: 600 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "#2d5be3", display: "flex" }} />
          Proofwork
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, maxWidth: 980 }}>
            See how candidates work with AI, not just what they ship.
          </div>
          <div style={{ display: "flex", gap: 16, fontSize: 26 }}>
            <div
              style={{
                display: "flex",
                padding: "10px 18px",
                borderRadius: 999,
                border: "2px solid #c97d1c",
                color: "#e0a04a",
              }}
            >
              Planted error in AI answer
            </div>
            <div
              style={{
                display: "flex",
                padding: "10px 18px",
                borderRadius: 999,
                background: "#19a28b",
                color: "#0b1d19",
                fontWeight: 600,
              }}
            >
              Caught
            </div>
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#8e968f" }}>
          Interview tasks for every role  ·  AI allowed  ·  Full replay
        </div>
      </div>
    ),
    size,
  );
}
