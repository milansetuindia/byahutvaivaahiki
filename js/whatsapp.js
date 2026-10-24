
/*==========================================================
                WHATSAPP BIODATA SUBMISSION
==========================================================*/


/*==========================================================
                WHATSAPP CONFIGURATION
==========================================================*/

const WHATSAPP_CONFIG = {

    // WhatsApp number
    // Country code 91 + 7050510511
    phoneNumber: "917050510511"

};


/*==========================================================
                GET WHATSAPP MESSAGE
==========================================================*/

function getWhatsAppMessage() {

    /*======================================================
                    ENGLISH MESSAGE
    ======================================================*/

    return (
        "Hello Jaiswal Vaivaahiki Admin,\n\n" +

        "I want to add my biodata to the Jaiswal Vaivaahiki matrimonial website.\n\n" +

        "I have downloaded my biodata PDF and will send it here for uploading.\n\n" +

        "Thank you."
    );

}


/*==========================================================
                GET POPUP TEXT
==========================================================*/

function getWhatsAppPopupText() {

    /*======================================================
                    ENGLISH
    ======================================================*/

    return {

        title: "Choose WhatsApp",

        subtitle:
            "Select how you want to contact us.",

        whatsapp:
            "WhatsApp",

        whatsappDescription:
            "Open WhatsApp Messenger",

        business:
            "Send WhatsApp Message",

        businessDescription:
            "Open chat with Jaiswal Vaivaahiki",

        cancel:
            "Cancel"

    };

}


/*==========================================================
                SHOW WHATSAPP CHOICE POPUP
==========================================================*/

function showWhatsAppChoicePopup(event) {

    /*
     * Prevent the default action.
     *
     * Important for the homepage <a> element
     * because it already contains a WhatsApp href.
     */
    if (event) {

        event.preventDefault();

    }


    /*
     * Prevent multiple popups.
     */
    const existingPopup =
        document.getElementById(
            "whatsappChoicePopup"
        );


    if (existingPopup) {

        return;

    }


    /*
     * Get English popup text.
     */
    const text =
        getWhatsAppPopupText();


    /*======================================================
                    CREATE OVERLAY
    ======================================================*/

    const overlay =
        document.createElement("div");


    overlay.id =
        "whatsappChoicePopup";


    overlay.className =
        "whatsapp-choice-overlay";


    /*======================================================
                    CREATE POPUP
    ======================================================*/

    const popup =
        document.createElement("div");


    popup.className =
        "whatsapp-choice-popup";


    /*
     * Prevent clicks inside popup from
     * triggering overlay click.
     */
    popup.addEventListener(
        "click",
        function(e) {

            e.stopPropagation();

        }
    );


    /*======================================================
                    POPUP HTML
    ======================================================*/

    popup.innerHTML = `

        <!-- CLOSE BUTTON -->

        <button
            type="button"
            class="whatsapp-popup-close"
            id="closeWhatsappPopup"
            aria-label="Close">

            <i class="fa-solid fa-xmark"></i>

        </button>


        <!-- HEADER -->

        <div class="whatsapp-choice-header">


            <!-- WHATSAPP ICON -->

            <div class="whatsapp-choice-icon">

                <i class="fa-brands fa-whatsapp"></i>

            </div>


            <!-- TITLE -->

            <h3>
                ${text.title}
            </h3>


            <!-- SUBTITLE -->

            <p>
                ${text.subtitle}
            </p>


        </div>


        <!-- OPTIONS -->

        <div class="whatsapp-choice-options">


            <!-- WHATSAPP BUSINESS -->

            <button
                type="button"
                class="whatsapp-option-card"
                id="businessWhatsappBtn">


                <div class="whatsapp-option-icon">

                    <i class="fa-brands fa-whatsapp"></i>

                </div>


                <div class="whatsapp-option-content">

                    <div class="whatsapp-option-title">
                        ${text.business}
                    </div>

                    <div class="whatsapp-option-description">
                        ${text.businessDescription}
                    </div>

                </div>


                <div class="whatsapp-option-arrow">

                    <i class="fa-solid fa-chevron-right"></i>

                </div>


            </button>


        </div>


        <!-- CANCEL -->

        <button
            type="button"
            class="whatsapp-cancel-btn"
            id="cancelWhatsappBtn">

            ${text.cancel}

        </button>


    `;


    /*======================================================
                    ADD POPUP
    ======================================================*/

    overlay.appendChild(popup);

    document.body.appendChild(overlay);


    /*
     * Prevent body scrolling while popup
     * is open.
     */
    document.body.classList.add(
        "whatsapp-popup-open"
    );


    /*======================================================
                    NORMAL WHATSAPP
    ======================================================*/

    const normalButton =
        document.getElementById(
            "normalWhatsappBtn"
        );


    if (normalButton) {

        normalButton.addEventListener(
            "click",
            function() {

                openWhatsApp("normal");

            }
        );

    }


    /*======================================================
                    BUSINESS WHATSAPP
    ======================================================*/

    const businessButton =
        document.getElementById(
            "businessWhatsappBtn"
        );


    if (businessButton) {

        businessButton.addEventListener(
            "click",
            function() {

                openWhatsApp("business");

            }
        );

    }


    /*======================================================
                    CLOSE BUTTON
    ======================================================*/

    const closeButton =
        document.getElementById(
            "closeWhatsappPopup"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            function() {

                closeWhatsAppChoicePopup();

            }
        );

    }


    /*======================================================
                    CANCEL BUTTON
    ======================================================*/

    const cancelButton =
        document.getElementById(
            "cancelWhatsappBtn"
        );


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            function() {

                closeWhatsAppChoicePopup();

            }
        );

    }


    /*======================================================
                    CLICK OUTSIDE
    ======================================================*/

    overlay.addEventListener(
        "click",
        function(e) {

            if (e.target === overlay) {

                closeWhatsAppChoicePopup();

            }

        }
    );


    /*======================================================
                    ESC KEY
    ======================================================*/

    document.addEventListener(
        "keydown",
        handleWhatsAppEscape
    );

}


