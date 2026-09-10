import { templateValues as v } from '@/config/template-values';
export function downloadWeddingDate() {
  const stamp = (date: Date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const escape = (s: string) => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
  const content = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Nupia//Wedding//ES', 'BEGIN:VEVENT', 'UID:adrian-gema-20270327@nupia.local', `DTSTAMP:${stamp(new Date())}`, `DTSTART:${stamp(new Date(v.event.dateIso))}`, `SUMMARY:${escape(`Boda de ${v.couple.partner1} y ${v.couple.partner2}`)}`, `LOCATION:${escape(v.event.venue)}`, 'END:VEVENT', 'END:VCALENDAR', ''].join('\r\n');
  const url = URL.createObjectURL(new Blob([content], {type: 'text/calendar;charset=utf-8'}));
  const link = document.createElement('a');
  link.href = url; link.download = 'adrian-y-gema.ics'; link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
