import BrandNav from "./components/BrandNav";
import BrandHero from "./components/BrandHero";
import FeaturedExperience from "./components/FeaturedExperience";
import InvitationMoment from "./components/InvitationMoment";
import Collection from "./components/Collection";
import ContactMoment from "./components/ContactMoment";
import BrandClosing from "./components/BrandClosing";

const App = () => (
  <>
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <BrandNav />
    <main id="contenido">
      <BrandHero />
      <FeaturedExperience />
      <InvitationMoment />
      <Collection />
      <ContactMoment />
      <BrandClosing />
    </main>
  </>
);

export default App;
