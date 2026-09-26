import { useEffect, useRef, useState } from "react";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import EnvelopeIntro from "@/components/EnvelopeIntro";
import Navbar from "@/components/Navbar";
import WeddingDetails from "@/components/WeddingDetails";
import InstalledComponents from "@/components/InstalledComponents";
import { templateValues } from "@/config/template-values";

export default function Index() {
  const [entered, setEntered] = useState(() => !templateValues.sections.intro || sessionStorage.getItem("adrian-gema-invitation-entered") === "1");
  const mainRef = useRef<HTMLElement>(null);
  useEffect(() => {
    document.body.style.overflow = entered ? "" : "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [entered]);
  useEffect(() => {
    if (entered) mainRef.current?.focus({ preventScroll: true });
  }, [entered]);
  useEffect(() => {
    if (!entered || !window.location.hash) return;
    const frame = requestAnimationFrame(() => document.getElementById(decodeURIComponent(window.location.hash.slice(1)))?.scrollIntoView());
    return () => cancelAnimationFrame(frame);
  }, [entered]);
  return <div className="azure-wedding">
    {entered ? <>
      <a className="az-skip" href="#contenido">Saltar al contenido</a>
      <Navbar />
      <main id="contenido" ref={mainRef} tabIndex={-1}>
        <Hero />
        <InstalledComponents slot="after-hero" />
        <WeddingDetails />
        <InstalledComponents slot="after-rsvp" />
      </main>
      <Footer />
    </> : <EnvelopeIntro onComplete={() => { sessionStorage.setItem("adrian-gema-invitation-entered", "1"); window.scrollTo(0, 0); setEntered(true); }} />}
  </div>;
}
