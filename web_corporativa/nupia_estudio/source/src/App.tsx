import { useState } from "react";
import BrandNav from "./components/BrandNav";
import BrandHero from "./components/BrandHero";
import FeaturedExperience from "./components/FeaturedExperience";
import InvitationMoment from "./components/InvitationMoment";
import Collection from "./components/Collection";
import ContactMoment from "./components/ContactMoment";
import BrandClosing from "./components/BrandClosing";
import Questions from "./components/Questions";
import TemplateArchive from "./components/TemplateArchive";

const App = () => {
  const [selectedDesign, setSelectedDesign] = useState("");

  if (window.location.pathname.replace(/\/+$/, "") === "/plantillas") {
    return <TemplateArchive />;
  }

  return (
  <>
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <BrandNav />
    <main id="contenido">
      <BrandHero />
      <FeaturedExperience />
      <Collection onChoose={setSelectedDesign} />
      <InvitationMoment />
      <Questions />
      <ContactMoment selectedDesign={selectedDesign} onDesignChange={setSelectedDesign} />
    </main>
    <BrandClosing />
  </>
  );
};

export default App;
