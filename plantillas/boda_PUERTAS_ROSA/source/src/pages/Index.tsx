import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import EnvelopeIntro from "@/components/EnvelopeIntro";
import Navbar from "@/components/Navbar";
import WeddingDetails from "@/components/WeddingDetails";
import { useScrollAnimationMultiple } from "@/hooks/use-scroll-animation";
import { templateValues } from "@/config/template-values";
import InstalledComponents from "@/components/InstalledComponents";

const Index = () => {
  useScrollAnimationMultiple();
  const [hasEntered, setHasEntered] = useState(!templateValues.sections.intro);

  useEffect(() => {
    document.body.style.overflow = hasEntered ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [hasEntered]);

  const handleIntroComplete = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    setHasEntered(true);
  };

  return (
    <>
      {templateValues.sections.intro && !hasEntered ? (
        <EnvelopeIntro onComplete={handleIntroComplete} />
      ) : null}
      {hasEntered ? <Navbar /> : null}

      <div
        className={`transition-all duration-700 ${
          hasEntered ? "opacity-100 blur-0" : "pointer-events-none opacity-0 blur-sm"
        }`}
      >
        <main className="w-full pt-[var(--nav-height)]">
          <Hero />
          <InstalledComponents slot="after-hero" />
          <WeddingDetails />
          <InstalledComponents slot="before-rsvp" />
          <InstalledComponents slot="after-rsvp" />
          <Footer />
        </main>
      </div>
    </>
  );
};

export default Index;
