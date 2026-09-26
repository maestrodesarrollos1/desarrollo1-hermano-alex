import { templateValues } from '@/config/template-values';

export type AlbumPhoto = { id: string; src: string; caption: string; date: string; alt: string };

export function getAlbumPhotos(): AlbumPhoto[] {
  const images: Record<string, string> = templateValues.images;
  const settings: Record<string, string> = templateValues.album;
  const available = Object.keys(images)
    .filter(id => /^galeria\d+$/.test(id) && images[id])
    .sort((left, right) => Number(left.slice(7)) - Number(right.slice(7)));
  // Unknown/repeated IDs are ignored; any numbered photo not named in the
  // requested order stays in its chronological position at the end.
  const requested = settings.order.split(/[,\s]+/).filter(id => available.includes(id));
  return [...new Set([...requested, ...available])].map(id => {
    const number = id.replace('galeria', '');
    const caption = settings[`caption${number}`] || '';
    const names = `${templateValues.couple.partner1} y ${templateValues.couple.partner2}`;
    return { id, src: images[id], caption, date: settings[`date${number}`] || '', alt: caption ? `${caption}. Álbum de ${names}.` : `Fotografía ${number} del álbum de ${names}.` };
  });
}
