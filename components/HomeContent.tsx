"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Load Tailwind only when this client component mounts (after first paint)
import "../app/globals.css";

const ProjectSetupForm = dynamic(
  () => import("@/components/ProjectSetupForm").then((m) => m.ProjectSetupForm),
  {
    ssr: false,
    loading: () => (
      <div style={{ padding: "2rem", textAlign: "center", color: "#64748b", fontSize: 14 }}>
        Loading form…
      </div>
    )
  }
);

export function HomeContent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          color: "#64748b",
          fontSize: 14,
          border: "1px solid #e2e8f0",
          borderRadius: 12,
          backgroundColor: "#fff"
        }}
      >
        Loading…
      </div>
    );
  }

  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        backgroundColor: "#fff",
        overflow: "hidden"
      }}
    >
      <ProjectSetupForm />
    </div>
  );
}
