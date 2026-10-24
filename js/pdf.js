
/*==========================================================
                    PDF.JS
        HTML2CANVAS + JSPDF VERSION

             JAISWAL VAIVAAHIKI

               ENGLISH ONLY
             TWO PDF TEMPLATES
               10 FORM STEPS

        PAID DOWNLOAD AND RECOVERY
==========================================================*/


/*==========================================================
                PDF CONFIGURATION
==========================================================*/

const PDF_CONFIG = {

    FILE_NAME: "Matrimonial_Biodata.pdf",

    PAGE_FORMAT: "a4",

    PAGE_ORIENTATION: "portrait",

    UNIT: "mm",

    MARGIN: 10,

    SCALE: 2,

    IMAGE_TYPE: "JPEG",

    IMAGE_QUALITY: 1.0,

    DEBUG: true

};


/*==========================================================
                PDF MODULE
==========================================================*/

const PDF_MODULE = {

    initialized: false,

    generating: false,

    downloading: false,

    authorizedGeneration: false

};


/*==========================================================
                LOGGER
==========================================================*/

function pdfLog(message, data = "") {

    if (!PDF_CONFIG.DEBUG) {

        return;

    }

    console.group("[PDF]");

    console.log(message);

    if (data !== "") {

        console.log(data);

    }

    console.groupEnd();

}


/*==========================================================
                INITIALIZATION
==========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    () => {

        initializePDFModule();

    }

);


/*==========================================================
                INITIALIZE
==========================================================*/

function initializePDFModule() {

    initializeDownloadButton();

    initializePrintButton();

    initializeShareButton();

    PDF_MODULE.initialized = true;

    pdfLog("PDF Module Initialized");

}


/*==========================================================
                BUTTONS
==========================================================*/


/*==========================================================
                DOWNLOAD BUTTON
==========================================================*/

function initializeDownloadButton() {

    const button = document.getElementById(
        "downloadPdfBtn"
    );

    if (!button) {

        return;

    }

    button.addEventListener(
        "click",
        function() {

            if (
                typeof window.startPayment === "function"
            ) {

                window.startPayment();

            } else {

                console.error("startPayment not found");

                alert(
                    "Payment system is not ready. Please refresh."
                );

            }

        }
    );

}


/*==========================================================
                PRINT BUTTON
==========================================================*/

function initializePrintButton() {

    const button = document.getElementById(
        "printPdfBtn"
    );

    if (!button) {

        return;

    }

    button.addEventListener(

        "click",

        printPDF

    );

}


/*==========================================================
                SHARE BUTTON
==========================================================*/

function initializeShareButton() {

    const button = document.getElementById(
        "sharePdfBtn"
    );

    if (!button) {

        return;

    }

    button.addEventListener(

        "click",

        sharePDF

    );

}


/*==========================================================
                HELPERS
==========================================================*/


/*==========================================================
                GET PREVIEW CONTAINER
==========================================================*/

function getPreviewContainer() {

    return document.querySelector(
        ".biodata-preview-container"
    );

}


/*==========================================================
                GET PREVIEW PAGE
==========================================================*/

function getPreviewPage1() {

    return document.querySelector(
        ".preview-page"
    );

}


/*==========================================================
                SHOW PREVIEW CONTAINER
==========================================================*/

function showPreviewContainer() {

    const container = getPreviewContainer();

    const page = getPreviewPage1();

    if (!container || !page) {

        throw new Error(
            "PDF preview container or page is missing."
        );

    }

    /*
    ========================================================
        Updated size to match template backgrounds

                    1024 x 1536
    ========================================================
    */

    container.style.visibility = "visible";

    container.style.display = "block";

    container.style.position = "fixed";

    container.style.left = "0";

    container.style.top = "0";

    container.style.width = "1024px";

    container.style.height = "1536px";

    container.style.overflow = "hidden";

    container.style.zIndex = "999999";

    container.style.pointerEvents = "none";

    /*
    ========================================================
        Keep the preview page at the exact dimensions
        used by positions.js.
    ========================================================
    */

    page.style.width = "1024px";

    page.style.height = "1536px";

    page.style.position = "relative";

    page.style.overflow = "hidden";

    page.style.margin = "0";

    page.style.padding = "0";

    page.style.boxSizing = "border-box";

    /*
    ========================================================
        Background should cover the entire PDF page.
    ========================================================
    */

    const templateImage =
        page.querySelector(".pdf-template");

    if (templateImage) {

        templateImage.style.position = "absolute";

        templateImage.style.left = "0";

        templateImage.style.top = "0";

        templateImage.style.width = "1024px";

        templateImage.style.height = "1536px";

        templateImage.style.objectFit = "fill";

        templateImage.style.maxWidth = "none";

    }

}


