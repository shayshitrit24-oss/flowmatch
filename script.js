document.addEventListener("DOMContentLoaded", () => {
  const views = document.querySelectorAll(".view");
  const navButtons = document.querySelectorAll("[data-view]");
  const startParentButtons = document.querySelectorAll(".js-start-parent");
  const startTherapistButtons = document.querySelectorAll(".js-start-therapist");
  const backHomeButtons = document.querySelectorAll(".js-back-home");

  function showView(id) {
    views.forEach((v) => v.classList.toggle("active", v.id === id));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const view = btn.getAttribute("data-view");
      if (view) showView(view);
    });
  });

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

  /* Step navigation */
  function wireSteps(formIdPrefix) {
    const form = document.getElementById(`${formIdPrefix}-form`);
    if (!form) return;

    const nextButtons = form.querySelectorAll(".js-next-step");
    const prevButtons = form.querySelectorAll(".js-prev-step");
    const stepperItems = document.querySelectorAll(
      `[data-step-label^='${formIdPrefix === "parent" ? "p" : "t"}-step']`
    );

    function setActiveStep(stepId) {
      const panels = form.querySelectorAll(".step-panel");
      panels.forEach((p) => p.classList.toggle("active", p.id === stepId));
      stepperItems.forEach((item) => {
        const label = item.getAttribute("data-step-label");
        item.classList.toggle("active", label === stepId);
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
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
        if (!(e.target instanceof HTMLElement)) return;
        const chip = e.target.closest(".chip");
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
      "תפקודי יום-יום (ADL)",
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
      "טיפול דיאדי הורה-ילד",
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
    parentSubSpecialty.innerHTML = '<option value="">בחרו תת-התמחות (אופציונלי)</option>';
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

  /* Parent: find match -> show results panel */
  const parentForm = document.getElementById("parent-form");
  const parentResultsPanel = document.getElementById("p-results");
  const findMatchBtn = parentForm?.querySelector(".js-find-match");
  const restartBtn = parentForm?.querySelector(".js-restart-parent");
  const notRelevantBtn = parentForm?.querySelector(".js-not-relevant");
  const notRelevantMsg = document.getElementById("not-relevant-msg");
  const bookingToast = document.getElementById("booking-toast");

  function showParentResults() {
    if (!parentForm || !parentResultsPanel) return;
    const panels = parentForm.querySelectorAll(".step-panel");
    panels.forEach((p) => p.classList.remove("active"));
    parentResultsPanel.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (findMatchBtn) {
    findMatchBtn.addEventListener("click", () => {
      showParentResults();
    });
  }

  if (restartBtn && parentForm) {
    restartBtn.addEventListener("click", () => {
      // Reset fields (דמו בסיסי)
      parentForm.reset();
      parentResultsPanel?.classList.remove("active");
      const firstStep = parentForm.querySelector("#p-step-1");
      if (firstStep) firstStep.classList.add("active");

      const stepperItems = document.querySelectorAll("[data-step-label^='p-step']");
      stepperItems.forEach((item) => {
        item.classList.toggle("active", item.getAttribute("data-step-label") === "p-step-1");
      });

      if (notRelevantMsg) notRelevantMsg.style.display = "none";
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (notRelevantBtn && notRelevantMsg) {
    notRelevantBtn.addEventListener("click", () => {
      notRelevantMsg.style.display = "block";
    });
  }

  /* Parent results: book & details */
  if (parentResultsPanel) {
    parentResultsPanel.addEventListener("click", (e) => {
      if (!(e.target instanceof HTMLElement)) return;
      const btn = e.target.closest(".result-btn");
      if (!btn) return;
      const action = btn.getAttribute("data-action");
      const card = btn.closest(".result-card");
      if (!card) return;

      if (action === "book") {
        if (bookingToast) {
          bookingToast.classList.add("visible");
          setTimeout(() => {
            bookingToast.classList.remove("visible");
          }, 2600);
        }
      } else if (action === "details") {
        const extra = card.querySelector(".extra-details");
        if (extra) extra.classList.toggle("active");
      }
    });
  }

  /* Insurance module */

  const policyFileInput = document.getElementById("policy-file");
  const policyStatus = document.getElementById("policy-status");
  const aiConsent = document.getElementById("ai-consent");
  const analyzePolicyBtn = document.getElementById("analyze-policy-btn");
  const policyAnalysisBox = document.getElementById("policy-analysis-box");

  if (policyFileInput && policyStatus) {
    policyFileInput.addEventListener("change", () => {
      if (policyFileInput.files && policyFileInput.files.length > 0) {
        policyStatus.textContent = `הקובץ "${policyFileInput.files[0].name}" נטען (דמו).`;
      } else {
        policyStatus.textContent = "לא הועלה קובץ.";
      }
    });
  }

  if (analyzePolicyBtn && policyAnalysisBox) {
    policyAnalysisBox.style.display = "none";

    analyzePolicyBtn.addEventListener("click", () => {
      if (!aiConsent || !aiConsent.checked) {
        alert("יש לסמן הסכמה לניתוח הפוליסה (דמו) לפני ההמשך.");
        return;
      }
      if (!policyFileInput || !policyFileInput.files || policyFileInput.files.length === 0) {
        alert("יש להעלות קובץ פוליסה (גם לצורך הדגמה).");
        return;
      }
      policyAnalysisBox.style.display = "block";
      window.scrollTo({ top: policyAnalysisBox.offsetTop - 80, behavior: "smooth" });
    });
  }

  /* No policy form */

  const noPolicyForm = document.getElementById("no-policy-form");
  const noPolicySuccess = document.getElementById("no-policy-success");

  if (noPolicyForm && noPolicySuccess) {
    noPolicySuccess.style.display = "none";

    noPolicyForm.addEventListener("submit", (e) => {
      e.preventDefault();
      noPolicyForm.style.display = "none";
      noPolicySuccess.style.display = "block";
    });
  }

  /* Therapist form submit -> success */

  function wireFormSubmit(formId, successId) {
    const form = document.getElementById(formId);
    const successEl = document.getElementById(successId);
    if (!form || !successEl) return;

    successEl.style.display = "none";

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const panels = form.querySelectorAll(".step-panel");
      panels.forEach((p) => (p.style.display = "none"));
      const steppers =
        formId === "therapist-form"
          ? document.querySelectorAll("[data-step-label^='t-step']")
          : document.querySelectorAll("[data-step-label^='p-step']");
      steppers.forEach((item) => item.classList.remove("active"));

      successEl.style.display = "block";
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  wireFormSubmit("therapist-form", "therapist-success");

  /* Autocomplete for cities (דמו) */

  const cities = [
    "אילת",
    "אשדוד",
    "אשקלון",
    "באר שבע",
    "בת ים",
    "גבעתיים",
    "הרצליה",
    "חדרה",
    "חולון",
    "חיפה",
    "טבריה",
    "יבנה",
    "יהוד",
    "ירושלים",
    "כפר סבא",
    "כרמיאל",
    "מודיעין",
    "נס ציונה",
    "נהריה",
    "נתניה",
    "עפולה",
    "פתח תקווה",
    "צפת",
    "קריית אונו",
    "קריית גת",
    "קריית שמונה",
    "ראש העין",
    "ראשון לציון",
    "רחובות",
    "רמלה",
    "רמת גן",
    "רעננה",
    "תל אביב",
  ];

  function initAutocomplete() {
    const inputs = document.querySelectorAll('input[data-autocomplete="city"]');
    inputs.forEach((input) => {
      const wrapper = document.createElement("div");
      wrapper.className = "autocomplete-wrapper";
      const parent = input.parentElement;
      if (!parent) return;
      parent.replaceChild(wrapper, input);
      wrapper.appendChild(input);

      const list = document.createElement("div");
      list.className = "autocomplete-list";
      list.style.display = "none";
      wrapper.appendChild(list);

      input.addEventListener("input", () => {
        const value = input.value.trim();
        if (!value) {
          list.style.display = "none";
          list.innerHTML = "";
          return;
        }
        const lower = value.toLowerCase();
        const matches = cities.filter((city) => city.toLowerCase().includes(lower));
        if (matches.length === 0) {
          list.style.display = "none";
          list.innerHTML = "";
          return;
        }
        list.innerHTML = "";
        matches.forEach((city) => {
          const item = document.createElement("div");
          item.className = "autocomplete-item";
          item.textContent = city;
          item.addEventListener("click", () => {
            input.value = city;
            list.style.display = "none";
            list.innerHTML = "";
          });
          list.appendChild(item);
        });
        list.style.display = "block";
      });

      document.addEventListener("click", (e) => {
        if (!(e.target instanceof Node)) return;
        if (!wrapper.contains(e.target)) {
          list.style.display = "none";
        }
      });
    });
  }

  initAutocomplete();
});
