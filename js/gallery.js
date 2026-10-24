
/*
============================================================
                    GALLERY.JS
            SINGLE PROFILE PHOTO VERSION
============================================================
*/


/*
============================================================
                CONFIGURATION
============================================================
*/

const GALLERY_CONFIG = {

    maxFileSize: 5 * 1024 * 1024,

    supportedTypes: [

        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"

    ],

    defaultImage:
        "assets/images/defaults/default-profile.png",

    storageKey:
        "galleryProfilePhoto",

    debug: true

};


/*
============================================================
                GALLERY STATE
============================================================
*/

const GALLERY_STATE = {

    initialized: false,

    profilePhoto: null,

};


/*
============================================================
                DOM REFERENCES
============================================================
*/

const GALLERY_DOM = {

    profileInput: null,

    profilePreview: null,

    reviewContainer: null

};


/*
============================================================
                DEBUG LOGGER
============================================================
*/

function galleryLog(message, data = "") {

    if (!GALLERY_CONFIG.debug) {

        return;

    }

    console.log("[Gallery]", message, data);

}


/*
============================================================
                INITIALIZATION
============================================================
*/

function initializeGallery() {

    GALLERY_DOM.profileInput =
        document.getElementById(
            "profilePhotoUpload"
        );

    GALLERY_DOM.profilePreview =
        document.getElementById(
            "previewProfilePhoto"
        );

    GALLERY_DOM.reviewContainer =
        document.getElementById(
            "reviewPhotos"
        );

    loadGallery();

    restoreGallery();

    registerGalleryEvents();

    GALLERY_STATE.initialized = true;

    galleryLog("Gallery Initialized");

}


/*
============================================================
            STEP 2 - VALIDATION
============================================================
*/


function galleryMessage(message) {

    alert(message);

}


function isEmptyFile(file) {

    return !file;

}


function isSupportedImage(file) {

    return GALLERY_CONFIG.supportedTypes.includes(
        file.type
    );

}


function isValidImageSize(file) {

    return file.size <=
        GALLERY_CONFIG.maxFileSize;

}


function validateGalleryImage(file) {

    if (isEmptyFile(file)) {

        galleryMessage(
            "Please select an image."
        );

        return false;

    }

    if (!isSupportedImage(file)) {

        galleryMessage(
            "Only JPG, JPEG, PNG and WEBP images are allowed."
        );

        return false;

    }

    if (!isValidImageSize(file)) {

        galleryMessage(
            "Image size should not exceed 5 MB."
        );

        return false;

    }

    return true;

}


/*
============================================================
            STEP 3 - IMAGE PREVIEW
============================================================
*/


function readGalleryImage(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = () => {

            const img = new Image();

            img.onload = () => {

                const maxSize = 1000;

                const scale = Math.min(
                    1,
                    maxSize / Math.max(img.width, img.height)
                );

                const canvas = document.createElement("canvas");

                canvas.width = Math.round(img.width * scale);
                canvas.height = Math.round(img.height * scale);

                const ctx = canvas.getContext("2d");

                if (!ctx) {

                    reject(new Error("Canvas unavailable"));

                    return;

                }

                ctx.fillStyle = "#ffffff";

                ctx.fillRect(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

                ctx.drawImage(
                    img,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

                resolve(
                    canvas.toDataURL("image/jpeg", 0.80)
                );

            };

            img.onerror = reject;

            img.src = reader.result;

        };

        reader.onerror = reject;

        reader.readAsDataURL(file);

    });

}


function updateImagePreview(previewElement, imageSource) {

    if (!previewElement) {

        return;

    }

    previewElement.src = imageSource;

}


function resetImagePreview(previewElement) {

    if (!previewElement) {

        return;

    }

    previewElement.src =
        GALLERY_CONFIG.defaultImage;

}


async function processGalleryImage(

    file,
    previewElement

) {

    if (

        !validateGalleryImage(file)

    ) {

        resetImagePreview(
            previewElement
        );

        return null;

    }

    try {

        const image =
            await readGalleryImage(file);

        updateImagePreview(
            previewElement,
            image
        );

        return image;

    }

    catch (error) {

        console.error(error);

        galleryMessage(
            "Unable to read image."
        );

        resetImagePreview(
            previewElement
        );

        return null;

    }

}


