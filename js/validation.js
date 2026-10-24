
/*==========================================================
                    VALIDATION.JS
        STEP 1 - MODULE SETUP & CONFIGURATION

                JAISWAL VAIVAAHIKI
                  ENGLISH ONLY
                 10 FORM STEPS
               TWO PDF TEMPLATES
==========================================================*/


/*
============================================================
                VALIDATION CONFIGURATION
============================================================
*/

const VALIDATION = {

    debug: false,

    mobileLength: 10,

    minimumIncome: 1,

    maximumImageSize: 5 * 1024 * 1024,

    supportedImageTypes: [

        "image/jpeg",

        "image/jpg",

        "image/png",

        "image/webp"

    ]

};


/*
============================================================
                VALIDATION STATE
============================================================
*/

const VALIDATION_STATE = {

    initialized: false,

    currentStepValid: false,

    completeFormValid: false

};


/*
============================================================
                ERROR MESSAGES
============================================================
*/

const VALIDATION_MESSAGES = {

    required: "This field is required.",

    name: "Please enter a valid name.",

    mobile: "Enter a valid 10-digit Indian mobile number.",

    income: "Enter a valid income.",

    date: "Please select a valid date.",

    futureDate: "Future date is not allowed.",

    number: "Only numeric values are allowed.",

    photo: "Please upload a profile photo.",

    imageType: "Only JPG, JPEG, PNG and WEBP images are allowed.",

    imageSize: "Image size must not exceed 5 MB.",

    time: "Please select a complete time of birth.",

    length: "The maximum character limit has been exceeded."

};


/*
============================================================
                INITIALIZATION
============================================================
*/

document.addEventListener("DOMContentLoaded", () => {

    initializeValidation();

});


/*
============================================================
                INITIALIZE MODULE
============================================================
*/

function initializeValidation() {

    VALIDATION_STATE.initialized = true;

    validationLog(
        "Validation Module Initialized"
    );

}


/*
============================================================
                DEBUG LOGGER
============================================================
*/

function validationLog(message, data = "") {

    if (!VALIDATION.debug) {

        return;

    }

    console.group("[Validation]");

    console.log(message);

    if (data !== "") {

        console.log(data);

    }

    console.groupEnd();

}


/*
============================================================
                HELPER FUNCTIONS
============================================================
*/


/*
============================================================
                GET ELEMENT
============================================================
*/

function getField(id) {

    return document.getElementById(id);

}


/*
============================================================
                GET VALUE
============================================================
*/

function getValue(id) {

    const element = getField(id);

    if (!element) {

        return "";

    }

    return String(element.value || "").trim();

}


/*
============================================================
                CHECK EMPTY
============================================================
*/

function isEmpty(value) {

    return String(value ?? "").trim() === "";

}


/*
============================================================
                SHOW ALERT
============================================================
*/

function validationMessage(message) {

    alert(message);

}


/*
============================================================
                EXPORT FUNCTIONS
============================================================
*/

window.getValue = getValue;

window.getField = getField;

window.isEmpty = isEmpty;



/*==========================================================
        STEP 2 - COMMON VALIDATION FUNCTIONS
==========================================================*/


/*
============================================================
                VALIDATE ANNUAL INCOME
============================================================
*/

function isValidIncome(value) {

    const incomeText =
        String(value ?? "").trim();

    if (incomeText === "") {

        return false;

    }

    /*
    ========================================================
        Accept common income formats:

        500000
        5,00,000
        ₹500000
        5 LPA
        5 Lakhs
        50,000 per month

        Income is descriptive in the biodata form.
    ========================================================
    */

    if (incomeText.length > 25) {

        return false;

    }

    return /[\p{L}\p{N}]/u.test(incomeText);

}


/*
============================================================
                VALIDATE NUMERIC VALUE
============================================================
*/

function isValidNumber(value) {

    const pattern = /^[0-9]+$/;

    return pattern.test(
        String(value ?? "").trim()
    );

}


/*
============================================================
                VALIDATE DATE
============================================================
*/

