export default function RootLoading() {
  return (
    <div style={{ display: "flex", minHeight: "50vh", padding: "2rem", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            width: 32,
            height: 32,
            border: "3px solid #e2e8f0",
            borderTopColor: "#1b7985",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite"
          }}
        />
        <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>Loading…</p>
      </div>
    </div>
  );
}
