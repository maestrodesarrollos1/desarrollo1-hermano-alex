import { Plus, ArrowUpRight } from "lucide-react";

const questions = [
  ["¿Qué podemos personalizar?", "Vuestros nombres, fotografías, textos, colores y los datos del día. Partimos de una dirección visual y ajustamos el contenido y las secciones a vuestra boda. Si imagináis una interacción especial, contádnosla para valorar cómo hacerla."],
  ["¿Qué necesitamos tener preparado?", "Lo esencial: vuestros nombres, una fecha aproximada y alguna idea del estilo. Después reunimos fotos, historia, lugares y horarios en un único documento. Podéis escribirnos aunque todavía no tengáis todos los detalles cerrados."],
  ["¿Cómo reciben la web nuestros invitados?", "Mediante un enlace que podéis compartir por WhatsApp, correo o el canal que prefiráis. La web se adapta al móvil, la tablet y el ordenador; los invitados no necesitan instalar una aplicación."],
  ["¿Pueden confirmar asistencia?", "Las plantillas permiten enlazar un formulario de confirmación. Definimos con vosotros qué necesitáis recoger y configuramos el enlace al formulario elegido. Los campos y la gestión de respuestas dependen de ese formulario."],
  ["¿Podremos cambiar un horario o añadir información?", "Sí, los textos, fotografías y datos de la boda son editables. Concretaremos cómo se harán las actualizaciones y cuáles estarán incluidas antes de empezar."],
  ["¿Cuánto cuesta y cuánto se tarda?", "Depende del diseño, del contenido y de las adaptaciones que necesitéis. Contadnos la fecha y lo que tenéis en mente para que podamos concretar el alcance, el presupuesto y el plazo antes de empezar."],
];

const Questions = () => (
  <section id="dudas" className="questions brand-shell" aria-labelledby="questions-title">
    <div className="questions__intro">
      <p className="brand-index">04 / CON LAS COSAS CLARAS</p>
      <h2 id="questions-title">Antes de<br /><em>dar el paso.</em></h2>
      <p>Las primeras preguntas también merecen una respuesta cuidada.</p>
      <a className="text-link" href="#contacto">Hablemos de vuestra idea <ArrowUpRight aria-hidden="true" /></a>
    </div>
    <div className="questions__list">{questions.map(([question, answer], index) => (
      <details key={question} name="nupia-questions">
        <summary><span className="question-number">0{index + 1}</span><span>{question}</span><Plus aria-hidden="true" /></summary>
        <p>{answer}</p>
      </details>
    ))}</div>
  </section>
);
export default Questions;
