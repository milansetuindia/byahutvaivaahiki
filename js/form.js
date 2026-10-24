
/* ==========================================================
                        FORM.JS
                   JAISWAL VAIVAAHIKI

                  ENGLISH ONLY VERSION

                   TWO PDF TEMPLATES
                     10 FORM STEPS

                   BAAN DETAILS ADDED
========================================================== */


/* ==========================================================
                    GLOBAL VARIABLES
========================================================== */

let currentStep = 1;

const totalSteps = 10;


/* ==========================================================
                    COMPLETE BIODATA
========================================================== */

const biodata = {

    personal: {},

    education: {},

    work: {},

    family: {},

    baan: {},

    partner: {},

    contact: {
        mobileNumber: "",
        currentAddress: "",
        permanentAddress: ""
    },

    declaration: {
        declaration: "",
        senderName: "",
        senderMobile: ""
    },

    photos: {},

    template: "template1"

};


/* ==========================================================
                    FORM CONFIGURATION
========================================================== */

const FORM_CONFIG = {
    totalSteps: 10,
    version: "2.0.0",
    autoSave: false,
    debug: false,
    allowedTemplates: ["template1", "template2"]
};


/* ==========================================================
                    DOM INITIALIZATION
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeForm();

    initializeCreateBiodataButton();

    initializeTemplateCardSelection();

    debugLog("Form Module", "Initialized Successfully");

});


/* ==========================================================
                    INITIALIZE FORM
========================================================== */

function initializeForm() {

    const nextButton =
        document.getElementById("nextStepBtn");

    const previousButton =
        document.getElementById("previousStepBtn");

    if (nextButton) {
        nextButton.addEventListener("click", nextStep);
    }

    if (previousButton) {
        previousButton.addEventListener("click", previousStep);
    }

    showStep(currentStep);
}


/* ==========================================================
                    SHOW FORM STEP
========================================================== */

function showStep(step) {

    if (step < 1 || step > totalSteps) {
        return;
    }

    currentStep = step;

    const steps =
        document.querySelectorAll(".form-step");

    steps.forEach(section => {

        section.classList.add("d-none");

        section.classList.remove("active-step");

    });

    const currentSection = document.querySelector(
        `.form-step[data-step="${step}"]`
    );

    if (currentSection) {

        currentSection.classList.remove("d-none");

        currentSection.classList.add("active-step");

    }

    updateProgressBar();

    updateNavigationButtons();

    updateSelectedTemplateCard();

    const formSection =
        document.getElementById("biodataFormSection");

    if (
        formSection &&
        !formSection.classList.contains("d-none")
    ) {

        const navbarHeight =
            document.querySelector(".custom-navbar")
                ?.offsetHeight || 90;

        const topPosition =
            formSection.getBoundingClientRect().top +
            window.scrollY -
            navbarHeight -
            10;

        window.scrollTo({
            top: Math.max(0, topPosition),
            behavior: "smooth"
        });

    }
}


/* ==========================================================
                    NEXT STEP
========================================================== */

function nextStep() {

    if (currentStep < 1 || currentStep > totalSteps) {
        return;
    }

    /* Validate current step */

    if (
        typeof validateCurrentStep === "function" &&
        !validateCurrentStep(currentStep)
    ) {
        return;
    }

    /* Save current step */

    switch (currentStep) {

        case 1:
            savePersonalData();
            break;

        case 2:
            // Education & Career share the same visible step.
            saveEducationData();
            saveWorkData();
            break;

        case 3:
            saveFamilyData();
            break;

        case 4:
            // All five Baan fields are optional.
            saveBaanData();
            break;

        case 5:
            savePartnerData();
            break;

        case 6:
            saveContactData();
            break;

        case 7:
            if (
                typeof savePhotoData === "function" &&
                !savePhotoData()
            ) {
                return;
            }
            break;

        case 8:
            saveDeclarationData();

            if (
                typeof validateCompleteForm === "function" &&
                !validateCompleteForm()
            ) {
                return;
            }
            break;

        case 9:
            if (!saveSelectedTemplate()) {
                return;
            }

            saveAllFormData();

            populateReview();
            break;

        case 10:
            completeForm();
            return;

    }

    /* Auto save */

    if (typeof saveBiodata === "function") {
        saveBiodata();
    }

    /* Move forward */

    if (currentStep < totalSteps) {

        currentStep++;

        showStep(currentStep);

    }
}


