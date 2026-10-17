import { type RsvpDietary } from "@/lib/rsvp";

type Props = {
  label: string;
  id: string;
  value: RsvpDietary;
  onChange: (next: RsvpDietary) => void;
};

export default function RsvpDietaryFields({ label, id, value, onChange }: Props) {
  return <fieldset className="az-rsvp-dietary">
    <legend>Necesidades de menú · {label}</legend>
    <div className="az-rsvp-dietary-body">
      <p>Marca todas las opciones que correspondan. Si no hay ninguna, déjalas sin marcar.</p>
      <label className="az-rsvp-dietary-option"><input type="checkbox" checked={value.allergies} onChange={(event) => onChange({ ...value, allergies: event.target.checked, allergyDetails: event.target.checked ? value.allergyDetails : "" })}/> Alergias</label>
      {value.allergies && <label className="az-rsvp-dietary-detail" htmlFor={`${id}-allergies`}>¿A qué tienes alergia?<input id={`${id}-allergies`} type="text" maxLength={250} value={value.allergyDetails} onChange={(event) => onChange({ ...value, allergyDetails: event.target.value })} placeholder="Por ejemplo, frutos secos"/></label>}
      <label className="az-rsvp-dietary-option"><input type="checkbox" checked={value.intolerances} onChange={(event) => onChange({ ...value, intolerances: event.target.checked, intoleranceDetails: event.target.checked ? value.intoleranceDetails : "" })}/> Intolerancias</label>
      {value.intolerances && <label className="az-rsvp-dietary-detail" htmlFor={`${id}-intolerances`}>¿Qué intolerancias tienes?<input id={`${id}-intolerances`} type="text" maxLength={250} value={value.intoleranceDetails} onChange={(event) => onChange({ ...value, intoleranceDetails: event.target.value })} placeholder="Por ejemplo, lactosa"/></label>}
      <label className="az-rsvp-dietary-option"><input type="checkbox" checked={value.vegan} onChange={(event) => onChange({ ...value, vegan: event.target.checked })}/> Menú vegano</label>
      <label className="az-rsvp-dietary-option"><input type="checkbox" checked={value.pregnant} onChange={(event) => onChange({ ...value, pregnant: event.target.checked })}/> Embarazada</label>
    </div>
  </fieldset>;
}