function isValidDate(value) {

    const dateString =
        String(value ?? "").trim();

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {

        return false;

    }

    const parts = dateString.split("-");

    const year = Number(parts[0]);

    const month = Number(parts[1]);

    const day = Number(parts[2]);

    const selectedDate =
        new Date(year, month - 1, day);

    /*
    ========================================================
        Check that the date actually exists.

        For example, 2026-02-30 must be rejected.
    ========================================================
    */

    if (
        selectedDate.getFullYear() !== year ||
        selectedDate.getMonth() !== month - 1 ||
        selectedDate.getDate() !== day
    ) {

        return false;

    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return selectedDate <= today;

}


/*
============================================================
                VALIDATE HEIGHT
============================================================
*/

function isValidHeight(value) {

    return String(value ?? "").trim() !== "";

}


/*
============================================================
                VALIDATE MAX LENGTH
============================================================
*/

function isValidLength(value, maxLength) {

    return (
        String(value ?? "").trim().length <= maxLength
    );

}


/*
============================================================
                VALIDATE PHOTO
============================================================
*/

function isValidPhoto() {

    return Boolean(
        typeof biodata !== "undefined" &&
        biodata.photos &&
        biodata.photos.profilePhoto &&
        biodata.photos.profilePhoto.preview
    );

}


/*
============================================================
                VALIDATE IMAGE TYPE
============================================================
*/

function isValidImageType(file) {

    if (!file) {

        return false;

    }

    return VALIDATION.supportedImageTypes.includes(
        file.type
    );

}


/*
============================================================
                VALIDATE IMAGE SIZE
============================================================
*/

function isValidImageSize(file) {

    if (!file) {

        return false;

    }

    return (
        file.size > 0 &&
        file.size <= VALIDATION.maximumImageSize
    );

}


/*
============================================================
                VALIDATE REQUIRED FIELD
============================================================
*/

function isRequired(id) {

    return !isEmpty(getValue(id));

}




/*
============================================================
                VALIDATE OPTIONAL FIELD LENGTH
============================================================
*/

function validateOptionalLength(id, maxLength) {

    const field = getField(id);

    if (!field) {

        return true;

    }

    const value = getValue(id);

    if (isEmpty(value)) {

        clearError(id);

        return true;

    }

    if (!isValidLength(value, maxLength)) {

        showError(
            id,
            `Maximum ${maxLength} characters allowed.`
        );

        return false;

    }

    clearError(id);

    return true;

}


/*
============================================================
                EXPORT FUNCTIONS
============================================================
*/

window.isValidIncome = isValidIncome;

window.isValidNumber = isValidNumber;

window.isValidDate = isValidDate;

window.isValidHeight = isValidHeight;

window.isValidPhoto = isValidPhoto;

window.isRequired = isRequired;




/*
============================================================
                CHARACTER COUNTER
============================================================
*/

function initializeCharacterCounter(
    id,
    maxLength,
    type = "characters"
) {

    const field = document.getElementById(id);

    const counter =
        document.getElementById(id + "Counter");

    if (!field || !counter) {

        return;

    }

    /*
    ========================================================
        Prevent duplicate event listeners.
    ========================================================
    */

    if (
        field.dataset.characterCounterInitialized ===
        "true"
    ) {

        return;

    }

    field.dataset.characterCounterInitialized = "true";

    function updateCounter() {

        const remaining =
            maxLength - field.value.length;

        counter.textContent =
            remaining + " " + type + " remaining";

        if (remaining <= 10) {

            counter.classList.remove(
                "text-muted"
            );

            counter.classList.add(
                "text-danger"
            );

        } else {

            counter.classList.remove(
                "text-danger"
            );

            counter.classList.add(
                "text-muted"
            );

        }

    }

    field.addEventListener(
        "input",
        updateCounter
    );

    field.addEventListener(
        "change",
        updateCounter
    );

    updateCounter();

}



/*==========================================================
            STEP 3 - ERROR DISPLAY FUNCTIONS
==========================================================*/


/*
============================================================
                SHOW ERROR
============================================================
*/

function showError(id, message) {

    const field = getField(id);

    if (!field) {

        return;

    }

    field.classList.remove("is-valid");

    field.classList.add("is-invalid");

    field.setAttribute(
        "aria-invalid",
        "true"
    );

    /*
    ========================================================
        Use the field's next sibling only.

        This prevents accidentally overwriting an
        error belonging to a different input.
    ========================================================
    */

    let error = field.nextElementSibling;

    if (
        !error ||
        !error.classList.contains("invalid-feedback")
    ) {

        error = document.createElement("div");

        error.className = "invalid-feedback";

        field.insertAdjacentElement(
            "afterend",
            error
        );

    }

    error.textContent = message;

    validationLog(
        "Field validation error",
        {
            field: id,
            message: message
        }
    );

}


/*
============================================================
                SHOW SUCCESS
============================================================
*/

function showSuccess(id) {

    const field = getField(id);

    if (!field) {

        return;

    }

    field.classList.remove("is-invalid");

    field.classList.add("is-valid");

    field.removeAttribute("aria-invalid");

    const error = field.nextElementSibling;

    if (
        error &&
        error.classList.contains("invalid-feedback")
    ) {

        error.remove();

    }

}


/*
============================================================
                CLEAR ERROR
============================================================
*/

function clearError(id) {

    const field = getField(id);

    if (!field) {

        return;

    }

    field.classList.remove("is-invalid");

    field.classList.remove("is-valid");

    field.removeAttribute("aria-invalid");

    const error = field.nextElementSibling;

    if (
        error &&
        error.classList.contains("invalid-feedback")
    ) {

        error.remove();

    }

}


/*
============================================================
                CLEAR ALL ERRORS
============================================================
*/

function clearAllErrors() {

    const fields = document.querySelectorAll(
        "input, select, textarea"
    );

    fields.forEach(field => {

        field.classList.remove("is-invalid");

        field.classList.remove("is-valid");

        field.removeAttribute("aria-invalid");

        const error = field.nextElementSibling;

        if (
            error &&
            error.classList.contains("invalid-feedback")
        ) {

            error.remove();

        }

    });

}


/*
============================================================
                EXPORT FUNCTIONS
============================================================
*/

window.showError = showError;

window.showSuccess = showSuccess;

window.clearError = clearError;

window.clearAllErrors = clearAllErrors;



/*==========================================================
            STEP 4 - PERSONAL DETAILS VALIDATION

                 HTML FORM STEP 1
                     ABOUT ME
==========================================================*/


/*
============================================================
                VALIDATE PERSONAL DETAILS
============================================================
*/

function validatePersonal() {

    let valid = true;

    /*
    ========================================================
                    FULL NAME
                    REQUIRED
    ========================================================
    */

    const fullName = getValue("fullName");

    if (isEmpty(fullName)) {

        showError(
            "fullName",
            "Full Name is required."
        );

        valid = false;

    } else if (
        !isValidLength(fullName, 20)
    ) {

        showError(
            "fullName",
            "Full Name cannot exceed 20 characters."
        );

        valid = false;

    } else {

        showSuccess("fullName");

    }


    /*
    ========================================================
                    DATE OF BIRTH
                    REQUIRED
    ========================================================
    */

    const dob = getValue("dob");

    if (isEmpty(dob)) {

        showError(
            "dob",
            "Date of Birth is required."
        );

        valid = false;

    } else if (!isValidDate(dob)) {

        showError(
            "dob",
            "Please select a valid date that is not in the future."
        );

        valid = false;

    } else {

        showSuccess("dob");

    }


    /*
    ========================================================
                    TIME OF BIRTH
                    OPTIONAL

        If entered, all three parts must be selected.
    ========================================================
    */

    const birthHour = getValue("birthHour");

    const birthMinute = getValue("birthMinute");

    const birthPeriod = getValue("birthPeriod");

    if (
        birthHour ||
        birthMinute ||
        birthPeriod
    ) {

        if (
            !birthHour ||
            !birthMinute ||
            !birthPeriod
        ) {

            if (!birthHour) {

                showError(
                    "birthHour",
                    VALIDATION_MESSAGES.time
                );

            } else {

                clearError("birthHour");

            }

            if (!birthMinute) {

                showError(
                    "birthMinute",
                    VALIDATION_MESSAGES.time
                );

            } else {

                clearError("birthMinute");

            }

            if (!birthPeriod) {

                showError(
                    "birthPeriod",
                    VALIDATION_MESSAGES.time
                );

            } else {

                clearError("birthPeriod");

            }

            valid = false;

        } else {

            clearError("birthHour");

            clearError("birthMinute");

            clearError("birthPeriod");

        }

    } else {

        clearError("birthHour");

        clearError("birthMinute");

        clearError("birthPeriod");

    }


    /*
    ========================================================
                    PLACE OF BIRTH
                    OPTIONAL
    ========================================================
    */

    if (!validateOptionalLength("placeOfBirth", 25)) {

        valid = false;

    }


    /*
    ========================================================
                    RELIGION
                    OPTIONAL
    ========================================================
    */

    if (!validateOptionalLength("religion", 20)) {

        valid = false;

    }


    /*
    ========================================================
                    GOTRA
                    OPTIONAL
    ========================================================
    */

    if (!validateOptionalLength("gotra", 20)) {

        valid = false;

    }


    /*
    ========================================================
                    CASTE
                    OPTIONAL
    ========================================================
    */

    clearError("caste");


    /*
    ========================================================
                    RASHI
                    OPTIONAL
    ========================================================
    */

    if (!validateOptionalLength("rashi", 20)) {

        valid = false;

    }


    /*
    ========================================================
                    GAN
                    OPTIONAL
    ========================================================
    */

    clearError("gan");


    /*
    ========================================================
                    MANGLIK STATUS
                    OPTIONAL
    ========================================================
    */

    clearError("manglik");


    /*
    ========================================================
                    MARITAL STATUS
                    OPTIONAL
    ========================================================
    */

    clearError("maritalStatus");


    /*
    ========================================================
                    DIET
                    OPTIONAL
    ========================================================
    */

    clearError("diet");


    /*
    ========================================================
                    HEIGHT
                    OPTIONAL
    ========================================================
    */

    if (!validateOptionalLength("height", 20)) {

        valid = false;

    }


    /*
    ========================================================
                    COMPLEXION
                    OPTIONAL
    ========================================================
    */

    if (!validateOptionalLength("complexion", 20)) {

        valid = false;

    }


    /*
    ========================================================
                    NATIVE PLACE
                    OPTIONAL
    ========================================================
    */

    if (!validateOptionalLength("nativePlace", 25)) {

        valid = false;

    }


    /*
    ========================================================
                    LANGUAGE
                    OPTIONAL
    ========================================================
    */

    if (!validateOptionalLength("language", 25)) {

        valid = false;

    }


    /*
    ========================================================
                    HOBBY
                    OPTIONAL
    ========================================================
    */

    if (!validateOptionalLength("hobbies", 25)) {

        valid = false;

    }


    /*
    ========================================================
                    OTHERS
                    OPTIONAL
    ========================================================
    */

    if (!validateOptionalLength("other", 25)) {

        valid = false;

    }

    return valid;

}


/*
============================================================
                EXPORT FUNCTION
============================================================
*/

window.validatePersonal = validatePersonal;



/*==========================================================
            STEP 5 - EDUCATION DETAILS VALIDATION

                   HTML FORM STEP 2
                 EDUCATION & CAREER
==========================================================*/


/*
============================================================
                VALIDATE EDUCATION DETAILS
============================================================
*/

function validateEducation() {

    let valid = true;

    /*
    ========================================================
                HIGHEST QUALIFICATION
    ========================================================
    */

    if (!validateOptionalLength("highestQualification", 25)) {

        valid = false;

    }


    /*
    ========================================================
                COLLEGE / UNIVERSITY
    ========================================================
    */

    if (!validateOptionalLength("college", 25)) {

        valid = false;

    }


    /*
    ========================================================
                    12th BOARD
    ========================================================
    */

    if (!validateOptionalLength("Board12th", 25)) {

        valid = false;

    }


    /*
    ========================================================
                    10th BOARD
    ========================================================
    */

    if (!validateOptionalLength("Board10th", 25)) {

        valid = false;

    }

    /*
    ========================================================
        Profession and Income appear in the same
        Education & Career form step.

        The separate validateWork() function is kept
        for compatibility with the original project.
    ========================================================
    */

    return valid;

}


/*
============================================================
                EXPORT FUNCTION
============================================================
*/

window.validateEducation = validateEducation;



/*==========================================================
            STEP 6 - FAMILY DETAILS VALIDATION

                   HTML FORM STEP 3
                     ABOUT FAMILY
==========================================================*/


/*
============================================================
                VALIDATE FAMILY DETAILS
============================================================
*/

function validateFamily() {

    let valid = true;

    /*
    ========================================================
                    FATHER'S NAME
    ========================================================
    */

    if (!validateOptionalLength("fatherName", 25)) {

        valid = false;

    }


    /*
    ========================================================
                FATHER'S OCCUPATION
    ========================================================
    */

    if (!validateOptionalLength("fatherOccupation", 25)) {

        valid = false;

    }


    /*
    ========================================================
                    MOTHER'S NAME
    ========================================================
    */

    if (!validateOptionalLength("motherName", 25)) {

        valid = false;

    }


    /*
    ========================================================
                MOTHER'S OCCUPATION
    ========================================================
    */

    if (!validateOptionalLength("motherOccupation", 25)) {

        valid = false;

    }


    /*
    ========================================================
                    SIBLINGS DETAILS
    ========================================================
    */

    if (!validateOptionalLength("siblingsDetails", 40)) {

        valid = false;

    }

    return valid;

}


/*
============================================================
                EXPORT FUNCTION
============================================================
*/

window.validateFamily = validateFamily;



/*==========================================================
            STEP 7 - BAAN DETAILS VALIDATION

                  HTML FORM STEP 4

                  DETAILS OF BAAN
               ALL FIELDS OPTIONAL
==========================================================*/


/*
============================================================
                VALIDATE BAAN DETAILS
============================================================
*/

function validateBaan() {

    let valid = true;

    /*
    ========================================================
                    MULBAAN
    ========================================================
    */

    if (!validateOptionalLength("mulbaan", 25)) {

        valid = false;

    }


    /*
    ========================================================
                    AJIAUR
    ========================================================
    */

    if (!validateOptionalLength("ajiaur", 25)) {

        valid = false;

    }


    /*
    ========================================================
                    NANIAUR
    ========================================================
    */

    if (!validateOptionalLength("naniaur", 25)) {

        valid = false;

    }


    /*
    ========================================================
                    SASURAL
    ========================================================
    */

    if (!validateOptionalLength("sasural", 25)) {

        valid = false;

    }


    /*
    ========================================================
                    SAS KE NAIHAR
    ========================================================
    */

    if (!validateOptionalLength("sasKeNaihar", 25)) {

        valid = false;

    }

    return valid;

}


/*
============================================================
                EXPORT FUNCTION
============================================================
*/

window.validateBaan = validateBaan;



/*==========================================================
            STEP 8 - WORK & CAREER VALIDATION

            INCLUDED IN HTML FORM STEP 2
==========================================================*/


/*
============================================================
                VALIDATE WORK & CAREER
============================================================
*/

function validateWork() {

    let valid = true;

    /*
    ========================================================
                    PROFESSION
                    OPTIONAL
    ========================================================
    */

    if (!validateOptionalLength("profession", 25)) {

        valid = false;

    }


    /*
    ========================================================
                    INCOME
                    OPTIONAL

        Income is a descriptive text field,
        so formats such as ₹5 LPA are permitted.
    ========================================================
    */

    const income = getValue("income");

    if (isEmpty(income)) {

        clearError("income");

    } else if (
        !isValidLength(income, 25) ||
        !isValidIncome(income)
    ) {

        showError(
            "income",
            "Please enter a valid income within 25 characters."
        );

        valid = false;

    } else {

        clearError("income");

    }

    return valid;

}


/*
============================================================
                EXPORT FUNCTION
============================================================
*/

window.validateWork = validateWork;



/*==========================================================
            STEP 9 - PARTNER PREFERENCE VALIDATION

                   HTML FORM STEP 5
==========================================================*/


/*
============================================================
                VALIDATE PARTNER PREFERENCE
============================================================
*/

function validatePartner() {

    let valid = true;

    /*
    ========================================================
                PREFERRED QUALIFICATION
    ========================================================
    */

    if (!validateOptionalLength("preferredQualification", 25)) {

        valid = false;

    }


    /*
    ========================================================
                PREFERRED PROFESSION
    ========================================================
    */

    if (!validateOptionalLength("preferredProfession", 25)) {

        valid = false;

    }


    /*
    ========================================================
                PREFERRED LOCATION
    ========================================================
    */

    if (!validateOptionalLength("preferredLocation", 25)) {

        valid = false;

    }


    /*
    ========================================================
                PREFERRED CASTE
    ========================================================
    */

    if (!validateOptionalLength("preferredCaste", 25)) {

        valid = false;

    }


    /*
    ========================================================
                    OTHERS
    ========================================================
    */

    if (!validateOptionalLength("otherExpectations", 25)) {

        valid = false;

    }

    return valid;

}


/*
============================================================
                EXPORT FUNCTION
============================================================
*/

window.validatePartner = validatePartner;



/*==========================================================
            STEP 10 - CONTACT DETAILS VALIDATION

                   HTML FORM STEP 6
                CONTACT AND ADDRESS
==========================================================*/


/*
============================================================
                VALIDATE CONTACT DETAILS
============================================================
*/

function validateContact() {

    let valid = true;

    /*
    ========================================================
                    MOBILE NUMBER
                    REQUIRED
    ========================================================
    */

    const mobile = getValue("mobileNumber");

    if (isEmpty(mobile)) {

        showError(
            "mobileNumber",
            "Contact Number is required."
        );

        valid = false;

    } else {

        showSuccess("mobileNumber");

    }


    /*
    ========================================================
                    CURRENT ADDRESS
                    OPTIONAL
    ========================================================
    */

    if (!validateOptionalLength("currentAddress", 75)) {

        valid = false;

    }


    /*
    ========================================================
                    PERMANENT ADDRESS
                    OPTIONAL
    ========================================================
    */

    if (!validateOptionalLength("permanentAddress", 75)) {

        valid = false;

    }

    return valid;

}


/*
============================================================
                EXPORT FUNCTION
============================================================
*/

window.validateContact = validateContact;



/*==========================================================
            STEP 11 - DECLARATION VALIDATION

                   HTML FORM STEP 8
              DECLARATION & CONSENT
==========================================================*/


/*
============================================================
                VALIDATE DECLARATION
                AND SENDER DETAILS
============================================================
*/

function validateDeclaration() {

    let valid = true;

    /*
    ========================================================
                    DECLARATION

        The current index.html uses a readonly
        declaration textarea.

        Its text must remain present.
    ========================================================
    */

    const declaration = getValue("declaration");

    if (
        getField("declaration") &&
        isEmpty(declaration)
    ) {

        showError(
            "declaration",
            "Declaration text is required."
        );

        valid = false;

    } else {

        clearError("declaration");

    }


    /*
    ========================================================
                    SENDER'S NAME
                    REQUIRED
    ========================================================
    */

    const senderName = getValue("senderName");

    if (isEmpty(senderName)) {

        showError(
            "senderName",
            "Sender's Name is required."
        );

        valid = false;

    } else if (!isValidLength(senderName, 20)) {

        showError(
            "senderName",
            "Sender's Name cannot exceed 20 characters."
        );

        valid = false;

    } else {

        showSuccess("senderName");

    }


    /*
    ========================================================
                    SENDER MOBILE NUMBER
                    REQUIRED
    ========================================================
    */

    const senderMobile = getValue("senderMobile");

    if (isEmpty(senderMobile)) {

        showError(
            "senderMobile",
            "Sender Mobile Number is required."
        );

        valid = false;

    } else {

        showSuccess("senderMobile");

    }

    return valid;

}


/*
============================================================
                EXPORT FUNCTION
============================================================
*/

window.validateDeclaration = validateDeclaration;



/*==========================================================
            STEP 12 - PHOTO VALIDATION

                   HTML FORM STEP 7
==========================================================*/


/*
============================================================
                VALIDATE PHOTO
============================================================
*/

function validatePhoto() {

    let valid = true;

    /*
    ========================================================
                    PROFILE PHOTO
                    REQUIRED

        gallery.js converts uploaded images into
        a compressed preview stored in biodata.photos.
    ========================================================
    */

    if (!isValidPhoto()) {

        showError(
            "profilePhotoUpload",
            VALIDATION_MESSAGES.photo
        );

        valid = false;

    } else {

        showSuccess("profilePhotoUpload");

    }


    /*
    ========================================================
        If a file is currently selected, check its
        MIME type and maximum size.

        Restored drafts may not have a File object,
        so their saved image preview is accepted.
    ========================================================
    */

    const photoInput = getField(
        "profilePhotoUpload"
    );

    const selectedFile =
        photoInput?.files?.[0];

    if (selectedFile) {

        if (!isValidImageType(selectedFile)) {

            showError(
                "profilePhotoUpload",
                VALIDATION_MESSAGES.imageType
            );

            valid = false;

        } else if (!isValidImageSize(selectedFile)) {

            showError(
                "profilePhotoUpload",
                VALIDATION_MESSAGES.imageSize
            );

            valid = false;

        }

    }

    return valid;

}


/*
============================================================
                EXPORT FUNCTION
============================================================
*/

window.validatePhoto = validatePhoto;



/*==========================================================
            STEP 13 - CURRENT STEP VALIDATION

                UPDATED 10-STEP MAPPING
==========================================================*/


/*
============================================================
                VALIDATE CURRENT STEP
============================================================
*/

function validateCurrentStep(step) {

    let valid = true;

    switch (Number(step)) {

        /*
        ====================================================
            STEP 1 - ABOUT ME
        ====================================================
        */

        case 1:

            valid = validatePersonal();

            break;


        /*
        ====================================================
            STEP 2 - EDUCATION & CAREER
        ====================================================
        */

        case 2:

            valid = validateEducation();

            if (!validateWork()) {

                valid = false;

            }

            break;


        /*
        ====================================================
            STEP 3 - ABOUT FAMILY
        ====================================================
        */

        case 3:

            valid = validateFamily();

            break;


        /*
        ====================================================
            STEP 4 - DETAILS OF BAAN
        ====================================================
        */

        case 4:

            valid = validateBaan();

            break;


        /*
        ====================================================
            STEP 5 - PARTNER'S PREFERENCES
        ====================================================
        */

        case 5:

            valid = validatePartner();

            break;


        /*
        ====================================================
            STEP 6 - CONTACT & ADDRESS
        ====================================================
        */

        case 6:

            valid = validateContact();

            break;


        /*
        ====================================================
            STEP 7 - PHOTO UPLOAD
        ====================================================
        */

        case 7:

            valid = validatePhoto();

            break;


        /*
        ====================================================
            STEP 8 - DECLARATION & SENDER
        ====================================================
        */

        case 8:

            valid = validateDeclaration();

            break;


        /*
        ====================================================
            STEP 9 - CHOOSE TEMPLATE
        ====================================================
        */

        case 9: {

            const selectedTemplate =
                document.querySelector(
                    'input[name="biodataTemplate"]:checked'
                );

            const allowedTemplates =
                ["template1", "template2"];

            if (
                !selectedTemplate ||
                !allowedTemplates.includes(
                    selectedTemplate.value
                )
            ) {

                validationMessage(
                    "Please select a valid biodata template."
                );

                valid = false;

            }

            break;

        }


        /*
        ====================================================
            STEP 10 - REVIEW & CONFIRM
        ====================================================
        */

        case 10:

            valid = true;

            break;


        default:

            valid = false;

            break;

    }

    VALIDATION_STATE.currentStepValid = valid;

    return valid;

}


/*
============================================================
                EXPORT FUNCTION
============================================================
*/

window.validateCurrentStep = validateCurrentStep;



/*==========================================================
            STEP 14 - COMPLETE FORM VALIDATION
==========================================================*/


/*
============================================================
                VALIDATE COMPLETE FORM
============================================================
*/

function validateCompleteForm() {

    clearAllErrors();

    let valid = true;

    /*
    ========================================================
                    STEP 1
                    ABOUT ME
    ========================================================
    */

    if (!validatePersonal()) {

        valid = false;

    }


    /*
    ========================================================
                    STEP 2
                    EDUCATION & CAREER
    ========================================================
    */

    if (!validateEducation()) {

        valid = false;

    }

    if (!validateWork()) {

        valid = false;

    }


    /*
    ========================================================
                    STEP 3
                    ABOUT FAMILY
    ========================================================
    */

    if (!validateFamily()) {

        valid = false;

    }


    /*
    ========================================================
                    STEP 4
                    DETAILS OF BAAN
    ========================================================
    */

    if (!validateBaan()) {

        valid = false;

    }


    /*
    ========================================================
                    STEP 5
                    PARTNER'S PREFERENCES
    ========================================================
    */

    if (!validatePartner()) {

        valid = false;

    }


    /*
    ========================================================
                    STEP 6
                    CONTACT & ADDRESS
    ========================================================
    */

    if (!validateContact()) {

        valid = false;

    }


    /*
    ========================================================
                    STEP 7
                    PROFILE PHOTO
    ========================================================
    */

    if (!validatePhoto()) {

        valid = false;

    }


    /*
    ========================================================
                    STEP 8
                    DECLARATION & SENDER DETAILS
    ========================================================
    */

    if (!validateDeclaration()) {

        valid = false;

    }


    /*
    ========================================================
        Complete-form validation is called on Step 8
        in form.js, before Step 9 template selection.

        Template validation remains in Step 9.
    ========================================================
    */

    VALIDATION_STATE.completeFormValid = valid;

    if (!valid) {

        validationMessage(
            "Please complete all required fields and " +
            "correct any invalid information before " +
            "continuing."
        );

    }

    return valid;

}


/*
============================================================
                EXPORT FUNCTION
============================================================
*/

window.validateCompleteForm = validateCompleteForm;



/*==========================================================
            STEP 15 - LIVE VALIDATION
==========================================================*/


/*
============================================================
                ATTACH LIVE VALIDATION
============================================================
*/

function initializeLiveValidation() {

    /*
    ========================================================
                    ALL INPUT FIELDS
    ========================================================
    */

    const fields = document.querySelectorAll(
        "#multiStepForm input, " +
        "#multiStepForm select, " +
        "#multiStepForm textarea"
    );

    fields.forEach(field => {

        /*
        ====================================================
            Prevent duplicate listeners.
        ====================================================
        */

        if (
            field.dataset.liveValidationInitialized ===
            "true"
        ) {

            return;

        }

        field.dataset.liveValidationInitialized =
            "true";


        /*
        ====================================================
                    KEYUP
        ====================================================
        */

        field.addEventListener(
            "keyup",
            validateField
        );


        /*
        ====================================================
                    INPUT
        ====================================================
        */

        field.addEventListener(
            "input",
            validateField
        );


        /*
        ====================================================
                    CHANGE
        ====================================================
        */

        field.addEventListener(
            "change",
            validateField
        );


        /*
        ====================================================
                    BLUR
        ====================================================
        */

        field.addEventListener(
            "blur",
            validateField
        );

    });

}


/*
============================================================
                VALIDATE SINGLE FIELD
============================================================
*/

function validateField(event) {

    const id = event.target.id;

    switch (id) {

        /*==========================
                PERSONAL
                STEP 1
        ==========================*/

        case "fullName":
        case "dob":
        case "birthHour":
        case "birthMinute":
        case "birthPeriod":
        case "placeOfBirth":
        case "religion":
        case "gotra":
        case "rashi":
        case "gan":
        case "height":
        case "complexion":
        case "maritalStatus":
        case "caste":
        case "manglik":
        case "language":
        case "diet":
        case "hobbies":
        case "other":

        /* OPTIONAL NATIVE PLACE */

        case "nativePlace":

            validatePersonal();

            break;


        /*==========================
                EDUCATION
                STEP 2
        ==========================*/

        case "highestQualification":
        case "college":
        case "Board10th":
        case "Board12th":

            validateEducation();

            break;


        /*==========================
                WORK & CAREER
                INCLUDED IN STEP 2
        ==========================*/

        case "profession":
        case "income":

            validateWork();

            break;


        /*==========================
                FAMILY
                STEP 3
        ==========================*/

        case "fatherName":
        case "fatherOccupation":
        case "motherName":
        case "motherOccupation":
        case "siblingsDetails":

            validateFamily();

            break;


        /*==========================
                BAAN
                STEP 4
        ==========================*/

        case "mulbaan":
        case "ajiaur":
        case "naniaur":
        case "sasural":
        case "sasKeNaihar":

            validateBaan();

            break;


        /*==========================
                PARTNER
                STEP 5
        ==========================*/

        case "preferredQualification":
        case "preferredProfession":
        case "preferredLocation":
        case "preferredCaste":
        case "otherExpectations":

            validatePartner();

            break;


        /*==========================
                CONTACT & ADDRESS
                STEP 6
        ==========================*/

        case "mobileNumber":
        case "currentAddress":
        case "permanentAddress":

            validateContact();

            break;


        /*==========================
                PHOTO
                STEP 7
        ==========================*/

        case "profilePhotoUpload":

            /*
                gallery.js processes the image
                asynchronously. Validate after
                the gallery module updates biodata.
            */

            if (
                event.type !== "change"
            ) {

                validatePhoto();

            }

            break;


        /*==========================
                DECLARATION
                STEP 8
        ==========================*/

        case "declaration":
        case "senderName":
        case "senderMobile":

            validateDeclaration();

            break;


        default:

            break;

    }

}



/*==========================================================
            STEP 16 - INITIALIZE LIVE VALIDATION
                  AND CHARACTER COUNTERS
==========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    function() {

        initializeLiveValidation();


        /*
        ====================================================
                    PERSONAL DETAILS COUNTERS
                    STEP 1
        ====================================================
        */

        initializeCharacterCounter("fullName", 20);

        initializeCharacterCounter("placeOfBirth", 25);

        initializeCharacterCounter("religion", 20);

        initializeCharacterCounter("gotra", 20);

        initializeCharacterCounter("rashi", 20);

        initializeCharacterCounter("height", 20);

        initializeCharacterCounter("complexion", 20);

        initializeCharacterCounter("language", 25);

        initializeCharacterCounter("hobbies", 25);

        initializeCharacterCounter("other", 25);


        /*
        ====================================================
                    NATIVE PLACE COUNTER
                    OPTIONAL
        ====================================================
        */

        initializeCharacterCounter("nativePlace", 25);


        /*
        ====================================================
                    EDUCATION & CAREER COUNTERS
                    STEP 2
        ====================================================
        */

        initializeCharacterCounter(
            "highestQualification",
            25
        );

        initializeCharacterCounter("college", 25);

        initializeCharacterCounter("Board10th", 25);

        initializeCharacterCounter("Board12th", 25);

        initializeCharacterCounter("profession", 25);

        initializeCharacterCounter("income", 25);


        /*
        ====================================================
                    FAMILY COUNTERS
                    STEP 3
        ====================================================
        */

        initializeCharacterCounter("fatherName", 25);

        initializeCharacterCounter("fatherOccupation", 25);

        initializeCharacterCounter("motherName", 25);

        initializeCharacterCounter("motherOccupation", 25);

        initializeCharacterCounter("siblingsDetails", 40);


        /*
        ====================================================
                    BAAN COUNTERS
                    STEP 4
                    ALL FIELDS OPTIONAL
        ====================================================
        */

        initializeCharacterCounter("mulbaan", 25);

        initializeCharacterCounter("ajiaur", 25);

        initializeCharacterCounter("naniaur", 25);

        initializeCharacterCounter("sasural", 25);

        initializeCharacterCounter("sasKeNaihar", 25);


        /*
        ====================================================
                    PARTNER COUNTERS
                    STEP 5
        ====================================================
        */

        initializeCharacterCounter(
            "preferredQualification",
            25
        );

        initializeCharacterCounter(
            "preferredProfession",
            25
        );

        initializeCharacterCounter(
            "preferredLocation",
            25
        );

        initializeCharacterCounter(
            "preferredCaste",
            25
        );

        initializeCharacterCounter(
            "otherExpectations",
            25
        );


        /*
        ====================================================
                    CONTACT & ADDRESS COUNTERS
                    STEP 6
        ====================================================
        */

        initializeCharacterCounter(
            "currentAddress",
            75
        );

        initializeCharacterCounter(
            "permanentAddress",
            75
        );

        initializeCharacterCounter(
            "mobileNumber",
            15
        );


        /*
        ====================================================
                    DECLARATION & SENDER COUNTERS
                    STEP 8
        ====================================================
        */

        initializeCharacterCounter(
            "senderName",
            20
        );

        initializeCharacterCounter(
            "senderMobile",
            15
        );

    }

);


/*==========================================================
                    END OF VALIDATION.JS
==========================================================*/