/* ==========================================================
                    PREVIOUS STEP
========================================================== */

function previousStep() {

    if (currentStep <= 1) {
        return;
    }

    currentStep--;

    showStep(currentStep);
}


/* ==========================================================
                    UPDATE PROGRESS BAR
========================================================== */

function updateProgressBar() {

    const progressBar =
        document.getElementById("formProgressBar");

    if (!progressBar) {
        return;
    }

    const percentage =
        (currentStep / totalSteps) * 100;

    progressBar.style.width = percentage + "%";

    progressBar.textContent =
        currentStep + " / " + totalSteps;
}


/* ==========================================================
                    NAVIGATION BUTTONS
                    ENGLISH ONLY
========================================================== */

function updateNavigationButtons() {

    const previousButton =
        document.getElementById("previousStepBtn");

    const nextButton =
        document.getElementById("nextStepBtn");

    if (previousButton) {

        previousButton.disabled =
            currentStep === 1;

    }

    if (nextButton) {

        if (currentStep === totalSteps) {

            nextButton.innerHTML = `
                Finish
                <i class="fa-solid fa-check"></i>
            `;

        } else {

            nextButton.innerHTML = `
                Next
                <i class="fa-solid fa-arrow-right"></i>
            `;

        }
    }
}


/* ==========================================================
                    GET INPUT VALUE
========================================================== */

function getInputValue(id) {

    const element =
        document.getElementById(id);

    if (!element) {
        return "";
    }

    if (element.type === "checkbox") {
        return element.checked ? element.value : "";
    }

    return String(element.value || "").trim();
}


/* ==========================================================
                    SAVE PERSONAL DATA
========================================================== */

function savePersonalData() {

    const birthHour = getInputValue("birthHour");

    const birthMinute = getInputValue("birthMinute");

    const birthPeriod = getInputValue("birthPeriod");

    let timeOfBirth = "";

    if (birthHour && birthMinute) {

        timeOfBirth =
            birthHour + ":" + birthMinute +
            (birthPeriod ? " " + birthPeriod : "");

    }

    biodata.personal = {

        fullName: getInputValue("fullName"),

        dob: getInputValue("dob"),

        timeOfBirth: timeOfBirth,

        placeOfBirth: getInputValue("placeOfBirth"),

        religion: getInputValue("religion"),

        gotra: getInputValue("gotra"),

        caste: getInputValue("caste"),

        rashi: getInputValue("rashi"),

        gan: getInputValue("gan"),

        height: getInputValue("height"),

        complexion: getInputValue("complexion"),

        maritalStatus: getInputValue("maritalStatus"),

        manglik: getInputValue("manglik"),

        nativePlace: getInputValue("nativePlace"),

        // This is the person's spoken language,
        // not the website interface language.

        language: getInputValue("language"),

        diet: getInputValue("diet"),

        hobbies: getInputValue("hobbies"),

        other: getInputValue("other")

    };

    debugLog("Personal Data Saved", biodata.personal);
}


/* ==========================================================
                    SAVE EDUCATION DATA
========================================================== */

function saveEducationData() {

    biodata.education = {

        highestQualification:
            getInputValue("highestQualification"),

        college:
            getInputValue("college"),

        Board12th:
            getInputValue("Board12th"),

        Board10th:
            getInputValue("Board10th")

    };

    debugLog("Education Data Saved", biodata.education);
}


/* ==========================================================
                    SAVE WORK & CAREER
========================================================== */