/*
============================================================
            STEP 4 - UPLOAD EVENT LISTENERS
============================================================
*/


/*
============================================================
                HANDLE PROFILE PHOTO
============================================================
*/

async function handleProfilePhotoUpload(event) {

    const file =
        event.target.files[0];

    const fileNameElement =
        document.getElementById(
            "profilePhotoFileName"
        );


    if (fileNameElement) {

        if (file) {

            fileNameElement.textContent =
                file.name;

            fileNameElement.dataset.selected =
                "true";

        } else {

            delete fileNameElement.dataset.selected;

        }

    }


    const image =
        await processGalleryImage(

            file,

            GALLERY_DOM.profilePreview

        );


    if (!image) {

        if (fileNameElement) {

            delete fileNameElement.dataset.selected;

        }

        return;

    }


    GALLERY_STATE.profilePhoto =
        image;


    biodata.photos.profilePhoto = {
        preview: image
    };

    autoSaveGallery();

    if (typeof saveBiodata === "function") {
        saveBiodata();
    }

    refreshGalleryReview();

    synchronizeGalleryWithPDF();

    galleryLog(
        "Profile photo uploaded."
    );

}


/*
============================================================
                REGISTER EVENTS
============================================================
*/

function registerGalleryEvents() {

    if (!GALLERY_DOM.profileInput) {

        return;

    }

    GALLERY_DOM.profileInput.addEventListener(

        "change",

        handleProfilePhotoUpload

    );

}


/*
============================================================
            STEP 5 - PHOTO MANAGEMENT
============================================================
*/


/*
============================================================
                REMOVE PHOTO
============================================================
*/

function removeProfilePhoto() {

    GALLERY_STATE.profilePhoto = null;

    delete biodata.photos.profilePhoto;

    resetImagePreview(
        GALLERY_DOM.profilePreview
    );

    if (GALLERY_DOM.profileInput) {

        GALLERY_DOM.profileInput.value = "";

    }

    autoSaveGallery();

    refreshGalleryReview();

    synchronizeGalleryWithPDF();

    galleryLog("Profile photo removed.");

}


/*
============================================================
                CLEAR GALLERY
============================================================
*/

function clearGallery() {

    removeProfilePhoto();

    clearGalleryStorage();

}


/*
============================================================
                PHOTO COUNT
============================================================
*/

function getUploadedPhotoCount() {

    return GALLERY_STATE.profilePhoto ? 1 : 0;

}


/*
============================================================
            STEP 6 - STORAGE
============================================================
*/


/*
============================================================
                SAVE
============================================================
*/

function saveGallery() {

    try {

        localStorage.setItem(

            GALLERY_CONFIG.storageKey,

            JSON.stringify({

                profilePhoto:
                    GALLERY_STATE.profilePhoto,

            })

        );

    }

    catch (error) {

        console.error(error);

    }

}


/*
============================================================
                LOAD
============================================================
*/

function loadGallery() {

    try {

        const data = localStorage.getItem(

            GALLERY_CONFIG.storageKey

        );

        if (!data) {

            return;

        }

        const gallery = JSON.parse(data);

        GALLERY_STATE.profilePhoto =
            gallery.profilePhoto || null;

    }

    catch (error) {

        console.error(error);

    }

}


/*
============================================================
                RESTORE
============================================================
*/

function restoreGallery() {

    if (!GALLERY_STATE.profilePhoto) {

        return;

    }

    updateImagePreview(

        GALLERY_DOM.profilePreview,

        GALLERY_STATE.profilePhoto

    );

    biodata.photos.profilePhoto = {

        preview: GALLERY_STATE.profilePhoto

    };

    refreshGalleryReview();

}


/*
============================================================
                CLEAR STORAGE
============================================================
*/

function clearGalleryStorage() {

    localStorage.removeItem(

        GALLERY_CONFIG.storageKey

    );

}


/*
============================================================
                AUTO SAVE
============================================================
*/

