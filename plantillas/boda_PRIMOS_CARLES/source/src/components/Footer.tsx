import { weddingData } from "@/data/weddingData";

const Footer = () => {
  return (
    <footer
      data-editor-component="footer"
      className="px-5 py-14 text-center text-white"
      style={{ backgroundColor: "var(--template-primary-dark)" }}
    >
      <p className="font-script text-4xl md:text-5xl">
        <span data-editor-key="couple.partner1">{weddingData.couple.partner1}</span>
        {" y "}
        <span data-editor-key="couple.partner2">{weddingData.couple.partner2}</span>
      </p>
      <p className="mt-5 text-xs uppercase tracking-[0.36em] text-white/70">
        <span data-editor-key="event.dateLabel">{weddingData.event.dateLabel}</span>
        {" - "}
        <span data-editor-key="event.city">{weddingData.event.city}</span>
      </p>
      <div className="mt-10 flex items-center justify-center gap-2 text-white/45">
        <img className="h-5 w-4 object-contain opacity-75" src="/images/nupia-mark.png" alt="" style={{ filter: "brightness(0) invert(1)" }} />
        <span className="text-[8px] uppercase tracking-[0.24em]">Nupia</span>
      </div>
    </footer>
  );
};

export default Footer;