function saveWorkData() {

    biodata.work = {

        // These two fields appear inside Education & Career
        // in HTML, but remain in biodata.work for
        // compatibility with preview.js.

        profession:
            getInputValue("profession"),

        income:
            getInputValue("income")

    };

    debugLog("Work Data Saved", biodata.work);
}


/* ==========================================================
                    SAVE FAMILY DATA
========================================================== */

function saveFamilyData() {

    biodata.family = {

        fatherName:
            getInputValue("fatherName"),

        fatherOccupation:
            getInputValue("fatherOccupation"),

        motherName:
            getInputValue("motherName"),

        motherOccupation:
            getInputValue("motherOccupation"),

        siblingsDetails:
            getInputValue("siblingsDetails")

    };

    // Baan is now a separate Step 4.

    debugLog("Family Data Saved", biodata.family);
}


/* ==========================================================
                    SAVE BAAN DETAILS
========================================================== */

function saveBaanData() {

    biodata.baan = {

        mulbaan:
            getInputValue("mulbaan"),

        ajiaur:
            getInputValue("ajiaur"),

        naniaur:
            getInputValue("naniaur"),

        sasural:
            getInputValue("sasural"),

        sasKeNaihar:
            getInputValue("sasKeNaihar")

    };

    debugLog("Baan Details Saved", biodata.baan);
}


/* ==========================================================
                    SAVE PARTNER PREFERENCE
========================================================== */

function savePartnerData() {

    biodata.partner = {

        preferredQualification:
            getInputValue("preferredQualification"),

        preferredProfession:
            getInputValue("preferredProfession"),

        preferredLocation:
            getInputValue("preferredLocation"),

        preferredCaste:
            getInputValue("preferredCaste"),

        otherExpectations:
            getInputValue("otherExpectations")

    };

    debugLog(
        "Partner Preferences Saved",
        biodata.partner
    );
}


/* ==========================================================
                    SAVE CONTACT DETAILS
========================================================== */

function saveContactData() {

    biodata.contact = {

        mobileNumber:
            getInputValue("mobileNumber"),

        currentAddress:
            getInputValue("currentAddress"),

        permanentAddress:
            getInputValue("permanentAddress")

    };

    debugLog("Contact Data Saved", biodata.contact);
}


/* ==========================================================
                    SAVE DECLARATION DETAILS
========================================================== */

function saveDeclarationData() {

    biodata.declaration = {

        declaration:
            getInputValue("declaration"),

        senderName:
            getInputValue("senderName"),

        senderMobile:
            getInputValue("senderMobile")

    };

    debugLog(
        "Declaration Data Saved",
        biodata.declaration
    );
}


/* ==========================================================
                    SAVE SELECTED TEMPLATE

                    ONLY TEMPLATE 1 & 2
========================================================== */

function saveSelectedTemplate() {

    const selectedTemplate = document.querySelector(
        'input[name="biodataTemplate"]:checked'
    );

    if (!selectedTemplate) {

        alert("Please select a biodata template.");

        return false;
    }

    const templateId = selectedTemplate.value;

    if (!FORM_CONFIG.allowedTemplates.includes(templateId)) {

        alert("Invalid template selected.");

        return false;
    }

    biodata.template = templateId;

    debugLog("Template Selected", biodata.template);

    return true;
}


/* ==========================================================
                    SAVE ALL FORM DATA

                 SHARED BY BOTH TEMPLATES
========================================================== */

function saveAllFormData() {

    savePersonalData();

    saveEducationData();

    saveWorkData();

    saveFamilyData();

    saveBaanData();

    savePartnerData();

    saveContactData();

    saveDeclarationData();

    const selectedTemplate = document.querySelector(
        'input[name="biodataTemplate"]:checked'
    );

    if (
        selectedTemplate &&
        FORM_CONFIG.allowedTemplates.includes(
            selectedTemplate.value
        )
    ) {

        biodata.template = selectedTemplate.value;

    }

    if (typeof saveBiodata === "function") {
        saveBiodata();
    }
}


