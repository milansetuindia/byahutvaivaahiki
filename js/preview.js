
/* ==========================================================
                        PREVIEW.JS
                    JAISWAL VAIVAAHIKI

                    ENGLISH ONLY
                   TWO PDF TEMPLATES

                 SAME BIODATA INFORMATION
                 BAAN DETAILS SUPPORTED

               UPDATED 10-STEP FORM STRUCTURE
========================================================== */


/* ==========================================================
                    PDF VALUE FORMAT
                 NO HINDI TRANSLATION
========================================================== */

function formatPDFValue(field, value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "";
    }

    return String(value).trim();
}


/* ==========================================================
                    DATE FORMAT
                    YYYY-MM-DD TO DD-MM-YYYY
========================================================== */

function formatDOB(dateString) {

    if (!dateString) {
        return "";
    }

    const parts = String(dateString).split("-");

    if (parts.length !== 3) {
        return String(dateString);
    }

    const [year, month, day] = parts;

    return `${day}-${month}-${year}`;
}


/* ==========================================================
                    SAFE PREVIEW TEXT
========================================================== */

function setPreviewText(id, value) {

    const element = document.getElementById(id);

    if (!element) {
        return;
    }

    element.textContent =
        value === null || value === undefined
            ? ""
            : String(value);
}


/* ==========================================================
                    TEMPLATE SELECTION
========================================================== */

function getSelectedPreviewTemplate() {

    const selectedTemplate =
        biodata.template || "template1";

    if (
        selectedTemplate === "template1" ||
        selectedTemplate === "template2"
    ) {
        return selectedTemplate;
    }

    return "template1";
}


/* ==========================================================
                    RENDER PDF PREVIEW
========================================================== */

