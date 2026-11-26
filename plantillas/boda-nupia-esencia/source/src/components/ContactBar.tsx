import { Mail, MapPin } from "lucide-react";
import { weddingData } from "@/data/weddingData";

const ContactBar = () => {
  return (
    <div className="fixed left-0 right-0 top-0 z-[60]">
      <div className="border-b border-[#EAF6EC] bg-[rgba(248,252,249,0.94)] backdrop-blur-md">
        <div className="mx-auto flex h-7 max-w-[1500px] items-center justify-center gap-4 px-4 text-[11px] uppercase tracking-[0.25em] text-[#1F5E46] md:gap-8 md:px-6 lg:px-10">
          <span data-editor-key="event.dateLabel">{weddingData.event.dateLabel}</span>
          <span className="hidden md:inline">·</span>
          <span className="hidden items-center gap-2 md:inline-flex">
            <MapPin className="h-3 w-3" />
            <span data-editor-key="event.city">{weddingData.event.city}</span>
          </span>
          <span className="hidden md:inline">·</span>
          <a href={`mailto:${weddingData.contact.email}`} className="hidden items-center gap-2 md:inline-flex">
            <Mail className="h-3 w-3" />
            <span data-editor-key="contact.email">{weddingData.contact.email}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactBar;