/* ==========================================================
                    REVIEW PAGE
========================================================== */

function populateReview() {

    fillReviewSection(
        "reviewPersonal",
        biodata.personal
    );

    // The template has one Education & Career section.
    // Combine both existing biodata objects for display.

    fillReviewSection(
        "reviewEducation",
        {
            highestQualification:
                biodata.education.highestQualification,

            college:
                biodata.education.college,

            Board12th:
                biodata.education.Board12th,

            Board10th:
                biodata.education.Board10th,

            profession:
                biodata.work.profession,

            income:
                biodata.work.income
        }
    );

    // Backward compatibility with older index.html versions.
    // Do not display Work & Career twice.

    const legacyWorkReview =
        document.getElementById("reviewWork");

    if (legacyWorkReview) {

        legacyWorkReview.replaceChildren();

        const legacyWorkCard =
            legacyWorkReview.closest(".col-lg-6");

        if (legacyWorkCard) {
            legacyWorkCard.style.display = "none";
        }
    }

    fillReviewSection(
        "reviewFamily",
        biodata.family
    );

    fillReviewSection(
        "reviewBaan",
        biodata.baan
    );

    fillReviewSection(
        "reviewPartner",
        biodata.partner
    );

    fillReviewSection(
        "reviewContact",
        {
            mobileNumber:
                biodata.contact.mobileNumber
        }
    );

    fillReviewSection(
        "reviewAddress",
        {
            currentAddress:
                biodata.contact.currentAddress,

            permanentAddress:
                biodata.contact.permanentAddress
        }
    );

    fillReviewSection(
        "reviewDeclaration",
        biodata.declaration
    );

    populatePhotoReview();

    if (typeof renderPreviewContainer === "function") {
        renderPreviewContainer();
    }

    debugLog("Review Page Populated", biodata);
}


/* ==========================================================
                    REVIEW VALUE FORMAT
                    ENGLISH ONLY
========================================================== */

function formatReviewValue(key, value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "-";
    }

    return String(value);
}


/* ==========================================================
                    REVIEW HELPER

              SAFE TEXT RENDERING
========================================================== */

function fillReviewSection(containerId, data) {

    const container =
        document.getElementById(containerId);

    if (!container) {
        return;
    }

    container.replaceChildren();

    if (!data || Object.keys(data).length === 0) {

        const message = document.createElement("p");

        message.textContent = "No data available.";

        container.appendChild(message);

        return;
    }

    Object.entries(data).forEach(([key, value]) => {

        const item = document.createElement("div");

        item.className = "review-item";

        const label = document.createElement("strong");

        label.textContent = formatLabel(key) + ": ";

        const text = document.createElement("span");

        text.textContent = formatReviewValue(key, value);

        item.appendChild(label);

        item.appendChild(text);

        container.appendChild(item);

    });
}


/* ==========================================================
                    PHOTO REVIEW
========================================================== */

function populatePhotoReview() {

    const container =
        document.getElementById("reviewPhotos");

    if (!container) {
        return;
    }

    container.replaceChildren();

    const profilePhoto =
        biodata.photos?.profilePhoto?.preview;

    if (!profilePhoto) {

        const message = document.createElement("p");

        message.textContent = "No profile photo uploaded.";

        container.appendChild(message);

        return;
    }

    const image = document.createElement("img");

    image.src = profilePhoto;

    image.alt = "Profile Photo";

    image.className = "img-fluid rounded shadow-sm";

    container.appendChild(image);
}


/* ==========================================================
                    ENGLISH LABELS
                    NO LANGUAGE.JS REQUIRED
========================================================== */

