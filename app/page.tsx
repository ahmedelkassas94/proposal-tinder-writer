import { SetupFormLoader } from "@/components/SetupFormLoader";

export default function HomePage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <p style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>Step 1 — Set up your project</p>
      <h1 style={{ fontSize: 20, fontWeight: 600, color: "#1a1a1a", margin: "0 0 8px 0" }}>
        Create a new proposal workspace
      </h1>
      <p style={{ fontSize: 14, color: "#666", marginBottom: 24 }}>
        Upload the call, template, and your notes. We&apos;ll infer sections and prepare an AI-assisted editor.
      </p>
      <div style={{ border: "1px solid #ddd", borderRadius: 8, backgroundColor: "#fff", padding: 20 }}>
        <SetupFormLoader />
      </div>
    </div>
  );
}
