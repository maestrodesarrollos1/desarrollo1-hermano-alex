import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { templateValues as v } from "@/config/template-values";

const organizer = `${v.couple.partner1} y ${v.couple.partner2}`;

export default function PrivacyPage() {
  return <div className="azure-wedding az-legal-page">
    <a className="az-skip" href="#contenido">Saltar al contenido</a>
    <Navbar />
    <main id="contenido" className="az-legal-main">
      <article className="az-wrap az-legal-article">
        <Link to="/es/confirmar-asistencia" className="az-rsvp-back"><ArrowLeft size={17} aria-hidden="true" /> Volver a la confirmación</Link>
        <p className="az-kicker">Información de privacidad</p>
        <h1>Vuestra información,<br /><em>bien cuidada.</em></h1>
        <p className="az-legal-lede">Esta web es una invitación privada para la boda de {organizer}. Explicamos aquí, de forma clara, qué datos se recogen y para qué.</p>
        <section aria-labelledby="legal-controller"><h2 id="legal-controller">Responsables</h2><p>Los responsables del tratamiento son {organizer}, organizadores de la boda. Para cualquier asunto relacionado con los datos, utilizad el canal de contacto indicado en la invitación.</p></section>
        <section aria-labelledby="legal-data"><h2 id="legal-data">Qué datos y para qué</h2><p>Al confirmar asistencia recogemos nombre, teléfono, respuesta de asistencia, acompañantes y, si decidís facilitarlo, comentarios, transporte, música y necesidades de menú. Se utilizan exclusivamente para organizar la celebración, reservar plazas, preparar el menú y resolver cuestiones relacionadas con la boda.</p><p>Los datos sobre alergias, intolerancias, embarazo o dieta son datos de salud. Son opcionales y solo se tratan cuando dais vuestro consentimiento expreso en el formulario. Si incluís datos de acompañantes, confirmáis que podéis facilitar esa información para este fin.</p><p>El libro de recuerdos recoge el nombre y el mensaje que enviéis. Solo se publica tras revisión de la organización. El reto de 20 segundos recoge nombre, teléfono y puntuación para identificar participaciones y premios; su resultado no se publica.</p></section>
        <section aria-labelledby="legal-basis"><h2 id="legal-basis">Base jurídica, destinatarios y conservación</h2><p>La gestión de la confirmación, los mensajes y el reto se basa en vuestro consentimiento al enviar cada formulario. Las necesidades alimentarias se tratan con consentimiento explícito. Podéis retirarlo antes de la boda contactando con la organización; ello no afecta a lo ya tratado de forma lícita.</p><p>Solo acceden a estos datos las personas organizadoras y, cuando sea imprescindible para el menú, los proveedores de la celebración. El alojamiento técnico de la web actúa como proveedor de servicio. No se prevén cesiones comerciales, publicidad ni decisiones automatizadas.</p><p>Las confirmaciones, mensajes y resultados se eliminarán o anonimizarán antes del 30 de junio de 2027, salvo que sea necesario conservarlos por una obligación legal. Los registros técnicos de seguridad se conservan el tiempo mínimo necesario para prevenir abusos.</p></section>
        <section aria-labelledby="legal-rights"><h2 id="legal-rights">Vuestros derechos</h2><p>Podéis solicitar acceso, rectificación, supresión, oposición, limitación del tratamiento o portabilidad de los datos, así como retirar el consentimiento, contactando con la organización. Si consideráis que el tratamiento no es correcto, podéis presentar una reclamación ante la <a href="https://www.aepd.es" target="_blank" rel="noreferrer">Agencia Española de Protección de Datos</a>.</p></section>
        <section aria-labelledby="legal-cookies"><h2 id="legal-cookies">Cookies y almacenamiento local</h2><p>Esta invitación no utiliza cookies de analítica, publicidad ni perfiles de seguimiento. Solo emplea cookies técnicas de sesión cuando son necesarias para proteger formularios y el acceso privado de moderación. En la vista previa puede usar almacenamiento local del navegador; no se emplea para publicidad.</p><p>Si en el futuro se incorporan servicios no esenciales, se solicitará consentimiento antes de activarlos.</p></section>
        <p className="az-legal-updated">Última actualización: 5 de noviembre de 2026.</p>
      </article>
    </main>
    <footer className="az-rsvp-page-footer"><span>{organizer}</span><span>{v.event.dateLabel}</span></footer>
  </div>;
}
