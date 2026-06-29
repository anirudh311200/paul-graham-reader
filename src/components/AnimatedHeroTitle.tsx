"use client";

import { useEffect, useState } from "react";

export function AnimatedHeroTitle() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const start = () => setReady(true);

    const logoFace = "400 1em var(--font-pinyon), cursive";
    if (document.fonts?.load) {
      void Promise.all([
        document.fonts.ready,
        document.fonts.load(logoFace).catch(() => undefined),
      ]).then(start);
    } else {
      start();
    }
  }, []);

  return (
    <div
      className={`hero-title-wrap${ready ? " hero-title-wrap--ready" : ""}`}
    >
      <h1 className="hero-title font-logo text-4xl text-foreground sm:text-6xl md:text-7xl">
        Paul Graham
        <br className="sm:hidden" aria-hidden="true" />
        {" Essays"}
      </h1>
      <span className="hero-title-curtain" aria-hidden="true" />
    </div>
  );
}
