import { templateValues } from '@/config/template-values';

export type AlbumPhoto = { id: string; src: string; caption: string; date: string; alt: string };

export function getAlbumPhotos(): AlbumPhoto[] {
  const images: Record<string, string> = templateValues.images;
  const settings: Record<string, string> = templateValues.album;
  const available = Array.from({ length: 12 }, (_, i) => `galeria${i + 1}`).filter(id => images[id]);
  // Unknown/repeated IDs are ignored; omitted photos remain at the end of the notebook.
  const requested = settings.order.split(/[,\s]+/).filter(id => available.includes(id));
  return [...new Set([...requested, ...available])].map(id => {
    const number = id.replace('galeria', '');
    const caption = settings[`caption${number}`] || 'Un recuerdo juntos';
    return { id, src: images[id], caption, date: settings[`date${number}`] || '', alt: `${caption}. Álbum de ${templateValues.couple.partner1} y ${templateValues.couple.partner2}.` };
  });
}
