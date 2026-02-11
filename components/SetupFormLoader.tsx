"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ProjectSetupForm = dynamic(
  () => import("@/components/ProjectSetupForm").then((m) => m.ProjectSetupForm),
  { ssr: false, loading: () => <p style={{ color: "#666", fontSize: 14 }}>Loading form…</p> }
);

export function SetupFormLoader() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <p style={{ color: "#666", fontSize: 14 }}>Loading form…</p>;
  }
  return <ProjectSetupForm />;
}