const FORM_FIELD_LABELS = {

    /* PERSONAL */

    fullName: "Full Name",
    dob: "Date Of Birth",
    timeOfBirth: "Time Of Birth",
    placeOfBirth: "Place Of Birth",
    religion: "Religion",
    gotra: "Gotra",
    caste: "Caste",
    rashi: "Rashi",
    gan: "Gan",
    height: "Height",
    complexion: "Complexion",
    maritalStatus: "Marital Status",
    manglik: "Manglik",
    nativePlace: "Native Place",
    language: "Language",
    diet: "Diet",
    hobbies: "Hobby",
    other: "Others",

    /* EDUCATION */

    highestQualification: "Qualification",
    college: "College",
    Board12th: "12th Board",
    Board10th: "10th Board",

    /* WORK */

    profession: "Profession",
    income: "Annual Income",

    /* FAMILY */

    fatherName: "Father's Name",
    fatherOccupation: "Father's Occupation",
    motherName: "Mother's Name",
    motherOccupation: "Mother's Occupation",
    siblingsDetails: "Siblings Details",

    /* BAAN */

    mulbaan: "Mulbaan",
    ajiaur: "Ajiaur",
    naniaur: "Naniaur",
    sasural: "Sasural",
    sasKeNaihar: "Sas ke Naihar",

    /* PARTNER */

    preferredQualification: "Preferred Qualification",
    preferredProfession: "Preferred Profession",
    preferredLocation: "Preferred Location",
    preferredCaste: "Preferred Caste",
    otherExpectations: "Other Expectations",

    /* CONTACT */

    mobileNumber: "Mobile Number",

    /* ADDRESS */

    currentAddress: "Current Address",
    permanentAddress: "Permanent Address",

    /* DECLARATION */

    declaration: "Declaration",
    senderName: "Sender Name",
    senderMobile: "Sender Mobile"

};


/* ==========================================================
                    FORMAT FIELD LABEL
========================================================== */

function formatLabel(key) {

    if (FORM_FIELD_LABELS[key]) {
        return FORM_FIELD_LABELS[key];
    }

    return String(key)
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, char => char.toUpperCase());
}


/* ==========================================================
                    OPEN BIODATA FORM
========================================================== */

function initializeCreateBiodataButton() {

    const heroButton =
        document.getElementById("createBiodataBtn");

    const previewButton =
        document.getElementById("previewCreateBtn");

    if (heroButton) {

        heroButton.addEventListener(
            "click",
            openBiodataForm
        );

    }

    if (previewButton) {

        previewButton.addEventListener(
            "click",
            openBiodataForm
        );

    }
}


/* ==========================================================
                    OPEN BIODATA FORM
========================================================== */