/*==========================================================
                HIDE PREVIEW CONTAINER
==========================================================*/

function hidePreviewContainer() {

    const container = getPreviewContainer();

    if (!container) {

        return;

    }

    container.style.visibility = "hidden";

    container.style.zIndex = "-1";

    container.style.pointerEvents = "none";

}


/*==========================================================
                PREPARE PDF
==========================================================*/

function preparePDF() {

    /*
    ========================================================
            Render the selected biodata template
    ========================================================
    */

    if (
        typeof renderPreviewContainer !== "function"
    ) {

        throw new Error(
            "PDF preview renderer is unavailable."
        );

    }

    if (
        typeof biodata === "undefined"
    ) {

        throw new Error(
            "Biodata is not available."
        );

    }

    /*
    ========================================================
        Save latest form values before rendering.

        This supports the updated index.html:

        Step 1 - About Me
        Step 2 - Education & Career
        Step 3 - About Family
        Step 4 - Details of Baan
        Step 5 - Partner's Preferences
        Step 6 - Contact and Address
        Step 7 - Photo
        Step 8 - Declaration
        Step 9 - Template
        Step 10 - Review
    ========================================================
    */

    if (
        typeof saveAllFormData === "function"
    ) {

        saveAllFormData();

    }

    /*
    ========================================================
        Read currently selected template.

        Only template1 and template2 are allowed.
    ========================================================
    */

    const selectedTemplate =
        document.querySelector(
            'input[name="biodataTemplate"]:checked'
        );

    if (selectedTemplate) {

        if (
            selectedTemplate.value !== "template1" &&
            selectedTemplate.value !== "template2"
        ) {

            throw new Error(
                "Invalid biodata template."
            );

        }

        biodata.template =
            selectedTemplate.value;

    }

    /*
    ========================================================
            Render all biodata values.

            preview.js applies positions.js coordinates.
    ========================================================
    */

    renderPreviewContainer();

    /*
    ========================================================
                Show hidden preview
    ========================================================
    */

    showPreviewContainer();

}


/*==========================================================
                CLEANUP
==========================================================*/

function cleanupPDF() {

    hidePreviewContainer();

}


/*==========================================================
            WAIT FOR PDF TEMPLATE IMAGES

        SUPPORTS TEMPLATE 1 AND TEMPLATE 2
==========================================================*/

