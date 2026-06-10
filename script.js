const CONTACT_EMAIL = "testing.prueba2100@gmail.com";
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;

const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const form = document.querySelector("[data-contact-form]");
const statusEl = document.querySelector("[data-form-status]");

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
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const message = String(data.get("message") || "").trim();

  if (!name || !email || !message) {
    statusEl.textContent = "Completá nombre, email y mensaje para enviar la consulta.";
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  statusEl.textContent = "Enviando consulta...";

  try {
    const response = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: data,
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
