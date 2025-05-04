"use client";

import { useState, useEffect } from "react";

const getIsMobile = () =>
  typeof window !== "undefined" && window.innerWidth <= 1024;

export default function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false); // Default to `false` for SSR safety.

  useEffect(() => {
    // Update the state only when the component is mounted on the client side.
    const onResize = () => {
      setIsMobile(getIsMobile());
    };

    // Set initial value after mount.
    onResize();

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return isMobile;
}