function renderPreviewContainer() {

    const selectedTemplate =
        getSelectedPreviewTemplate();

    const config =
        TEMPLATE_CONFIG[selectedTemplate] ||
        TEMPLATE_CONFIG.template1;

    if (!config) {

        console.error("Template configuration missing.");

        return;
    }


    /* ======================================================
                    TEMPLATE BACKGROUND
    ====================================================== */

    const templateImage =
        document.querySelector(".pdf-template");

    if (templateImage) {

        if (
            templateImage.getAttribute("src") !==
            config.image
        ) {
            templateImage.src = config.image;
        }

    }


    /* ======================================================
                    ABOUT ME
                    PERSONAL DETAILS
    ====================================================== */

    setPreviewText(
        "previewName",
        biodata.personal?.fullName
    );

    setPreviewText(
        "previewDOB",
        formatDOB(biodata.personal?.dob)
    );

    setPreviewText(
        "previewTime",
        biodata.personal?.timeOfBirth
    );

    setPreviewText(
        "previewPlace",
        biodata.personal?.placeOfBirth
    );

    setPreviewText(
        "previewReligion",
        biodata.personal?.religion
    );

    setPreviewText(
        "previewGotra",
        biodata.personal?.gotra
    );

    setPreviewText(
        "previewCaste",
        formatPDFValue(
            "caste",
            biodata.personal?.caste
        )
    );

    /*
    ======================================================
        Sub Caste is not present in the updated form
        or the printed template.

        Clear any older preview value.
    ======================================================
    */

    setPreviewText(
        "previewSubCaste",
        ""
    );

    setPreviewText(
        "previewRashi",
        biodata.personal?.rashi
    );

    setPreviewText(
        "previewGan",
        formatPDFValue(
            "gan",
            biodata.personal?.gan
        )
    );

    setPreviewText(
        "previewManglik",
        formatPDFValue(
            "manglik",
            biodata.personal?.manglik
        )
    );

    setPreviewText(
        "previewMaritalStatus",
        formatPDFValue(
            "maritalStatus",
            biodata.personal?.maritalStatus
        )
    );

    setPreviewText(
        "previewDiet",
        formatPDFValue(
            "diet",
            biodata.personal?.diet
        )
    );

    setPreviewText(
        "previewHeight",
        biodata.personal?.height
    );

    setPreviewText(
        "previewComplexion",
        biodata.personal?.complexion
    );

    /*
    ======================================================
        Native Place is optional.

        Keep the field after Complexion, matching
        the updated About Me section.
    ======================================================
    */

    setPreviewText(
        "previewNativePlace",
        biodata.personal?.nativePlace
    );

    /*
        Person's spoken language,
        not the website interface language.
    */

    setPreviewText(
        "previewLanguage",
        biodata.personal?.language
    );

    setPreviewText(
        "previewHobbies",
        biodata.personal?.hobbies
    );

    setPreviewText(
        "previewOther",
        biodata.personal?.other
    );


    /* ======================================================
                    EDUCATION & CAREER
    ====================================================== */

    setPreviewText(
        "previewHighestQualification",
        biodata.education?.highestQualification
    );

    setPreviewText(
        "previewCollege",
        biodata.education?.college
    );

    setPreviewText(
        "previewBoard12th",
        biodata.education?.Board12th
    );

    setPreviewText(
        "previewBoard10th",
        biodata.education?.Board10th
    );

    /*
    ======================================================
        The updated HTML has six printed fields:

        1. Qualification
        2. College
        3. 12th Board
        4. 10th Board
        5. Profession
        6. Income

        Special Skill and Education Other are no longer
        part of this template.
    ======================================================
    */

    setPreviewText(
        "previewSpecialSkill",
        ""
    );

    setPreviewText(
        "previewEducationOther",
        ""
    );


    /* ======================================================
                    WORK & CAREER

        Profession and Income are displayed under
        Education & Career in the updated template.

        The data remains in biodata.work to keep
        compatibility with form.js and storage.js.
    ====================================================== */

    setPreviewText(
        "previewProfession",
        biodata.work?.profession
    );

    /*
    ======================================================
        These fields are not collected by the updated
        form. Clear any previous values.
    ======================================================
    */

    setPreviewText(
        "previewDesignation",
        ""
    );

    setPreviewText(
        "previewOrganization",
        ""
    );

    setPreviewText(
        "previewWorkPlace",
        ""
    );

    setPreviewText(
        "previewIncome",
        biodata.work?.income
    );


    /* ======================================================
                    ABOUT FAMILY
                    FAMILY DETAILS
    ====================================================== */

    setPreviewText(
        "previewFatherName",
        biodata.family?.fatherName
    );

    setPreviewText(
        "previewFatherOccupation",
        biodata.family?.fatherOccupation
    );

    setPreviewText(
        "previewMotherName",
        biodata.family?.motherName
    );

    setPreviewText(
        "previewMotherOccupation",
        biodata.family?.motherOccupation
    );

    setPreviewText(
        "previewSiblingsDetails",
        biodata.family?.siblingsDetails
    );


    /* ======================================================
                    DETAILS OF BAAN

                    ALL FIVE FIELDS OPTIONAL
    ====================================================== */

    setPreviewText(
        "previewMulbaan",
        biodata.baan?.mulbaan
    );

    setPreviewText(
        "previewAjiaur",
        biodata.baan?.ajiaur
    );

    setPreviewText(
        "previewNaniaur",
        biodata.baan?.naniaur
    );

    setPreviewText(
        "previewSasural",
        biodata.baan?.sasural
    );

    setPreviewText(
        "previewSasKeNaihar",
        biodata.baan?.sasKeNaihar
    );


    /* ======================================================
                    PARTNER'S PREFERENCES
    ====================================================== */

    setPreviewText(
        "previewPartnerQualification",
        biodata.partner?.preferredQualification
    );

    setPreviewText(
        "previewPartnerProfession",
        biodata.partner?.preferredProfession
    );

    setPreviewText(
        "previewPartnerLocation",
        biodata.partner?.preferredLocation
    );

    setPreviewText(
        "previewPartnerCaste",
        formatPDFValue(
            "preferredCaste",
            biodata.partner?.preferredCaste
        )
    );

    setPreviewText(
        "previewPartnerOther",
        biodata.partner?.otherExpectations
    );


    /* ======================================================
                    CONTACT DETAILS
    ====================================================== */

    setPreviewText(
        "previewMobile",
        biodata.contact?.mobileNumber
    );


    /* ======================================================
                    ADDRESS
    ====================================================== */

    setPreviewText(
        "previewCurrentAddress",
        biodata.contact?.currentAddress
    );

    setPreviewText(
        "previewPermanentAddress",
        biodata.contact?.permanentAddress
    );


    /* ======================================================
                    DECLARATION & CONSENT
                    SENDER DETAILS
    ====================================================== */

    setPreviewText(
        "previewSenderName",
        biodata.declaration?.senderName
    );

    setPreviewText(
        "previewSenderMobile",
        biodata.declaration?.senderMobile
    );


    /* ======================================================
                    PROFILE PHOTO
    ====================================================== */

    const photo =
        document.getElementById("previewPhoto");

    if (photo) {

        const photoSource =
            biodata.photos?.profilePhoto?.preview ||
            "assets/images/defaults/default-profile.png";

        if (
            photo.getAttribute("src") !== photoSource
        ) {

            photo.src = photoSource;

        }

        photo.alt = "Profile Photo";

    }


    /* ======================================================
                    APPLY TEMPLATE POSITIONS
    ====================================================== */

    applyPositions(
        config.positions,
        selectedTemplate
    );

}


/* ==========================================================
                    APPLY TEMPLATE POSITIONS
========================================================== */

