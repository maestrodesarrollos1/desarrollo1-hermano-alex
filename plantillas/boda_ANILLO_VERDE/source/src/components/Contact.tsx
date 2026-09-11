import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { weddingData } from "@/data/weddingData";
import { RSVP_FORM_URL } from "@/config/rsvp";
import { templateValues } from "@/config/template-values";

const Contact = () => {
  return (
    <section id="confirmar-asistencia" data-editor-component="rsvp" className="scroll-animate bg-[#F3EFE4] px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-7xl overflow-hidden border border-[#14382A]/18 bg-[#F7F1E5] lg:grid-cols-[1.05fr_.95fr]">
        <div className="relative p-8 md:p-14">
          <span className="absolute left-5 top-5 h-12 w-12 border-l border-t border-[#B58A3C]" aria-hidden="true" />
          <p data-editor-key="rsvp.noteTitle" className="font-nav text-[10px] font-medium uppercase tracking-[.34em] text-[#8D6D2D]">{templateValues.rsvp.noteTitle}</p>
          <h2 data-editor-key="rsvp.ctaTitle" className="mt-7 max-w-xl font-script text-6xl leading-[.8] text-[#14382A] md:text-8xl">{templateValues.rsvp.ctaTitle}</h2>
          <p data-editor-key="rsvp.ctaText" data-editor-multiline="true" className="mt-8 max-w-md text-sm leading-7 text-[#14382A]/72">{templateValues.rsvp.ctaText}</p>
          <a href={RSVP_FORM_URL} className="group mt-11 inline-flex items-center gap-3 border-b border-[#14382A] pb-3 font-nav text-[10px] font-medium uppercase tracking-[.25em] text-[#14382A] transition-colors hover:border-[#B58A3C] hover:text-[#8D6D2D]">
            Confirmar asistencia
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
          </a>
        </div>

        <div className="relative bg-[#123C2D] p-8 text-[#F7F1E5] md:p-14">
          <div className="absolute inset-5 border border-[#F7F1E5]/18" aria-hidden="true" />
          <div className="relative flex h-full flex-col justify-between gap-14">
            <p data-editor-key="rsvp.noteText" data-editor-multiline="true" className="max-w-sm text-sm leading-7 text-[#F7F1E5]/72">{templateValues.rsvp.noteText}</p>
            <div className="space-y-5 border-t border-[#F7F1E5]/20 pt-6">
              <a href={`mailto:${weddingData.contact.email}`} className="flex items-center gap-4 text-sm transition-colors hover:text-[#D9B76F]">
                <Mail className="h-4 w-4 text-[#D9B76F]" aria-hidden="true" />
                <span data-editor-key="contact.email" className="break-all">{weddingData.contact.email}</span>
              </a>
              <a href={`tel:${weddingData.contact.phone.replace(/\s/g, "")}`} className="flex items-center gap-4 text-sm transition-colors hover:text-[#D9B76F]">
                <Phone className="h-4 w-4 text-[#D9B76F]" aria-hidden="true" />
                <span data-editor-key="contact.phone">{weddingData.contact.phone}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
