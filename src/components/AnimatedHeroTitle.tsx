"use client";

export function AnimatedHeroTitle() {
  return (
    <div className="hero-title-wrap">
      <h1 className="hero-title font-logo text-4xl text-foreground sm:text-6xl md:text-7xl">
        Paul Graham
        <br className="sm:hidden" aria-hidden="true" />
        {" Essays"}
      </h1>
      <span className="hero-title-curtain" aria-hidden="true" />
    </div>
  );
}
