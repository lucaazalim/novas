import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name} · ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "80px",
        background: `linear-gradient(135deg, ${siteConfig.brandColor} 0%, #061a66 100%)`,
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ fontSize: 160, fontWeight: 800, letterSpacing: -8, lineHeight: 1 }}>novas</div>
      <div style={{ marginTop: 24, fontSize: 44, opacity: 0.9 }}>{siteConfig.tagline}</div>
      <div style={{ marginTop: 48, fontSize: 28, opacity: 0.7 }}>{siteConfig.url.host}</div>
    </div>,
    size,
  );
}
