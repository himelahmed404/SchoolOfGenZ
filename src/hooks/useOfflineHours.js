"use client";

import { useEffect, useState } from "react";

export default function useOfflineHours() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    // Page is statically prerendered, so this must read the visitor's clock
    // after mount rather than baking a stale value into the build-time HTML.
    const h = new Date().getHours();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOffline(h < 10 || h >= 22);
  }, []);

  return offline;
}
