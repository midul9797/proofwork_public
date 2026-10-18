import { ImageResponse } from "next/og";

export const alt = "Proofwork — See how candidates solve real work with AI.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "60px 72px", background: "#e5e1d8", color: "#2a1d17", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 30, fontWeight: 600 }}>
        <div style={{ width: 36, height: 36, borderRadius: 5, background: "#456f3a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 25 }}>P</div>
        Proofwork
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: 76, fontWeight: 600, lineHeight: 1.05, letterSpacing: -4, maxWidth: 1000 }}>See how candidates solve real work with AI.</div>
        <div style={{ display: "flex", fontSize: 25, maxWidth: 850, lineHeight: 1.45 }}>Hands-on assessments. Thoughtful decisions. Evidence you can review.</div>
      </div>
      <div style={{ display: "flex", gap: 28, fontSize: 19, color: "#456f3a" }}>
        <span>Problem framing</span><span>AI collaboration</span><span>Verification</span><span>Domain judgment</span><span>Outcome</span>
      </div>
    </div>,
    size,
  );
}
