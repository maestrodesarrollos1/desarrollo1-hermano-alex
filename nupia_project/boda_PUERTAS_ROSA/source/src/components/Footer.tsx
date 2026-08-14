import { weddingData } from "@/data/weddingData";

const Footer = () => {
  return (
    <footer
      data-editor-component="footer"
      className="border-t border-[#D9B76F]/55 bg-[#09150F] px-5 py-20 text-center text-[#F7F1E5]"
    >
      <p className="font-nav text-[10px] font-medium uppercase tracking-[.34em] text-[#D9B76F]">Con todo nuestro carino</p>
      <p className="mt-6 font-script text-5xl leading-none md:text-6xl">
        <span data-editor-key="couple.partner1">{weddingData.couple.partner1}</span>
        {" y "}
        <span data-editor-key="couple.partner2">{weddingData.couple.partner2}</span>
      </p>
      <p className="mt-6 font-nav text-[10px] uppercase tracking-[0.3em] text-[#F7F1E5]/62">
        <span data-editor-key="event.dateLabel">{weddingData.event.dateLabel}</span>
        {" - "}
        <span data-editor-key="event.city">{weddingData.event.city}</span>
      </p>
      <div className="mt-12 flex items-center justify-center gap-2 text-[#F7F1E5]/44">
        <img className="h-5 w-4 object-contain opacity-75" src="/images/nupia-mark.png" alt="" style={{ filter: "brightness(0) invert(1)" }} />
        <span className="font-nav text-[8px] uppercase tracking-[0.24em]">Nupia</span>
      </div>
    </footer>
  );
};

export default Footer;