async function waitForPDFImages(page) {

    if (!page) {

        throw new Error(
            "PDF preview page is missing."
        );

    }

    const images = Array.from(
        page.querySelectorAll("img")
    );

    if (images.length === 0) {

        throw new Error(
            "PDF template background is missing."
        );

    }

    /*
    ========================================================
        Wait for template background and photos
    ========================================================
    */

    const imagePromises = images.map(image => {

        return new Promise((resolve, reject) => {

            /*
            ==================================================
                    Already successfully loaded
            ==================================================
            */

            if (
                image.complete &&
                image.naturalWidth > 0
            ) {

                resolve();

                return;

            }

            /*
            ==================================================
                    Failed or empty image
            ==================================================
            */

            if (
                !image.getAttribute("src")
            ) {

                reject(
                    new Error(
                        "A PDF image has no source."
                    )
                );

                return;

            }

            /*
            ==================================================
                The image may have completed with an error.
            ==================================================
            */

            if (
                image.complete &&
                image.naturalWidth === 0
            ) {

                reject(
                    new Error(
                        "A PDF image failed to load."
                    )
                );

                return;

            }

            /*
            ==================================================
                    Image still loading
            ==================================================
            */

            let timeoutId = null;

            let settled = false;

            function finish() {

                if (settled) {

                    return false;

                }

                settled = true;

                clearTimeout(timeoutId);

                image.removeEventListener(
                    "load",
                    onLoad
                );

                image.removeEventListener(
                    "error",
                    onError
                );

                return true;

            }

            function onLoad() {

                if (!finish()) {

                    return;

                }

                if (image.naturalWidth > 0) {

                    resolve();

                } else {

                    reject(
                        new Error(
                            "PDF image loaded incorrectly."
                        )
                    );

                }

            }

            function onError() {

                if (!finish()) {

                    return;

                }

                reject(
                    new Error(
                        "Unable to load a PDF image."
                    )
                );

            }

            image.addEventListener(
                "load",
                onLoad
            );

            image.addEventListener(
                "error",
                onError
            );

            /*
            ==================================================
                    Prevent endless waiting
            ==================================================
            */

            timeoutId = setTimeout(() => {

                if (!finish()) {

                    return;

                }

                reject(
                    new Error(
                        "PDF image loading timed out."
                    )
                );

            }, 15000);

            /*
            ==================================================
                Handle an image that finished while
                listeners were being attached.
            ==================================================
            */

            if (image.complete) {

                if (image.naturalWidth > 0) {

                    onLoad();

                } else {

                    onError();

                }

            }

        });

    });

    await Promise.all(imagePromises);

    /*
    ========================================================
        Confirm the template background loaded.
    ========================================================
    */

    const background =
        page.querySelector(".pdf-template");

    if (
        !background ||
        background.naturalWidth === 0 ||
        background.naturalHeight === 0
    ) {

        throw new Error(
            "Selected biodata template could not be loaded."
        );

    }

    pdfLog(
        "All PDF images loaded successfully."
    );

}


/*==========================================================
                CREATE CANVAS
==========================================================*/

async function createCanvasPage1() {

    try {

        /*
        ====================================================
                Prepare template preview
        ====================================================
        */

        preparePDF();

        /*
        ====================================================
                Get preview page
        ====================================================
        */

        const page = getPreviewPage1();

        if (!page) {

            throw new Error(
                "Preview Page 1 not found."
            );

        }

        /*
        ====================================================
                Wait for background and photo
        ====================================================
        */

        await waitForPDFImages(page);

        /*
        ====================================================
                Allow browser to finish layout
        ====================================================
        */

        await new Promise(
            resolve => requestAnimationFrame(resolve)
        );

        await new Promise(
            resolve => requestAnimationFrame(resolve)
        );

        /*
        ====================================================
                Capture preview as canvas

                Fixed dimensions prevent extra pages.
        ====================================================
        */

        const canvas = await html2canvas(page, {

            scale: PDF_CONFIG.SCALE,

            useCORS: true,

            allowTaint: false,

            backgroundColor: "#ffffff",

            logging: false,

            width: 1024,

            height: 1536,

            scrollX: 0,

            scrollY: 0,

            windowWidth: 1024,

            windowHeight: 1536

        });

        /*
        ====================================================
                Verify canvas dimensions
        ====================================================
        */

        if (
            !canvas ||
            canvas.width === 0 ||
            canvas.height === 0
        ) {

            throw new Error(
                "PDF canvas is empty."
            );

        }

        pdfLog(
            "PDF canvas created successfully."
        );

        return canvas;

    }

    catch (error) {

        console.error(
            "Canvas Creation Error:",
            error
        );

        throw error;

    }

    finally {

        /*
        ====================================================
            Always hide preview, including on failure.
        ====================================================
        */

        cleanupPDF();

    }

}


/*==========================================================
                GENERATE PDF
==========================================================*/