function openBiodataForm() {

    const landingSections = [
        "hero",
        "features",
        "support",
        "join-portal",
        "preview",
        "how-it-works",
        "faq",
        "footer"
    ];

    landingSections.forEach(hideSection);

    const formSection =
        document.getElementById("biodataFormSection");

    if (formSection) {

        formSection.classList.remove("d-none");

        formSection.style.display = "";

    }

    currentStep = 1;

    showStep(currentStep);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* ==========================================================
                    HIDE SECTION
========================================================== */

function hideSection(id) {

    const section = document.getElementById(id);

    if (section) {
        section.style.display = "none";
    }
}


/* ==========================================================
                    SHOW SECTION
========================================================== */

function showSection(id) {

    const section = document.getElementById(id);

    if (section) {
        section.style.display = "";
    }
}


/* ==========================================================
                    RETURN TO HOME PAGE
========================================================== */

function returnToLandingPage() {

    const landingSections = [
        "hero",
        "features",
        "support",
        "join-portal",
        "preview",
        "how-it-works",
        "faq",
        "footer"
    ];

    landingSections.forEach(showSection);

    const formSection =
        document.getElementById("biodataFormSection");

    if (formSection) {
        formSection.classList.add("d-none");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* ==========================================================
                    RESET COMPLETE FORM
========================================================== */

function resetCompleteForm() {

    const form =
        document.querySelector("#multiStepForm");

    if (form) {

        // multiStepForm is a <div>, not an HTML <form>.
        // Reset each field without calling form.reset().

        form.querySelectorAll("input, select, textarea")
            .forEach(field => {

                if (field.type === "file") {

                    field.value = "";

                } else if (
                    field.type === "checkbox" ||
                    field.type === "radio"
                ) {

                    field.checked = field.defaultChecked;

                } else {

                    field.value = field.defaultValue;

                }

            });
    }

    resetFormData();

    // Keep photo state synchronized.

    if (typeof clearGallery === "function") {
        clearGallery();
    }

    if (typeof clearAllErrors === "function") {
        clearAllErrors();
    }

    const firstTemplate = document.querySelector(
        'input[name="biodataTemplate"][value="template1"]'
    );

    if (firstTemplate) {
        firstTemplate.checked = true;
    }

    updateSelectedTemplateCard();

    currentStep = 1;

    showStep(currentStep);
}


/* ==========================================================
                    RESET BIODATA OBJECT
========================================================== */

function resetFormData() {

    biodata.personal = {};

    biodata.education = {};

    biodata.work = {};

    biodata.family = {};

    biodata.baan = {};

    biodata.partner = {};

    biodata.contact = {
        mobileNumber: "",
        currentAddress: "",
        permanentAddress: ""
    };

    biodata.declaration = {
        declaration: "",
        senderName: "",
        senderMobile: ""
    };

    biodata.photos = {};

    biodata.template = "template1";

}


/* ==========================================================
                    FORM COMPLETED
========================================================== */

function completeForm() {

    saveAllFormData();

    debugLog("Biodata Form Completed", {
        template: biodata.template
    });

}


/* ==========================================================
                    SAFE GET ELEMENT
========================================================== */

function safeElement(id) {

    const element =
        document.getElementById(id);

    if (!element && FORM_CONFIG.debug) {
        console.warn("Element not found:", id);
    }

    return element;
}


/* ==========================================================
                    DEBUG LOGGER
========================================================== */

function debugLog(title, data) {

    if (!FORM_CONFIG.debug) {
        return;
    }

    console.group(title);

    console.log(data);

    console.groupEnd();
}


/* ==========================================================
                    EXPORT FORM DATA
========================================================== */

function exportFormData() {

    return JSON.parse(
        JSON.stringify(biodata)
    );
}


/* ==========================================================
                    TEMPLATE CARD SELECTION
========================================================== */

function initializeTemplateCardSelection() {

    const templateCards =
        document.querySelectorAll(".template-option");

    templateCards.forEach(card => {

        const radio = card.querySelector(
            'input[name="biodataTemplate"]'
        );

        if (!radio) {
            return;
        }

        /* Only allow two templates */

        if (
            !FORM_CONFIG.allowedTemplates.includes(
                radio.value
            )
        ) {

            card.style.display = "none";

            return;
        }

        card.addEventListener("click", event => {

            if (
                event.target === radio ||
                event.target.closest("label")
            ) {

                updateSelectedTemplateCard();

                return;
            }

            radio.checked = true;

            radio.dispatchEvent(
                new Event("change", {
                    bubbles: true
                })
            );

        });

        radio.addEventListener("change", () => {

            if (radio.checked) {

                biodata.template = radio.value;

                if (typeof saveBiodata === "function") {
                    saveBiodata();
                }

            }

            updateSelectedTemplateCard();

        });

    });

    updateSelectedTemplateCard();
}


/* ==========================================================
                    UPDATE SELECTED CARD STYLE
========================================================== */

function updateSelectedTemplateCard() {

    const cards =
        document.querySelectorAll(".template-option");

    cards.forEach(card => {

        const radio = card.querySelector(
            'input[name="biodataTemplate"]'
        );

        if (
            radio &&
            radio.checked &&
            FORM_CONFIG.allowedTemplates.includes(
                radio.value
            )
        ) {

            card.classList.add("selected");

        } else {

            card.classList.remove("selected");

        }

    });
}


/* ==========================================================
                    END OF FORM.JS
========================================================== */