function autoSaveGallery() {

    saveGallery();

}


/*
============================================================
            STEP 7 - REVIEW PAGE
============================================================
*/


/*
============================================================
                CREATE REVIEW IMAGE
============================================================
*/

function createReviewImage(imageSource) {

    const image = document.createElement("img");

    image.src = imageSource;

    image.className = "img-fluid rounded";

    image.alt = "Profile Photo";

    image.loading = "lazy";

    return image;

}


/*
============================================================
                PLACEHOLDER
============================================================
*/

function createGalleryPlaceholder() {

    const placeholder = document.createElement("div");

    placeholder.className = "text-center";

    placeholder.innerHTML =
        "<p>No profile photo uploaded.</p>";

    return placeholder;

}


/*
============================================================
                UPDATE REVIEW
============================================================
*/

function updateReviewGallery() {

    if (!GALLERY_DOM.reviewContainer) {

        return;

    }

    GALLERY_DOM.reviewContainer.innerHTML = "";

    if (!GALLERY_STATE.profilePhoto) {

        GALLERY_DOM.reviewContainer.appendChild(

            createGalleryPlaceholder()

        );

        return;

    }

    GALLERY_DOM.reviewContainer.appendChild(

        createReviewImage(

            GALLERY_STATE.profilePhoto

        )

    );

}


/*
============================================================
                REFRESH REVIEW
============================================================
*/

function refreshGalleryReview() {

    updateReviewGallery();

    galleryLog(
        "Review Updated"
    );

}


/*
============================================================
            STEP 8 - PDF
============================================================
*/


/*
============================================================
                GET PROFILE PHOTO
============================================================
*/

function getProfilePhotoForPDF() {

    return GALLERY_STATE.profilePhoto;

}


/*
============================================================
                PDF DATA
============================================================
*/

function getGalleryForPDF() {

    return {

        profile:
            GALLERY_STATE.profilePhoto

    };

}


/*
============================================================
                PDF PREVIEW
============================================================
*/

function updatePDFGalleryPreview() {

    galleryLog(

        "PDF Updated",

        getGalleryForPDF()

    );

}


/*
============================================================
                PRINT
============================================================
*/

function prepareGalleryForPrint() {

    updatePDFGalleryPreview();

}


/*
============================================================
                SYNCHRONIZE
============================================================
*/

function synchronizeGalleryWithPDF() {

    prepareGalleryForPrint();

}


/*
============================================================
            STEP 9 - UTILITIES
============================================================
*/


function getDefaultGalleryImage() {

    return GALLERY_CONFIG.defaultImage;

}


function hasProfilePhoto() {

    return GALLERY_STATE.profilePhoto !== null;

}


function getGalleryStatus() {

    return {

        initialized:
            GALLERY_STATE.initialized,

        uploaded:
            hasProfilePhoto(),

        count:
            getUploadedPhotoCount()

    };

}


function printGallerySummary() {

    galleryLog(

        "Gallery Status",

        getGalleryStatus()

    );

}


function optimizeGallery() {

    galleryLog(
        "Gallery Optimized"
    );

}


/*
============================================================
            STEP 10 - FINALIZATION
============================================================
*/


function optimizeGalleryModule() {

    galleryLog(
        "Gallery Module Optimized"
    );

}


function initializeGalleryAccessibility() {

    galleryLog(
        "Accessibility Initialized"
    );

}


function finalizeGalleryModule() {

    optimizeGalleryModule();

    initializeGalleryAccessibility();

    printGallerySummary();

    galleryLog(
        "Gallery Ready"
    );

}


/*
============================================================
                DOM READY
============================================================
*/

document.addEventListener(

    "DOMContentLoaded",

    () => {

        initializeGallery();

        finalizeGalleryModule();

    }

);


/*
============================================================
                SAVE PHOTO DATA
============================================================
*/

function savePhotoData() {

    if (!biodata.photos.profilePhoto) {

        alert("Please upload a profile photo.");

        return false;

    }

    return true;

}

/*
============================================================
                    END OF GALLERY.JS
============================================================
*/
