import { ImageResponse } from "next/og";

export const alt = "HPE Brazil — Business English para executivos e empresas";
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
          background: "linear-gradient(160deg, #142a5c 0%, #060d1f 100%)",
          color: "#ffffff",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="44" height="54" viewBox="0 0 340 420">
            <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="40">
              <path d="M32 390 L32 82 L86 130" stroke="#F7A21B" />
              <path d="M118 202 L308 20 L308 350 L258 295" stroke="#2EA44F" />
              <path d="M32 395 L238 218" stroke="#E5262A" />
            </g>
          </svg>
          <span style={{ fontSize: 44, color: "#ddb862", letterSpacing: 2 }}>HPE</span>
          <span style={{ fontSize: 20, color: "rgba(255,255,255,0.7)", letterSpacing: 4, fontFamily: "sans-serif" }}>
            HIGH PERFORMANCE ENGLISH
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 76, lineHeight: 1.05, maxWidth: 980 }}>
            O mundo dos negócios fala inglês.
          </div>
          <div style={{ fontSize: 76, lineHeight: 1.05, color: "#ddb862", fontStyle: "italic" }}>
            Lidere a conversa.
          </div>
        </div>
        <div style={{ fontSize: 24, color: "rgba(255,255,255,0.7)", fontFamily: "sans-serif" }}>
          Business English com Peter Focke · Executivos, empreendedores e empresas
        </div>
      </div>
    ),
    size
  );
}
