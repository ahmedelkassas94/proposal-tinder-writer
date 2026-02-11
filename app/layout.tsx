import type { ReactNode } from "react";

export const metadata = {
  title: "Proposal & Tinder Writer",
  description: "AI-assisted proposal and Tinder message drafting"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Proposal &amp; Tinder Writer</title>
      </head>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          backgroundColor: "#f0f4f8",
          color: "#1a1a1a",
          fontFamily: "system-ui, -apple-system, sans-serif"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <header style={{ padding: "16px 20px", borderBottom: "1px solid #ccc", backgroundColor: "#fff" }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#1a1a1a" }}>Proposal &amp; Tinder Writer</div>
            <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>Draft proposals with AI</div>
          </header>
          <main style={{ flex: 1, padding: "20px", overflow: "auto" }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

