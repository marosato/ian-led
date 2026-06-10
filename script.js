const CONTACT_EMAIL = "testing.prueba2100@gmail.com";
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;

const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const form = document.querySelector("[data-contact-form]");
const statusEl = document.querySelector("[data-form-status]");
const leadSummary = document.querySelector("[data-lead-summary]");
const replyTo = document.querySelector("[data-replyto]");

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    nav.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  }
});

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const name = String(data.get("Nombre") || "").trim();
  const email = String(data.get("Email") || "").trim();
  const phone = String(data.get("Teléfono") || "").trim();
  const size = String(data.get("Tamaño estimado") || "").trim();
  const useCase = String(data.get("Uso previsto") || "").trim();
  const urgency = String(data.get("Urgencia") || "").trim();
  const message = String(data.get("Mensaje") || "").trim();

  if (!name || !email || !phone || !size || !useCase || !urgency || !message) {
    statusEl.textContent = "Completá los datos principales para enviar la consulta.";
    return;
  }

  const summary = `${name} consulta por una pantalla ${size} para ${useCase}. Urgencia: ${urgency}.`;
  leadSummary.value = summary;
  replyTo.value = email;

  const payload = new URLSearchParams({
    _subject: "Consulta calificada | Pantallas LED",
    _template: "table",
    _captcha: "false",
    _replyto: email,
    "Resumen de la consulta": summary,
    Nombre: name,
    Email: email,
    Teléfono: phone,
    "Tamaño estimado": size,
    "Uso previsto": useCase,
    Urgencia: urgency,
    Mensaje: message,
  });

  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  statusEl.textContent = "Enviando consulta...";

  try {
    const response = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: payload,
    });

    if (!response.ok) {
      throw new Error("No se pudo enviar la consulta.");
    }

    form.reset();
    statusEl.textContent = "Consulta enviada correctamente. Gracias por contactarte.";
  } catch (error) {
    statusEl.textContent =
      "No pudimos enviar la consulta en este momento. Probá nuevamente en unos minutos.";
  } finally {
    submitButton.disabled = false;
  }
});