function applyPositions(
    positions,
    selectedTemplate = "template1"
) {

    if (!positions) {

        console.error("Template positions not found.");

        return;
    }

    const previewPage =
        document.querySelector(".preview-page");

    if (!previewPage) {

        console.error("Preview page not found.");

        return;
    }


    /* ======================================================
                    RESET ALL PREVIEW FIELD STYLES

                    BEFORE APPLYING NEW TEMPLATE
    ====================================================== */

    const previewElements =
        previewPage.querySelectorAll('[id^="preview"]');

    /*
    ======================================================
        These fields no longer appear in the updated
        printed template, even if an older positions.js
        still contains their coordinates.

        Keeping this list prevents outdated values
        from accidentally appearing in the PDF.
    ======================================================
    */

    const removedPreviewFields = new Set([

        "previewSubCaste",

        "previewSpecialSkill",

        "previewEducationOther",

        "previewDesignation",

        "previewOrganization",

        "previewWorkPlace"

    ]);

    previewElements.forEach(element => {

        const position = positions[element.id];

        if (
            !position ||
            removedPreviewFields.has(element.id)
        ) {

            element.style.display = "none";

            return;

        }

        element.style.display = "block";

        element.style.position = "absolute";

        element.style.left = "";

        element.style.top = "";

        element.style.width = "";

        element.style.height = "";

        element.style.removeProperty("font-size");

        element.style.removeProperty("font-weight");

        element.style.fontFamily = "";

        element.style.fontStyle = "";

        element.style.color = "";

        element.style.textAlign = "";

        element.style.textShadow = "";

        element.style.textTransform = "";

        element.style.lineHeight = "";

        element.style.whiteSpace = "";

        element.style.wordBreak = "";

        element.style.overflowWrap = "";

        element.style.overflow = "";

        element.style.textOverflow = "";

        element.style.webkitLineClamp = "";

        element.style.webkitBoxOrient = "";

        element.style.borderRadius = "";

        element.style.objectFit = "";

    });


    /* ======================================================
                    APPLY POSITION VALUES
    ====================================================== */

    Object.entries(positions).forEach(([id, position]) => {

        const element =
            document.getElementById(id);

        if (
            !element ||
            !previewPage.contains(element)
        ) {
            return;
        }

        /*
        ==================================================
            Skip obsolete fields in both templates.
        ==================================================
        */

        if (removedPreviewFields.has(id)) {

            element.style.display = "none";

            return;
        }

        if (
            !position ||
            !Number.isFinite(Number(position.left)) ||
            !Number.isFinite(Number(position.top))
        ) {

            element.style.display = "none";

            return;

        }

        element.style.display = "block";

        element.style.position = "absolute";

        element.style.left =
            position.left + "px";

        element.style.top =
            position.top + "px";

        if (position.width !== undefined) {

            element.style.width =
                position.width + "px";

        }

        if (position.height !== undefined) {

            element.style.height =
                position.height + "px";

        }

        if (position.fontSize !== undefined) {

            element.style.setProperty(
                "font-size",
                position.fontSize + "px",
                "important"
            );

        }

        if (position.fontWeight !== undefined) {

            element.style.setProperty(
                "font-weight",
                position.fontWeight,
                "important"
            );

        }

        element.style.lineHeight = "1.3";


        /* ==================================================
                    MULTILINE FIELDS
        ================================================== */

        if (position.multiline) {

            element.style.whiteSpace = "normal";

            element.style.wordBreak = "break-word";

            element.style.overflowWrap = "break-word";

            element.style.overflow = "hidden";

            element.style.lineHeight = "1.3";

            if (position.height) {

                element.style.height =
                    position.height + "px";

            }

        } else {

            element.style.whiteSpace = "nowrap";

            element.style.overflow = "visible";

            element.style.display = "block";

            element.style.webkitLineClamp = "";

            element.style.webkitBoxOrient = "";

        }




        /* ==================================================
                        PROFILE PHOTO
                  RECTANGULAR DISPLAY
        ================================================== */

        if (id === "previewPhoto") {

            element.style.objectFit = "cover";

            element.style.objectPosition = "center";

            element.style.borderRadius = "0";

            element.style.display = "block";

            return;
        }


        /* ==================================================
                    NAME STYLING
        ================================================== */

        if (id === "previewName") {

            element.style.fontFamily =
                "'Playfair Display', Georgia, serif";

            element.style.color = "#003153";

            element.style.textAlign = "left";

            element.style.textTransform = "uppercase";

            if (selectedTemplate === "template1") {

                element.style.fontStyle = "italic";

                element.style.textShadow =
                    "0 1px 0 #fff, 0 2px 3px rgba(0,0,0,0.35)";

            } else {

                element.style.fontStyle = "normal";

                element.style.textShadow = "none";

            }

        } else {

            element.style.fontFamily =
                "'Poppins', sans-serif";

            element.style.fontStyle = "normal";

            element.style.color = "#111111";

            element.style.textTransform = "none";

            element.style.textShadow = "none";

        }

    });

}


/* ==========================================================
                    END OF PREVIEW.JS
========================================================== */
