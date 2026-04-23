"use client";

import dynamic from "next/dynamic";

const StormMapClient = dynamic(() => import("@/components/map/storm-map-client"), {
  ssr: false,
});

export default function StormMapShell() {
  return <StormMapClient />;
}
