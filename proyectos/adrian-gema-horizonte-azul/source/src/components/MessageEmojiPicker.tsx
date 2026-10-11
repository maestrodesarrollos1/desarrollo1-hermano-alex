import EmojiPicker from "emoji-picker-react";
import spanish from "emoji-picker-react/data/emojis-es";

export default function MessageEmojiPicker({ onSelect }: { onSelect: (emoji: string) => void }) {
  return <EmojiPicker
    emojiData={spanish}
    emojiStyle="native"
    theme="light"
    width="100%"
    height="min(410px, 55dvh)"
    autoFocusSearch={false}
    previewConfig={{ showPreview: false }}
    onEmojiClick={data => onSelect(data.emoji)}
    labels={{
      searchPlaceholder: "Buscar emoji",
      searchLabel: "Buscar emoji",
      searchClear: "Borrar búsqueda",
      searchResultsNone: "No hay emojis para esa búsqueda",
      searchResultsOne: "Un emoji encontrado",
      searchResultsMany: "%n emojis encontrados",
      categoryNavigation: "Categorías de emojis",
      loading: "Cargando emojis…",
      loadingError: "No se han podido cargar los emojis",
      retryLoading: "Reintentar",
      skinToneNeutral: "Tono neutro",
      skinToneLight: "Tono claro",
      skinToneMediumLight: "Tono medio claro",
      skinToneMedium: "Tono medio",
      skinToneMediumDark: "Tono medio oscuro",
      skinToneDark: "Tono oscuro",
    }}
  />;
}