async function generatePDF() {

    /*
    ========================================================
        Generate only within the verified paid-download
        flow.

        This is a frontend safeguard, not a substitute
        for backend authorization.
    ========================================================
    */

    if (!PDF_MODULE.authorizedGeneration) {

        console.warn(
            "PDF generation must follow payment verification."
        );

        return null;

    }

    if (PDF_MODULE.generating) {

        return null;

    }

    PDF_MODULE.generating = true;

    try {

        /*
        ====================================================
                Verify PDF libraries
        ====================================================
        */

        verifyLibraries();

        /*
        ====================================================
                Create template canvas
        ====================================================
        */

        const canvas = await createCanvasPage1();

        /*
        ====================================================
                Create A4 PDF document
        ====================================================
        */

        const pdf = new jspdf.jsPDF({

            orientation: PDF_CONFIG.PAGE_ORIENTATION,

            unit: PDF_CONFIG.UNIT,

            format: PDF_CONFIG.PAGE_FORMAT

        });

        /*
        ====================================================
                Convert canvas to JPEG
        ====================================================
        */

        const imgData = canvas.toDataURL(

            "image/jpeg",

            PDF_CONFIG.IMAGE_QUALITY

        );

        /*
        ====================================================
                Add image to PDF page

                A4 Portrait: 210 x 297 mm
        ====================================================
        */

        const pageWidth =
            pdf.internal.pageSize.getWidth();

        const pageHeight =
            pdf.internal.pageSize.getHeight();

        pdf.addImage(

            imgData,

            "JPEG",

            0,

            0,

            pageWidth,

            pageHeight

        );

        pdfLog(
            "PDF generated successfully."
        );

        return pdf;

    }

    catch (error) {

        console.error(
            "PDF Generation Error:",
            error
        );

        return null;

    }

    finally {

        PDF_MODULE.generating = false;

        PDF_MODULE.authorizedGeneration = false;

    }

}


/*==========================================================
                DOWNLOAD PDF
==========================================================*/


/* ==========================================
    RETRYABLE PAID PDF DOWNLOAD
========================================== */


/* ==========================================
    AUTOMATIC PAID PDF DOWNLOAD
    NO MANUAL CONFIRMATION
========================================== */

