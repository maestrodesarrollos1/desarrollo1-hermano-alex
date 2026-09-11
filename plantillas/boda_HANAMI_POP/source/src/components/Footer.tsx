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
    </footer>
  );
};

export default Footer;
