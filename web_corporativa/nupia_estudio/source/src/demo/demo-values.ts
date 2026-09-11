const isGarden = new URLSearchParams(window.location.search).get("design") !== "flores";

export const demoDesign = isGarden ? "jardin" : "flores";
export const weddingData = {
  couple: {
    partner1: isGarden ? "Alma" : "Clara",
    partner2: isGarden ? "Hugo" : "Leo",
  },
  event: {
    dateLabel: "18 de junio de 2027",
    city: "Barcelona",
    venue: "Masía del Mar",
  },
};

export const templateValues = {
  hero: { eyebrow: isGarden ? "Una invitación para vosotros" : "Nuestra próxima historia" },
};
