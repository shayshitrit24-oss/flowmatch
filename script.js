/* ----------------------------------
   FLOWMATCH V3 – SCRIPT
   ---------------------------------- */

document.addEventListener("DOMContentLoaded", () => {

  /* ------------------------------
     VIEWS NAVIGATION
  ------------------------------ */
  const views = document.querySelectorAll(".view");
  const navButtons = document.querySelectorAll("[data-view]");

  function showView(id) {
    views.forEach(v => v.classList.toggle("active", v.id === id));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => showView(btn.dataset.view));
  });

  document.querySelectorAll(".js-start-parent")
    .forEach(btn => btn.addEventListener("click", () => showView("parent-flow")));

  document.querySelectorAll(".js-start-therapist")
    .forEach(btn => btn.addEventListener("click", () => showView("therapist-flow")));

  document.querySelectorAll(".js-back-home")
    .forEach(btn => btn.addEventListener("click", () => showView("landing")));


  /* ------------------------------
     STEPPER LOGIC
  ------------------------------ */
  function wireSteps(prefix) {
    const nextBtns = document.querySelectorAll(`#${prefix}-form .js-next-step`);
    const prevBtns = document.querySelectorAll(`#${prefix}-form .js-prev-step`);
    const stepItems = document.querySelectorAll(`[data-step-label^='${prefix[0]}-step']`);

    function activate(stepId) {
      const panels = document.querySelectorAll(`#${prefix}-form .step-panel`);
      panels.forEach(p => p.classList.toggle("active", p.id === stepId));

      stepItems.forEach(i =>
        i.classList.toggle("active", i.dataset.stepLabel === stepId)
      );
    }

    nextBtns.forEach(btn =>
      btn.addEventListener("click", () => activate(btn.dataset.next))
    );
    prevBtns.forEach(btn =>
      btn.addEventListener("click", () => activate(btn.dataset.prev))
    );
  }

  wireSteps("parent");
  wireSteps("therapist");


  /* ------------------------------
     CHIP GROUPS
  ------------------------------ */
  function initChipGroups() {
    const groups = document.querySelectorAll(".chip-group");
    groups.forEach(group => {
      const name = group.dataset.name;
      const hidden = document.querySelector(`input[name="${name}"]`);
      if (!hidden) return;

      group.addEventListener("click", e => {
        const chip = e.target.closest(".chip");
        if (!chip) return;
        chip.classList.toggle("active");

        const values = Array.from(group.querySelectorAll(".chip.active"))
          .map(c => c.textContent.trim());

        hidden.value = values.join("|");
      });
    });
  }
  initChipGroups();


  /* ------------------------------
     AUTOCOMPLETE CITY LIST
  ------------------------------ */
  const cityList = [
    "תל אביב", "חיפה", "ירושלים", "רחובות", "ראשון לציון", "נס ציונה",
    "רעננה", "הרצליה", "הוד השרון", "מודיעין", "אשדוד", "אשקלון",
    "נתניה", "גבעתיים", "פתח תקווה", "באר שבע", "קריית אונו",
    "קריית גת", "מעלה אדומים", "אילת", "קריית שמונה"
  ];

  document.querySelectorAll("input[name='location'], input[name='areas']")
    .forEach(input => {
      const box = document.createElement("div");
      box.className = "autocomplete-box";
      input.parentElement.appendChild(box);

      input.addEventListener("input", () => {
        const val = input.value.trim();
        if (!val) return (box.style.display = "none");

        const results = cityList.filter(c => c.includes(val));
        box.innerHTML = "";
        results.forEach(city => {
          const item = document.createElement("div");
          item.className = "autocomplete-item";
          item.textContent = city;
          item.onclick = () => {
            input.value = city;
            box.style.display = "none";
          };
          box.appendChild(item);
        });

        box.style.display = results.length ? "block" : "none";
      });
    });


  /* ------------------------------
     PARENT: SUB SPECIALTY
  ------------------------------ */
  const parentMain = document.getElementById("parent-main-treatment");
  const parentSub = document.getElementById("parent-sub-specialty");

  const subs = {
    speech: ["עיכוב שפתי", "היגוי", "גמגום", "AAC"],
    ot: ["ויסות חושי", "מוטוריקה עדינה", "גרפומוטוריקה"],
    physio: ["פיזיותרפיה תינוקות", "שיקום"],
    emotional: ["טיפול במשחק", "אמנות"],
    psychology: ["CBT", "התפתחותי"]
  };

  if (parentMain) {
    parentMain.addEventListener("change", () => {
      parentSub.innerHTML = `<option value="">בחרו תת-התמחות</option>`;
      const list = subs[parentMain.value] || [];
      list.forEach(item => {
        const opt = document.createElement("option");
        opt.value = item;
        opt.textContent = item;
        parentSub.appendChild(opt);
      });
    });
  }


  /* ------------------------------
     INSURANCE DEMO LOGIC
  ------------------------------ */
  const radios = document.querySelectorAll("input[name='has_insurance']");
  const secYes = document.querySelector(".insurance-section[data-insurance='yes']");
  const secNo = document.querySelector(".insurance-section[data-insurance='no']");
  const policyInput = document.getElementById("policy-file");
  const policyStatus = document.getElementById("policy-status");

  function updateInsurance() {
    const selected = [...radios].find(r => r.checked)?.value;
    secYes.style.display = selected === "yes" ? "block" : "none";
    secNo.style.display = selected === "no" ? "block" : "none";
  }
  radios.forEach(r => r.addEventListener("change", updateInsurance));

  if (policyInput) {
    policyInput.addEventListener("change", () => {
      if (policyInput.files.length) {
        policyStatus.textContent =
          `הקובץ "${policyInput.files[0].name}" התקבל (דמו – AI ינתח).`;
      }
    });
  }


  /* ------------------------------
     FORM SUBMISSION (DEMO)
  ------------------------------ */
  function wireFormSubmit(id, successId) {
    const form = document.getElementById(id);
    const success = document.getElementById(successId);
    form.addEventListener("submit", e => {
      e.preventDefault();
      success.style.display = "block";
      form.querySelectorAll(".step-panel").forEach(p => (p.style.display = "none"));
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  wireFormSubmit("parent-form", "parent-success");
  wireFormSubmit("therapist-form", "therapist-success");


  /* ------------------------------
     SEARCH RESULTS DEMO
  ------------------------------ */
  const sampleTherapists = [
    {
      name: "יעל לוי – קלינאית תקשורת",
      exp: "12 שנות ניסיון",
      price: "240 ₪ לפגישה",
      distance: "2.1 ק״מ ממך",
      specialty: "עיכוב שפתי, היגוי",
    },
    {
      name: "מיכל רון – ריפוי בעיסוק",
      exp: "8 שנות ניסיון",
      price: "210 ₪",
      distance: "3.4 ק״מ",
      specialty: "ויסות חושי, מוטוריקה עדינה"
    }
  ];

  const resultsBox = document.getElementById("results-list");
  const popup = document.getElementById("popup-backdrop");
  const popupPanel = document.getElementById("popup-panel");

  if (resultsBox) {
    sampleTherapists.forEach(t => {
      const div = document.createElement("div");
      div.className = "result-card";
      div.innerHTML = `
        <h4>${t.name}</h4>
        <p>${t.exp}</p>
        <p><strong>${t.price}</strong></p>
        <p>${t.distance}</p>
      `;
      div.onclick = () => showTherapistPopup(t);
      resultsBox.appendChild(div);
    });
  }

  function showTherapistPopup(t) {
    popupPanel.innerHTML = `
      <h3>${t.name}</h3>
      <p>${t.exp}</p>
      <p>${t.specialty}</p>
      <p><strong>${t.price}</strong></p>

      <button class="primary-btn" id="book-btn">קבע תור</button>
      <button class="secondary-btn" id="close-popup">סגור</button>
    `;

    popup.style.display = "flex";

    document.getElementById("close-popup").onclick = () => {
      popup.style.display = "none";
    };

    document.getElementById("book-btn").onclick = () => {
      alert("הבקשה נשלחה למטפל. הוא יחזור אליכם בהקדם.");
      popup.style.display = "none";
    };
  }

});
