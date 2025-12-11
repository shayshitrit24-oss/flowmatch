/* ---------------------------------------------------
   FlowMatch V3 — Script Engine
   --------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
    
    /* ---------------------------------------------
       VIEW HANDLING
    --------------------------------------------- */

    const views = document.querySelectorAll(".view");
    const navButtons = document.querySelectorAll("[data-view]");

    function showView(id) {
        views.forEach(v => v.classList.toggle("active", v.id === id));
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    navButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const target = btn.dataset.view;
            if (target) showView(target);
        });
    });

    /* ---------------------------------------------
       START FLOW BUTTONS (Home page)
    --------------------------------------------- */

    document.querySelectorAll(".js-start-parent").forEach(btn =>
        btn.addEventListener("click", () => showView("parent-flow"))
    );

    document.querySelectorAll(".js-start-therapist").forEach(btn =>
        btn.addEventListener("click", () => showView("therapist-flow"))
    );

    document.querySelectorAll(".js-back-home").forEach(btn =>
        btn.addEventListener("click", () => showView("landing"))
    );


    /* ---------------------------------------------
       STEPPER LOGIC (Parent + Therapist)
    --------------------------------------------- */

    function setupStepper(prefix) {
        const nextBtns = document.querySelectorAll(`#${prefix}-form .js-next-step`);
        const prevBtns = document.querySelectorAll(`#${prefix}-form .js-prev-step`);
        const steps = document.querySelectorAll(`[data-step-label^='${prefix === "parent" ? "p" : "t"}-step']`);

        function activate(stepId) {
            document.querySelectorAll(`#${prefix}-form .step-panel`)
                .forEach(p => p.classList.toggle("active", p.id === stepId));

            steps.forEach(s => {
                s.classList.toggle("active", s.dataset.stepLabel === stepId);
            });
        }

        nextBtns.forEach(btn =>
            btn.addEventListener("click", () => activate(btn.dataset.next))
        );

        prevBtns.forEach(btn =>
            btn.addEventListener("click", () => activate(btn.dataset.prev))
        );
    }

    setupStepper("parent");
    setupStepper("therapist");


    /* ---------------------------------------------
       CHIP GROUPS
    --------------------------------------------- */

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

                const selected = [...group.querySelectorAll(".chip.active")]
                    .map(c => c.textContent.trim());

                hidden.value = selected.join("|");
            });
        });
    }

    initChipGroups();


    /* ---------------------------------------------
       PARENT — Dynamic Sub-Specialties Dropdown
    --------------------------------------------- */

    const parentMainTreat = document.getElementById("parent-main-treatment");
    const parentSub = document.getElementById("parent-sub-specialty");

    const specialties = {
        speech: ["עיכוב שפתי", "גמגום", "קשיי היגוי", "עיבוד שמיעתי"],
        ot: ["ויסות חושי", "מוטוריקה עדינה", "ADL", "גרפומוטוריקה"],
        physio: ["פיזיותרפיה תינוקות", "פציעות ספורט", "שיקום יציבה"],
        emotional: ["ויסות רגשי", "טיפול במשחק", "חרדות ילדים"],
        psychology: ["CBT", "הדרכת הורים", "פסיכולוגיה חינוכית"]
    };

    if (parentMainTreat) {
        parentMainTreat.addEventListener("change", () => {
            const key = parentMainTreat.value;
            const list = specialties[key] || [];

            parentSub.innerHTML = `<option value="">בחרו תת־התמחות (אופציונלי)</option>`;
            list.forEach(item => {
                const opt = document.createElement("option");
                opt.value = item;
                opt.textContent = item;
                parentSub.appendChild(opt);
            });
        });
    }


    /* ---------------------------------------------
       INSURANCE (Yes/No Section Toggle)
    --------------------------------------------- */

    const insuranceRadios = document.querySelectorAll("input[name='has_insurance']");
    const insuranceYes = document.querySelector(`.insurance-section[data-insurance="yes"]`);
    const insuranceNo = document.querySelector(`.insurance-section[data-insurance="no"]`);

    function updateInsurance() {
        const selected = [...insuranceRadios].find(r => r.checked)?.value;

        insuranceYes.style.display = selected === "yes" ? "block" : "none";
        insuranceNo.style.display = selected === "no" ? "block" : "none";
    }

    insuranceRadios.forEach(r => r.addEventListener("change", updateInsurance));


    /* ---------------------------------------------
       SUCCESS MESSAGES (Parent + Therapist)
    --------------------------------------------- */

    function setupSubmit(formId, successId, redirectView = null) {
        const form = document.getElementById(formId);
        const box = document.getElementById(successId);

        if (!form || !box) return;

        form.addEventListener("submit", e => {
            e.preventDefault();

            form.querySelectorAll(".step-panel").forEach(p => p.style.display = "none");
            box.style.display = "block";

            if (redirectView) {
                setTimeout(() => showView(redirectView), 2200);
            }

            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    setupSubmit("parent-form", "parent-success");
    setupSubmit("therapist-form", "therapist-success");


    /* ---------------------------------------------
       “Find Match” – Demo Result Page
    --------------------------------------------- */

    const findBtn = document.getElementById("btn-find-match");
    if (findBtn) {
        findBtn.addEventListener("click", () => {
            showView("match-results");
        });
    }


    /* ---------------------------------------------
       Therapist Card Buttons
    --------------------------------------------- */

    document.addEventListener("click", e => {
        const btn = e.target.closest(".btn-request");
        const details = e.target.closest(".btn-details");

        if (btn) {
            alert("הודעה נשלחה למטפל 📩\nנעדכן אותך ברגע שהוא יאשר.");
        }

        if (details) {
            alert("כאן יוצגו בהמשך פרטי מטפל מלאים:\nהשכלה, ניסיון, עלויות, שעות קבלה ועוד.");
        }
    });

});
