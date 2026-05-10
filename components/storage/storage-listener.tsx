"use client";

import { useEffect } from "react";

export default function StorageListener() {
  useEffect(() => {
    const handler = () => {
      window.dispatchEvent(new Event("stormtalk-storage-updated"));
    };

    window.addEventListener("storage", handler);

    return () => {
      window.removeEventListener("storage", handler);
    };
  }, []);

  return null;
}
