document.addEventListener("DOMContentLoaded", () => {
  const views = document.querySelectorAll(".view");
  const navButtons = document.querySelectorAll("[data-view]");
  const startParentButtons = document.querySelectorAll(".js-start-parent");
  const startTherapistButtons = document.querySelectorAll(".js-start-therapist");
  const backHomeButtons = document.querySelectorAll(".js-back-home");
  const goInsuranceButtons = document.querySelectorAll(".js-go-insurance");

  function showView(id) {
    views.forEach((v) => v.classList.toggle("active", v.id === id));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ניווט כללי לפי data-view
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const view = btn.getAttribute("data-view");
      if (view) showView(view);
    });
  });

  // CTA מהדף הראשי
  startParentButtons.forEach((btn) =>
    btn.addEventListener("click", () => showView("parent-flow"))
  );
  startTherapistButtons.forEach((btn) =>
    btn.addEventListener("click", () => showView("therapist-flow"))
  );
  backHomeButtons.forEach((btn) =>
    btn.addEventListener("click", () => {
      const view = btn.getAttribute("data-view") || "landing";
      showView(view);
    })
  );

  goInsuranceButtons.forEach((btn) =>
    btn.addEventListener("click", () => showView("insurance-flow"))
  );

  /* Step navigation */
  function wireSteps(formIdPrefix) {
    const nextButtons = document.querySelectorAll(`#${formIdPrefix}-form .js-next-step`);
    const prevButtons = document.querySelectorAll(`#${formIdPrefix}-form .js-prev-step`);
    const stepperItems = document.querySelectorAll(
      `[data-step-label^='${formIdPrefix === "parent" ? "p" : "t"}-step']`
    );

    function setActiveStep(stepId) {
      const panels = document.querySelectorAll(`#${formIdPrefix}-form .step-panel`);
      panels.forEach((p) => p.classList.toggle("active", p.id === stepId));
      stepperItems.forEach((item) => {
        const label = item.getAttribute("data-step-label");
        item.classList.toggle("active", label === stepId);
      });
    }

    nextButtons.forEach((btn) =>
      btn.addEventListener("click", () => {
        const nextId = btn.getAttribute("data-next");
        if (nextId) setActiveStep(nextId);
      })
    );
    prevButtons.forEach((btn) =>
      btn.addEventListener("click", () => {
        const prevId = btn.getAttribute("data-prev");
        if (prevId) setActiveStep(prevId);
      })
    );
  }

  wireSteps("parent");
  wireSteps("therapist");

  /* Chips */
  function initChipGroups() {
    const groups = document.querySelectorAll(".chip-group");
    groups.forEach((group) => {
      const name = group.getAttribute("data-name");
      if (!name) return;
      const hiddenInput = document.querySelector(`input[name="${name}"]`);
      if (!hiddenInput) return;

      group.addEventListener("click", (e) => {
        const target = e.target;
        if (!(target instanceof HTMLElement)) return;
        const chip = target.closest(".chip");
        if (!chip) return;

        chip.classList.toggle("active");
        const activeValues = Array.from(group.querySelectorAll(".chip.active")).map(
          (c) => c.textContent?.trim() || ""
        );
        hiddenInput.value = activeValues.join("|");
      });
    });
  }

  initChipGroups();

  /* Parent: dynamic sub-specialties */
  const parentMainTreatment = document.getElementById("parent-main-treatment");
  const parentSubSpecialty = document.getElementById("parent-sub-specialty");

  const subSpecialtiesMap = {
    speech: [
      "עיכוב שפתי",
      "גמגום",
      "קשיי היגוי",
      "עיבוד שמיעתי",
      "תקשורת חברתית",
      "הזנה ואכילה",
      "תקשורת תומכת וחליפית (AAC)",
    ],
    ot: [
      "ויסות חושי",
      "מוטוריקה עדינה",
      "מוטוריקה גסה",
      "גרפומוטוריקה",
      "תפקודי יום־יום (ADL)",
      "עבודה עם ASD",
      "מיומנויות כיתה א׳",
    ],
    physio: [
      "פיזיותרפיה תינוקות",
      "פיזיותרפיה נשימתית",
      "פציעות ספורט ילדים",
      "שיקום לאחר פגיעה",
      "טיפול ביציבה",
    ],
    emotional: [
      "טיפול במשחק",
      "טיפול באמצעות אמנות",
      "ויסות רגשי",
      "חרדות ילדים",
      "טיפול דיאדי הורה־ילד",
    ],
    psychology: [
      "פסיכולוגיה התפתחותית",
      "פסיכולוגיה חינוכית",
      "CBT לילדים",
      "טיפול משפחתי",
      "טיפול בנוער עם חרדה",
    ],
  };

  function refreshSubSpecialties() {
    if (!parentMainTreatment || !parentSubSpecialty) return;
    const key = parentMainTreatment.value;
    const list = subSpecialtiesMap[key] || [];
    parentSubSpecialty.innerHTML = '<option value="">בחרו תת־התמחות (אופציונלי)</option>';
    list.forEach((item) => {
      const opt = document.createElement("option");
      opt.value = item;
      opt.textContent = item;
      parentSubSpecialty.appendChild(opt);
    });
  }

  if (parentMainTreatment) {
    parentMainTreatment.addEventListener("change", refreshSubSpecialties);
  }

  /* ביטוח */
  const hasInsuranceRadios = document.querySelectorAll("input[name='has_insurance']");
  const insuranceYesSection = document.querySelector(".insurance-section[data-insurance='yes']");
  const insuranceNoSection = document.querySelector(".insurance-section[data-insurance='no']");
  const policyFileInput = document.getElementById("policy-file");
  const policyStatus = document.getElementById("policy-status");

  function updateInsuranceSections() {
    const selected = Array.from(hasInsuranceRadios).find((r) => r.checked)?.value;
    if (!selected) {
      if (insuranceYesSection) insuranceYesSection.style.display = "none";
      if (insuranceNoSection) insuranceNoSection.style.display = "none";
      return;
    }
    if (insuranceYesSection)
      insuranceYesSection.style.display = selected === "yes" ? "block" : "none";
    if (insuranceNoSection)
      insuranceNoSection.style.display = selected === "no" ? "block" : "none";
  }

  hasInsuranceRadios.forEach((r) => r.addEventListener("change", updateInsuranceSections));
  updateInsuranceSections();

  if (policyFileInput && policyStatus) {
    policyFileInput.addEventListener("change", () => {
      if (policyFileInput.files && policyFileInput.files.length > 0) {
        const fileName = policyFileInput.files[0].name;
        policyStatus.textContent =
          'הקובץ "' +
          fileName +
          '" נטען בהצלחה. ב־MVP אנחנו רק מדמים את תהליך ניתוח הפוליסה.';
      } else {
        policyStatus.textContent = "טרם הועלה קובץ.";
      }
    });
  }

  /* Submit forms – מטפל בלבד, הורה מסתיים במסך התאמות */
  function wireFormSubmit(formId, successId) {
    const form = document.getElementById(formId);
    const successEl = document.getElementById(successId);
    if (!form || !successEl) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const panels = form.querySelectorAll(".step-panel");
      panels.forEach((p) => (p.style.display = "none"));
      successEl.style.display = "block";
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  wireFormSubmit("therapist-form", "therapist-success");
});
