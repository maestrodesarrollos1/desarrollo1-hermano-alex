export type TemplateArchiveItem = {
  id: string;
  number: string;
  title: string;
  direction: string;
  note: string;
  image: string;
  alt: string;
  previewUrl: string;
  tone: "light" | "dark" | "rose" | "spring";
  editions: readonly string[];
};

export const archiveModels = [
  {
    id: "esencia",
    name: "Esencia",
    price: "Desde 190 EUR",
    description: "Historia, cuenta atras, agenda y preguntas: todo lo esencial, sin formularios ni extras interactivos.",
  },
  {
    id: "historia",
    name: "Historia",
    price: "Desde 290 EUR",
    description: "Suma relato, galeria, cuenta atras, dudas y confirmacion de asistencia.",
  },
  {
    id: "firma",
    name: "Firma",
    price: "Desde 490 EUR",
    description: "La experiencia completa, con apertura, album, mensajes y direccion ampliada.",
  },
] as const;

// This is an internal archive of the working templates, not the public pricing collection.
export const templateArchive: TemplateArchiveItem[] = [
  {
    id: "horizonte-azul",
    number: "01",
    title: "Horizonte Azul",
    direction: "ACUARELA / MEDITERRANEA",
    note: "Luz de finca, papel lavado y una entrada tranquila.",
    image: "/images/catalog/horizonte-azul.png",
    alt: "Ilustracion en acuarela de una finca entre vegetacion",
    previewUrl: "http://127.0.0.1:8080/es",
    tone: "light",
    editions: ["Esencia", "Historia", "Firma"],
  },
  {
    id: "adrian-gema",
    number: "02",
    title: "Adrian & Gema",
    direction: "PRIMAVERA / EXPERIENCIA COMPLETA",
    note: "Un caso real con itinerario, album, RSVP y detalles de celebracion.",
    image: "/images/nupia-hero-manor-1600.webp",
    alt: "Finca iluminada entre arboles",
    previewUrl: "http://127.0.0.1:8081/es",
    tone: "spring",
    editions: ["Esencia", "Historia", "Firma"],
  },
  {
    id: "primos-carles",
    number: "03",
    title: "Casa Carles",
    direction: "CLASICA / CERCANA",
    note: "Una lectura limpia para una celebracion familiar y luminosa.",
    image: "/images/nupia-envelope-closed-1600.webp",
    alt: "Invitacion Nupia en formato de sobre editorial",
    previewUrl: "http://127.0.0.1:8082/es",
    tone: "light",
    editions: ["Esencia", "Historia", "Firma"],
  },
  {
    id: "anillo-verde",
    number: "04",
    title: "Anillo Verde",
    direction: "BOTANICA / JOYERO",
    note: "Un estuche de joya para abrir la celebracion con pausa.",
    image: "/images/jewel-case-editorial-1600.webp",
    alt: "Estuche verde con lazo y flor blanca",
    previewUrl: "http://127.0.0.1:8083/es",
    tone: "dark",
    editions: ["Esencia", "Historia", "Firma"],
  },
  {
    id: "puertas-rosa",
    number: "05",
    title: "Puertas Rosa",
    direction: "ROMANTICA / FLORAL",
    note: "La invitacion aparece al otro lado de unas puertas en flor.",
    image: "/images/rose-double-doors-1600.webp",
    alt: "Puertas rosadas abiertas entre flores",
    previewUrl: "http://127.0.0.1:8092/es",
    tone: "rose",
    editions: ["Esencia", "Historia", "Firma"],
  },
  {
    id: "atlas-nocturno",
    number: "06",
    title: "Atlas Nocturno",
    direction: "NOCHE / ESCENOGRAFICA",
    note: "Una celebracion de noche, con contraste y un ritmo mas teatral.",
    image: "/images/dinner-editorial-demo.webp",
    alt: "Mesa de celebracion editorial iluminada de noche",
    previewUrl: "http://127.0.0.1:8086/es",
    tone: "dark",
    editions: ["Esencia", "Historia", "Firma"],
  },
  {
    id: "nocturna-tinta",
    number: "07",
    title: "Nocturna Tinta",
    direction: "OSCURO / RITUAL",
    note: "Una direccion intensa para bodas que no buscan parecerse a ninguna otra.",
    image: "/images/catalog/nocturna-tinta.png",
    alt: "Luna dorada sobre un fondo oscuro y lacado",
    previewUrl: "http://127.0.0.1:8087/es",
    tone: "dark",
    editions: ["Esencia", "Historia", "Firma"],
  },
  {
    id: "hanami-pop",
    number: "08",
    title: "Hanami Pop",
    direction: "FESTIVAL / ILUSTRADA",
    note: "Color, referencias y una energia mas personal para una boda sin protocolo.",
    image: "/images/catalog/hanami-pop.png",
    alt: "Ilustracion nocturna de un festival entre cerezos",
    previewUrl: "http://127.0.0.1:8088/es",
    tone: "rose",
    editions: ["Esencia", "Historia", "Firma"],
  },
];