async function downloadPDF() {

    if (window.paidDownloadBusy) {

        return;

    }

    window.paidDownloadBusy = true;

    PDF_MODULE.downloading = true;

    try {

        /*
        ====================================================
                Check payment functions
        ====================================================
        */

        if (
            typeof window.paymentPost !== "function"
        ) {

            throw new Error(
                "Payment verification service is unavailable."
            );

        }

        /*
        ====================================================
                Get pending payment
        ====================================================
        */

        const pending =
            window.getPendingPayment?.();

        const token =
            pending?.token ||
            localStorage.getItem("downloadToken");

        if (!token) {

            alert(
                "Payment verification is required. " +
                "Please click Download PDF again."
            );

            return;

        }

        /*
        ====================================================
            If a download was already initiated,
            finalize that attempt instead of
            downloading again.

            This preserves the payment recovery logic.
        ====================================================
        */

        if (pending?.downloadInitiated) {

            await finalizePaidDownload(token);

            return;

        }

        /*
        ====================================================
                Confirm payment has unused credit
        ====================================================
        */

        const verification =
            await window.paymentPost(

                "verify-download",

                { token }

            );

        if (!verification.success) {

            alert(
                "Download credit is not available."
            );

            return;

        }

        /*
        ====================================================
                Generate PDF before consuming credit

                Set authorization only after the
                backend verifies the token.
        ====================================================
        */

        PDF_MODULE.authorizedGeneration = true;

        const pdf = await generatePDF();

        PDF_MODULE.authorizedGeneration = false;

        if (!pdf) {

            alert(
                "PDF generation failed. " +
                "Your payment credit has not been " +
                "consumed by this download attempt. " +
                "Please retry."
            );

            return;

        }

        /*
        ====================================================
                Prepare filename
        ====================================================
        */

        const fullName = (

            biodata.personal?.fullName || "Unknown"

        ).trim();

        const education = (

            biodata.education?.highestQualification ||
            "Education"

        ).trim();

        const fileName = (

            fullName + "_" + education + ".pdf"

        ).replace(/[\\/:*?"<>|]/g, "_");

        /*
        ====================================================
                Initiate browser download
        ====================================================
        */

        pdf.save(fileName);

        /*
        ====================================================
                Remember download was initiated

                This is important if mark-used fails
                after the browser starts the download.
        ====================================================
        */

        if (pending) {

            pending.downloadInitiated = true;

            const stored =
                window.savePendingPayment?.(pending);

            if (stored === false) {

                console.warn(
                    "Download started, but recovery state " +
                    "could not be updated."
                );

            }

        }

        /*
        ====================================================
                Automatically consume payment credit
        ====================================================
        */

        await finalizePaidDownload(token);

    }

    catch (error) {

        console.error(
            "PDF Download Error:",
            error
        );

        alert(
            "PDF download or payment finalization failed.\n" +
            "Please retry. If the browser already started " +
            "the download, check your Downloads folder.\n\n" +
            error.message
        );

    }

    finally {

        PDF_MODULE.authorizedGeneration = false;

        PDF_MODULE.downloading = false;

        window.paidDownloadBusy = false;

    }

}


/* ==========================================
    FINALIZE SUCCESSFUL DOWNLOAD ATTEMPT
========================================== */

async function finalizePaidDownload(token) {

    if (!token) {

        throw new Error(
            "Download token is missing."
        );

    }

    if (
        typeof window.paymentPost !== "function"
    ) {

        throw new Error(
            "Payment service is unavailable."
        );

    }

    const result = await window.paymentPost(

        "mark-used",

        { token }

    );

    if (!result.success) {

        throw new Error(
            "Could not finalize the download credit."
        );

    }

    /*
    ========================================================
        Remove payment recovery data after completion
    ========================================================
    */

    window.clearPendingPayment?.();

    localStorage.removeItem(
        "downloadToken"
    );

    /*
    ========================================================
        The next biodata needs a new payment
    ========================================================
    */

    console.log(
        "PDF download initiated. Payment credit consumed."
    );

}


/*==========================================================
                GET PDF BLOB
==========================================================*/

async function getPDFBlob() {

    /*
    ========================================================
        Direct PDF blob generation is intentionally
        unavailable outside the paid workflow.

        Keep this function for compatibility with
        the original pdf.js structure.
    ========================================================
    */

    console.warn(
        "Direct PDF export is unavailable. " +
        "Use the paid Download PDF button."
    );

    return null;

}


/*==========================================================
                PRINT PDF
==========================================================*/

async function printPDF() {

    /*
    ========================================================
        Prevent unpaid PDF printing.

        Download the paid PDF first, then print it
        using the browser or PDF viewer.
    ========================================================
    */

    alert(
        "Please complete the PDF download payment first. " +
        "After downloading the PDF, open it and select Print."
    );

    if (
        typeof window.startPayment === "function"
    ) {

        await window.startPayment();

    }

}


/*==========================================================
                SHARE PDF
==========================================================*/

async function sharePDF() {

    /*
    ========================================================
        Prevent unpaid PDF sharing.

        The downloaded PDF can be shared using
        WhatsApp or another application afterward.
    ========================================================
    */

    alert(
        "Please download your paid biodata PDF first. " +
        "You can then share the saved PDF."
    );

    if (
        typeof window.startPayment === "function"
    ) {

        await window.startPayment();

    }

}


/*==========================================================
                OPEN PDF
==========================================================*/

async function openPDF() {

    /*
    ========================================================
        Do not expose a full PDF before payment.
    ========================================================
    */

    alert(
        "Please complete payment and download your PDF. " +
        "You can open the downloaded file afterward."
    );

    if (
        typeof window.startPayment === "function"
    ) {

        await window.startPayment();

    }

}


/*==========================================================
                DOWNLOAD AS BLOB URL
==========================================================*/

async function downloadBlobURL() {

    /*
    ========================================================
        Preserve the original helper name.

        Route downloads through the existing Razorpay
        payment and download-recovery system.
    ========================================================
    */

    if (
        typeof window.startPayment === "function"
    ) {

        await window.startPayment();

    } else {

        alert(
            "Payment system is unavailable. Please refresh."
        );

    }

}


/*==========================================================
                CHECK PDF SUPPORT
==========================================================*/

function isPDFSupported() {

    return (

        typeof html2canvas !== "undefined" &&

        typeof jspdf !== "undefined" &&

        typeof jspdf.jsPDF === "function"

    );

}


/*==========================================================
                SHOW ERROR
==========================================================*/

function showPDFError(message) {

    console.error(message);

    alert(message);

}


/*==========================================================
                EXPORT FUNCTIONS
==========================================================*/

/*
    Payment.js calls window.downloadPDF() after
    successful backend verification.

    Keep that public function available.

    Do not publicly export the raw PDF-generation
    function as an intended API.
*/

window.downloadPDF = downloadPDF;

window.printPDF = printPDF;

window.sharePDF = sharePDF;

window.openPDF = openPDF;


/*==========================================================
                IMAGE OPTIMIZATION
==========================================================*/

function optimizeCanvas(canvas) {

    if (!canvas) {

        return null;

    }

    const optimizedCanvas =
        document.createElement("canvas");

    optimizedCanvas.width =
        canvas.width;

    optimizedCanvas.height =
        canvas.height;

    const ctx =
        optimizedCanvas.getContext("2d");

    if (!ctx) {

        return null;

    }

    ctx.imageSmoothingEnabled = true;

    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(

        canvas,

        0,

        0,

        optimizedCanvas.width,

        optimizedCanvas.height

    );

    return optimizedCanvas;

}


/*==========================================================
                    WAIT
==========================================================*/

function wait(milliseconds) {

    return new Promise(resolve => {

        setTimeout(
            resolve,
            milliseconds
        );

    });

}


/*==========================================================
                SAFE EXECUTION
==========================================================*/

async function executeSafely(task) {

    try {

        return await task();

    }

    catch (error) {

        console.error(error);

        showPDFError(error.message);

        return null;

    }

}


/*==========================================================
                RESET MODULE
==========================================================*/

function resetPDFModule() {

    PDF_MODULE.generating = false;

    PDF_MODULE.downloading = false;

    PDF_MODULE.authorizedGeneration = false;

}


/*==========================================================
                DESTROY MODULE
==========================================================*/

function destroyPDFModule() {

    cleanupPDF();

    resetPDFModule();

}


/*==========================================================
                CHECK LIBRARIES
==========================================================*/

function verifyLibraries() {

    if (
        typeof html2canvas === "undefined"
    ) {

        throw new Error(
            "html2canvas library is missing."
        );

    }

    if (
        typeof jspdf === "undefined" ||
        typeof jspdf.jsPDF !== "function"
    ) {

        throw new Error(
            "jsPDF library is missing."
        );

    }

}


/*==========================================================
                INITIAL CHECK
==========================================================*/

window.addEventListener(

    "load",

    () => {

        try {

            verifyLibraries();

            pdfLog(
                "Libraries loaded successfully."
            );

        }

        catch (error) {

            console.error(error);

            alert(error.message);

        }

    }

);


/*==========================================================
                FILE NAME
==========================================================*/

function setPDFFileName(fileName) {

    if (!fileName) {

        return;

    }

    PDF_CONFIG.FILE_NAME = fileName;

}


/*==========================================================
                QUALITY
==========================================================*/

function setPDFQuality(
    scale = 2,
    quality = 1.0
) {

    PDF_CONFIG.SCALE = scale;

    PDF_CONFIG.IMAGE_QUALITY = quality;

}


/*==========================================================
                    DEBUG
==========================================================*/

function enablePDFDebug() {

    PDF_CONFIG.DEBUG = true;

}


/*==========================================================
                    DISABLE DEBUG
==========================================================*/

function disablePDFDebug() {

    PDF_CONFIG.DEBUG = false;

}


/*==========================================================
                    VERSION
==========================================================*/

const PDF_VERSION = "2.2.0";

pdfLog(
    "PDF Module Version : " + PDF_VERSION
);


/*==========================================================
                GLOBAL EXPORTS
==========================================================*/

window.PDF_CONFIG = PDF_CONFIG;

window.PDF_MODULE = PDF_MODULE;

window.setPDFFileName = setPDFFileName;

window.setPDFQuality = setPDFQuality;

window.enablePDFDebug = enablePDFDebug;

window.disablePDFDebug = disablePDFDebug;

window.destroyPDFModule = destroyPDFModule;

pdfLog("PDF Module Ready.");

console.log("pdf.js loaded");


/*==========================================================
                    END OF PDF.JS
==========================================================*/






