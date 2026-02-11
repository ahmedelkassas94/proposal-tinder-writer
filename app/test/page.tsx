export default function TestPage() {
  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui", color: "#0f172a" }}>
      <h1 style={{ fontSize: "1.25rem" }}>App is running</h1>
      <p style={{ color: "#64748b" }}>If you see this, the server responded. Go back to the home page.</p>
      <a href="/" style={{ color: "#1b7985", textDecoration: "underline" }}>← Home</a>
    </div>
  );
}
