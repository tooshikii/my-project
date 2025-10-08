"use client";

import { useEffect } from "react";
import { initDatabase } from "@/lib/db/init";

export default function DatabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Initialize database when the component mounts
    initDatabase();
  }, []);

  return <>{children}</>;
}
