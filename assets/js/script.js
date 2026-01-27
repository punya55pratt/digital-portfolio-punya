'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);




// MULTI-DROPDOWN SUPPORT (fixes Portfolio, Articles, Accreditions)
document.querySelectorAll("[data-select]").forEach(selectBtn => {

  const wrapper = selectBtn.closest(".filter-select-box");
  const list = wrapper.querySelector(".select-list");
  // const valueBox = selectBtn.querySelector("[data-selecct-value]");
  
  const valueBox =
  selectBtn.querySelector("[data-select-value]") ||  // preferred (correct)
  selectBtn.querySelector("[data-selecct-value]");   // fallback to current HTML


  // Open/close this dropdown only
  selectBtn.addEventListener("click", () => {
    selectBtn.classList.toggle("active");
    list.classList.toggle("active");
  });

  // Handle selecting an item
  list.querySelectorAll("[data-select-item]").forEach(item => {
    item.addEventListener("click", () => {
      const selectedValue = item.innerText.toLowerCase();

      valueBox.textContent = item.innerText;

      selectBtn.classList.remove("active");
      list.classList.remove("active");

      // Trigger your existing filter
      filterFunc(selectedValue);
    });
  });
});

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}


// DESKTOP FILTER BUTTONS — safe & synced with mobile label(s)
const filterBtn = document.querySelectorAll("[data-filter-btn]");
let lastClickedBtn = filterBtn[0];

filterBtn.forEach(btn => {
  btn.addEventListener("click", function () {
    const selectedValue = this.innerText.toLowerCase();

    // Update all visible dropdown labels to reflect the chosen filter
    document.querySelectorAll(".filter-select [data-select-value], .filter-select [data-selecct-value]")
      .forEach(el => (el.textContent = this.innerText));

    // Apply filtering
    filterFunc(selectedValue);

    // Button active state
    if (lastClickedBtn) lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
});




// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}





// PAGE NAVIGATION with local reset (desktop & mobile)
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

navigationLinks.forEach(link => {
  link.addEventListener("click", function () {
    const target = this.textContent.trim().toLowerCase();

    // Show target page, hide others
    pages.forEach(page => {
      page.classList.toggle("active", page.dataset.page === target);
    });

    // Update navbar active state
    navigationLinks.forEach(nav => nav.classList.remove("active"));
    this.classList.add("active");

    // Reset filters only inside the newly active page
    const activePage = Array.from(pages).find(p => p.dataset.page === target);
    resetFiltersInPage(activePage);

    window.scrollTo(0, 0);
  });
});

function resetFiltersInPage(page) {
  if (!page) return;

  // Desktop buttons: set the first (All) active
  page.querySelectorAll(".filter-list").forEach(list => {
    const btns = list.querySelectorAll("[data-filter-btn]");
    btns.forEach(b => b.classList.remove("active"));
    if (btns[0]) btns[0].classList.add("active");
  });

  // Mobile dropdowns: close & reset label
  page.querySelectorAll(".filter-select-box").forEach(box => {
    const btn  = box.querySelector(".filter-select");
    const list = box.querySelector(".select-list");
    const val  = box.querySelector("[data-select-value]") || box.querySelector("[data-selecct-value]");
    if (btn)  btn.classList.remove("active");
    if (list) list.classList.remove("active");
    if (val)  val.textContent = "Select topic"; // or "All" if you prefer
  });

  // Show all items by default
  page.querySelectorAll("[data-filter-item]").forEach(item => item.classList.add("active"));
}




// ==============================
// CONTACT: Send Options Modal
// ==============================
const contactModalContainer = document.querySelector("[data-contact-modal-container]");
const contactOverlay = document.querySelector("[data-contact-overlay]");
const contactModalCloseBtn = document.querySelector("[data-contact-modal-close-btn]");
const sendEmailBtn = document.querySelector("[data-send-email]");
const sendWhatsappBtn = document.querySelector("[data-send-whatsapp]");

// Open/close helper
function toggleContactModal(show) {
  if (!contactModalContainer) return;
  contactModalContainer.classList.toggle("active", show);
  contactOverlay?.classList.toggle("active", show);
}

// Read values from your existing form fields: fullname/email/message
function getContactFormValues() {
  const fullname = form?.querySelector('input[name="fullname"]')?.value?.trim() || "";
  const email = form?.querySelector('input[name="email"]')?.value?.trim() || "";
  const message = form?.querySelector('textarea[name="message"]')?.value?.trim() || "";
  return { fullname, email, message };
}

// Intercept submit: show modal instead of submitting
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    toggleContactModal(true);
  });
}

// Close modal events
contactModalCloseBtn?.addEventListener("click", () => toggleContactModal(false));
contactOverlay?.addEventListener("click", () => toggleContactModal(false));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") toggleContactModal(false);
});

// SEND via Email
sendEmailBtn?.addEventListener("click", () => {
  const { fullname, email, message } = getContactFormValues();

  const to = "p05prateek@gmail.com"; // <-- change if needed
  const subject = encodeURIComponent(`Message from ${fullname || "Website Visitor"}`);
  const body = encodeURIComponent(
    `Full name: ${fullname}\nEmail: ${email}\n\nMessage:\n${message}`
  );

  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  toggleContactModal(false);
});

// SEND via WhatsApp
sendWhatsappBtn?.addEventListener("click", () => {
  const { fullname, email, message } = getContactFormValues();

  const whatsappNumber = "919742896905"; // <-- international format without + or spaces
  const text = encodeURIComponent(
    `Hello Punya,\n\nFull name: ${fullname}\nEmail: ${email}\n\nMessage:\n${message}`
  );

  window.open(`https://wa.me/${whatsappNumber}?text=${text}`, "_blank");
  toggleContactModal(false);
});



(() => {
  const THEMES = ["dark", "light", "dracula"];
  const THEME_FILES = {
    dark: "./assets/css/theme-dark.css",
    light: "./assets/css/theme-light.css",
    dracula: "./assets/css/theme-dracula.css",
  };

  const linkEl = document.getElementById("theme-css");
  const btn = document.querySelector("[data-theme-toggle]");
  const label = btn?.querySelector(".theme-label");

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    if (linkEl) linkEl.href = THEME_FILES[theme];
    localStorage.setItem("theme", theme);

    if (label) {
      label.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
    }

    // optional: swap icon per theme
    const icon = btn?.querySelector("ion-icon");
    if (icon) {
      icon.name =
        theme === "light"
          ? "sunny-outline"
          : theme === "dracula"
          ? "skull-outline"
          : "moon-outline";
    }
  }

  function getInitialTheme() {
    const saved = localStorage.getItem("theme");
    if (saved && THEMES.includes(saved)) return saved;

    // Default: keep your current look (dark)
    return "dark";
  }

  function nextTheme(current) {
    const idx = THEMES.indexOf(current);
    return THEMES[(idx + 1) % THEMES.length];
  }

  const initial = getInitialTheme();
  setTheme(initial);

  btn?.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    setTheme(nextTheme(current));
  });
})();
