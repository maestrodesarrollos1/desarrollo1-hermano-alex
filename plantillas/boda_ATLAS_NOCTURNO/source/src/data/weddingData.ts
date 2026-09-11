import { templateValues } from "@/config/template-values";

export const weddingData = {
  couple: {
    partner1: templateValues.couple.partner1,
    partner2: templateValues.couple.partner2,
    display: `${templateValues.couple.partner1} y ${templateValues.couple.partner2}`,
    short: `${templateValues.couple.partner1.charAt(0) || "N"} y ${templateValues.couple.partner2.charAt(0) || "N"}`,
  },
  event: {
    year: templateValues.event.dateIso.slice(0, 4),
    monthLabel: templateValues.event.dateLabel,
    dateIso: templateValues.event.dateIso,
    dateLabel: templateValues.event.dateLabel,
    city: templateValues.event.city,
    venue: templateValues.event.venue,
    mapUrl: "#",
    mapEmbedQuery: "",
    sender: "Plantilla de evento",
  },
  contact: {
    email: templateValues.contact.email,
    phone: templateValues.contact.phone,
  },
  gallery: [],
  approvedMessages: [],
} as const;
