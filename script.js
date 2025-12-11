/* ------------------------------------------------------
   FLOWMATCH – SCRIPT V3 (Stable Build)
------------------------------------------------------ */

document.addEventListener("DOMContentLoaded", () => {

  /* -----------------------------
        VIEW MANAGER
  ------------------------------ */

  const views = document.querySelectorAll(".view");
  const navButtons = document.querySelectorAll("[data-view]");

  function showView(id) {
    views.forEach(v => v.classList.remove("active"));
    const view = document.getElementById(id);
    if (view) view.classList.add("active");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.view;
      showView(target);
    });
  });

  // כפתורי חזרה הביתה
  document.querySelectorAll(".go-home").forEach(btn => {
    btn.addEventListener("click", () => showView("landing"));
  });



  /* -------------------------------------------------
        הורה – ניווט בין שלבים
  -------------------------------------------------- */

  function wireStepper(prefix) {
    const panels = document.querySelectorAll(`#${prefix}-form .step-panel`);
    const stepButtons = document.querySelectorAll(`#${prefix}-form .js-next, #${prefix}-form .js-prev`);

    function setStep(stepId) {
      panels.forEach(p => p.classList.remove("active"));
      const panel = document.getElementById(stepId);
      if (panel) panel.classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    stepButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const next = btn.dataset.next;
        const prev = btn.dataset.prev;
        if (next) setStep(next);
        if (prev) setStep(prev);
      });
    });
  }

  wireStepper("parent");
  wireStepper("therapist");



  /* -------------------------------------------------
        הודעת הצלחה – הורה
  -------------------------------------------------- */

  const parentForm = document.getElementById("parent-form");
  const parentSuccess = document.getElementById("parent-success");

  if (parentForm && parentSuccess) {
    parentForm.addEventListener("submit", e => {
      e.preventDefault();
      parentForm.style.display = "none";
      parentSuccess.style.display = "block";
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }



  /* -------------------------------------------------
        הודעת הצלחה – מטפל
  -------------------------------------------------- */

  const therapistForm = document.getElementById("therapist-form");
  const therapistSuccess = document.getElementById("therapist-success");

  if (therapistForm && therapistSuccess) {
    therapistForm.addEventListener("submit", e => {
      e.preventDefault();
      therapistForm.style.display = "none";
      therapistSuccess.style.display = "block";
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }



  /* -------------------------------------------------
        תתי־התמחויות – דינמי (הורה)
  -------------------------------------------------- */

  const mainTreatment = document.getElementById("parent-main-treatment");
  const subSelect = document.getElementById("parent-sub-specialty");

  const subMap = {
    speech: ["עיכוב שפתי", "גמגום", "היגוי", "תקשורת תומכת", "הזנה"],
    ot: ["ויסות", "מוטוריקה עדינה", "מוטוריקה גסה", "גרפומוטוריקה"],
    physio: ["תינוקות", "שיקום", "פציעות ספורט"],
    emotional: ["רגשי", "אמנות", "משחק"],
    psychology: ["CBT", "התפתחותי", "משפחתי"]
  };

  if (mainTreatment && subSelect) {
    mainTreatment.addEventListener("change", () => {
      const key = mainTreatment.value;
      const items = subMap[key] || [];

      subSelect.innerHTML = `<option value="">בחרו תת־התמחות (לא חובה)</option>`;
      items.forEach(i => {
        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = i;
        subSelect.appendChild(opt);
      });
    });
  }



  /* -------------------------------------------------
        הצגת תוצאות מטפלים (דמו)
  -------------------------------------------------- */

  const fakeResultsBtn = document.getElementById("show-results");
  const resultsView = document.getElementById("results-view");

  if (fakeResultsBtn) {
    fakeResultsBtn.addEventListener("click", () => {
      showView("results-view");
    });
  }



  /* -------------------------------------------------
        פעולות על כרטיס מטפל
  -------------------------------------------------- */

  document.querySelectorAll(".btn-book").forEach(btn => {
    btn.addEventListener("click", () => {
      alert("בקשת התאמה נשלחה למטפל! (דמו) – הוא יאשר ויצור קשר.");
    });
  });

  document.querySelectorAll(".btn-more").forEach(btn => {
    btn.addEventListener("click", () => {
      alert("מידע נוסף על המטפל יוצג כאן בגרסה המלאה.");
    });
  });



  /* -------------------------------------------------
        ביטוח – דמו
  -------------------------------------------------- */

  const insuranceFile = document.getElementById("policy-file");
  const insuranceStatus = document.getElementById("policy-status");

  if (insuranceFile && insuranceStatus) {
    insuranceFile.addEventListener("change", () => {
      if (insuranceFile.files.length > 0) {
        insuranceStatus.textContent =
          "📄 הקובץ נטען בהצלחה – במערכת המלאה יתבצע ניתוח פוליסה באמצעות AI.";
      } else {
        insuranceStatus.textContent = "לא נבחר קובץ.";
      }
    });
  }

});