/*==========================================================
                CLOSE POPUP
==========================================================*/

function closeWhatsAppChoicePopup() {

    const popup =
        document.getElementById(
            "whatsappChoicePopup"
        );


    if (!popup) {

        return;

    }


    popup.remove();


    document.body.classList.remove(
        "whatsapp-popup-open"
    );


    document.removeEventListener(
        "keydown",
        handleWhatsAppEscape
    );

}


/*==========================================================
                ESC KEY HANDLER
==========================================================*/

function handleWhatsAppEscape(event) {

    if (event.key === "Escape") {

        closeWhatsAppChoicePopup();

    }

}


/*==========================================================
                ANDROID DETECTION
==========================================================*/

function isAndroidDevice() {

    return /Android/i.test(
        navigator.userAgent
    );

}


/* ==========================================
   OPEN STANDARD WHATSAPP CHAT
========================================== */

function openNormalWhatsApp(message) {

    const whatsappURL =
        "https://wa.me/" +
        WHATSAPP_CONFIG.phoneNumber +
        "?text=" +
        encodeURIComponent(message);

    window.location.href = whatsappURL;

}


/* ==========================================
   OPEN WHATSAPP CHAT WITH BUSINESS NUMBER
========================================== */

function openBusinessWhatsApp(message) {

    const phoneNumber = WHATSAPP_CONFIG.phoneNumber;

    const encodedMessage = encodeURIComponent(message);

    // Standard WhatsApp click-to-chat link.
    // Does not force installation of WhatsApp Business.

    const whatsappURL =
        "https://wa.me/" +
        phoneNumber +
        "?text=" +
        encodedMessage;

    window.location.href = whatsappURL;

}


/*==========================================================
                OPEN SELECTED WHATSAPP
==========================================================*/

function openWhatsApp(type) {

    /*
     * Get English message.
     */
    const message =
        getWhatsAppMessage();


    /*
     * Close popup.
     */
    closeWhatsAppChoicePopup();


    /*======================================================
                    NORMAL WHATSAPP
    ======================================================*/

    if (type === "normal") {

        openNormalWhatsApp(
            message
        );

        return;

    }


    /*======================================================
                    WHATSAPP BUSINESS
    ======================================================*/

    if (type === "business") {

        openBusinessWhatsApp(
            message
        );

        return;

    }

}


/*==========================================================
                INITIALIZE WHATSAPP BUTTONS
==========================================================*/

function initializeWhatsAppButton() {

    /*
     * Find BOTH WhatsApp buttons.
     *
     * Homepage:
     * .whatsapp-button
     *
     * Step 10:
     * #sendWhatsappBtn
     */
    const buttons =
        document.querySelectorAll(
            ".whatsapp-button, #sendWhatsappBtn"
        );


    if (!buttons.length) {

        return;

    }


    /*======================================================
                    INITIALIZE EACH BUTTON
    ======================================================*/

    buttons.forEach(
        function(button) {


            /*
             * Prevent duplicate initialization.
             */
            if (
                button.dataset.whatsappInitialized ===
                "true"
            ) {

                return;

            }


            /*
             * Mark as initialized.
             */
            button.dataset.whatsappInitialized =
                "true";


            button.addEventListener("click", function(event) {

                event.preventDefault();

                openBusinessWhatsApp(
                    getWhatsAppMessage()
                );

            });


        }
    );

}


/*==========================================================
                PAGE INITIALIZATION
==========================================================*/

document.addEventListener(
    "DOMContentLoaded",
    function() {

        initializeWhatsAppButton();

    }
);


/*==========================================================
                GLOBAL EXPORTS
==========================================================*/

window.sendBiodataOnWhatsApp = function(event) {

    if (event) {
        event.preventDefault();
    }

    openBusinessWhatsApp(
        getWhatsAppMessage()
    );

};


window.initializeWhatsAppButton =
    initializeWhatsAppButton;


window.getWhatsAppMessage =
    getWhatsAppMessage;


window.openWhatsApp =
    openWhatsApp;


window.closeWhatsAppChoicePopup =
    closeWhatsAppChoicePopup;


/*==========================================================
                END OF WHATSAPP.JS
==========================================================*/
