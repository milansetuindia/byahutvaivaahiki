/*==========================================================
                        APP.JS
              JAISWAL VAIVAAHIKI
          CORE WEBSITE UI FUNCTIONALITY
==========================================================*/


/*==========================================================
                    APPLICATION START
==========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initializeNavbar();

    initializeScrollTopButton();

    initializeFAQ();

    initializeToast();

    initializeTheme();

    initializeLoader();

    initializeScrollAnimations();

    initializeHeroParallax();

    initializeSupportSection();

});

/*==========================================================
                    NAVBAR
==========================================================*/

function initializeNavbar() {

    const navbar =
        document.querySelector(".custom-navbar");

    const navLinks =
        document.querySelectorAll(".nav-link");

    const navbarCollapse =
        document.querySelector(".navbar-collapse");


    if (!navbar) {
        return;
    }


    /*
        Bootstrap mobile navbar controller
    */

    const bsCollapse =
    navbarCollapse &&
    typeof bootstrap !== "undefined" &&
    bootstrap.Collapse
        ? new bootstrap.Collapse(
            navbarCollapse,
            {
                toggle: false
            }
        )
        : null;


    /*======================================================
                    NAVBAR SHADOW
    ======================================================*/

    function updateNavbarShadow() {

        if (window.scrollY > 40) {

            navbar.style.boxShadow =
                "0 8px 25px rgba(0,0,0,.20)";

        }
        else {

            navbar.style.boxShadow =
                "0 4px 18px rgba(0,0,0,.15)";

        }

    }


    updateNavbarShadow();


    window.addEventListener(
        "scroll",
        updateNavbarShadow,
        { passive: true }
    );


    /*======================================================
                    SMOOTH SCROLL
    ======================================================*/

    navLinks.forEach(link => {

        link.addEventListener(
            "click",
            function(event) {

                const targetId =
                    this.getAttribute("href");


                /*
                    Ignore external links and
                    normal page links.
                */

                if (
                    !targetId ||
                    !targetId.startsWith("#")
                ) {
                    return;
                }


                const target =
                    document.querySelector(
                        targetId
                    );


                if (!target) {
                    return;
                }


                event.preventDefault();


                target.scrollIntoView({

                    behavior: "smooth",

                    block: "start"

                });


                /*
                    Close mobile navbar
                */

                if (
                    window.innerWidth < 992 &&
                    bsCollapse
                ) {

                    bsCollapse.hide();

                }

            }
        );

    });


    /*======================================================
                    ACTIVE MENU
    ======================================================*/

    const sections =
        document.querySelectorAll(
            "section[id]"
        );


    function updateActiveNav() {

        let currentSection = "";


        sections.forEach(section => {

            const sectionTop =
                section.offsetTop - 120;


            if (
                window.scrollY >= sectionTop
            ) {

                currentSection =
                    section.getAttribute("id");

            }

        });


        navLinks.forEach(link => {

            link.classList.remove(
                "active"
            );


            if (
                link.getAttribute("href") ===
                "#" + currentSection
            ) {

                link.classList.add(
                    "active"
                );

            }

        });

    }


    updateActiveNav();


    window.addEventListener(
        "scroll",
        updateActiveNav,
        { passive: true }
    );

}


/*==========================================================
                SCROLL TO TOP BUTTON
==========================================================*/

function initializeScrollTopButton() {

    const scrollTopBtn =
        document.getElementById(
            "scrollTopBtn"
        );


    if (!scrollTopBtn) {
        return;
    }


    function updateScrollTopButton() {

        if (window.scrollY > 300) {

            scrollTopBtn.classList.add(
                "show"
            );

        }
        else {

            scrollTopBtn.classList.remove(
                "show"
            );

        }

    }


    updateScrollTopButton();


    window.addEventListener(
        "scroll",
        updateScrollTopButton,
        { passive: true }
    );


    scrollTopBtn.addEventListener(
        "click",
        () => {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}


/*==========================================================
                    FAQ
==========================================================*/

function initializeFAQ() {

    const accordionButtons =
        document.querySelectorAll(
            ".accordion-button"
        );


    if (
        accordionButtons.length === 0
    ) {

        return;

    }


    accordionButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                /*
                    Removes focus outline after
                    clicking an accordion item.
                */

                button.blur();

            }
        );

    });

}


/*==========================================================
                    TOAST
==========================================================*/

function initializeToast() {

    const toastElement =
        document.getElementById(
            "appToast"
        );


    if (!toastElement) {
        return;
    }


    /*
        Bootstrap may not be available on pages
        where app.js is reused.
    */

    if (
        typeof bootstrap === "undefined" ||
        !bootstrap.Toast
    ) {

        return;

    }


    const toast =
        new bootstrap.Toast(
            toastElement,
            {
                delay: 3500
            }
        );


    /*
        Show the welcome toast after
        the page has loaded.
    */

    setTimeout(() => {

        toast.show();

    }, 800);

}


/*==========================================================
                    THEME TOGGLE
==========================================================*/

function initializeTheme() {

    const themeButton =
        document.getElementById(
            "themeBtn"
        );


    if (!themeButton) {
        return;
    }


    const savedTheme =
        localStorage.getItem("theme");


    if (savedTheme === "dark") {

        enableDarkTheme();

    }
    else {

        enableLightTheme();

    }


    themeButton.addEventListener(
        "click",
        () => {

            const darkModeEnabled =
                document.body.classList.contains(
                    "dark-theme"
                );


            if (darkModeEnabled) {

                enableLightTheme();

            }
            else {

                enableDarkTheme();

            }

        }
    );

}


/*==========================================================
                    DARK THEME
==========================================================*/

function enableDarkTheme() {

    document.body.classList.add(
        "dark-theme"
    );


    localStorage.setItem(
        "theme",
        "dark"
    );


    const button =
        document.getElementById(
            "themeBtn"
        );


    if (button) {

        button.innerHTML = "☀️";

    }

}


/*==========================================================
                    LIGHT THEME
==========================================================*/

function enableLightTheme() {

    document.body.classList.remove(
        "dark-theme"
    );


    localStorage.setItem(
        "theme",
        "light"
    );


    const button =
        document.getElementById(
            "themeBtn"
        );


    if (button) {

        button.innerHTML = "🌙";

    }

}


/*==========================================================
                    PAGE LOADER
==========================================================*/

function initializeLoader() {

    const loader =
        document.getElementById(
            "pageLoader"
        );


    if (!loader) {
        return;
    }


    window.addEventListener(
        "load",
        () => {

            setTimeout(() => {

                loader.classList.add(
                    "hide"
                );

            }, 600);

        }
    );

}


/*==========================================================
                SCROLL ANIMATIONS
==========================================================*/

function initializeScrollAnimations() {

    /*
        IntersectionObserver is supported by
        modern browsers. If unavailable,
        simply skip the animation.
    */

    if (
        !("IntersectionObserver" in window)
    ) {

        return;

    }


    const animatedElements =
        document.querySelectorAll(

            ".hero-content," +

            ".hero-image," +

            ".feature-card," +

            ".preview-card," +

            ".step-card," +

            ".accordion-item," +

            ".footer-box"

        );


    if (
        animatedElements.length === 0
    ) {

        return;

    }


    const observer =
        new IntersectionObserver(

            (entries, observer) => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "fade-up"
                        );


                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },

            {
                threshold: 0.15
            }

        );


    animatedElements.forEach(
        element => {

            observer.observe(
                element
            );

        }
    );

}


/*==========================================================
                HERO IMAGE PARALLAX
==========================================================*/

function initializeHeroParallax() {

    const heroImage =
        document.querySelector(
            ".hero-image img"
        );


    if (!heroImage) {
        return;
    }


    /*
        Respect reduced-motion preference.
    */

    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    if (prefersReducedMotion) {
        return;
    }


    /*
        Use requestAnimationFrame to avoid
        updating the image excessively during
        scrolling.
    */

    let ticking = false;


    function updateParallax() {

        if (!ticking) {

            window.requestAnimationFrame(
                () => {

                    const scrollValue =
                        window.scrollY;


                    heroImage.style.transform =
                        `translateY(${scrollValue * 0.08}px)`;


                    ticking = false;

                }
            );


            ticking = true;

        }

    }


    window.addEventListener(
        "scroll",
        updateParallax,
        { passive: true }
    );

}



/*==========================================================
                SUPPORT / DONATION
==========================================================*/

function initializeSupportSection() {

    const copyButton =
        document.getElementById("copyUpiBtn");

    const donateButton =
        document.getElementById("donateUpiBtn");

    const upiIdElement =
        document.getElementById("upiId");


    /* COPY UPI ID */

    if (copyButton && upiIdElement) {

        copyButton.addEventListener(
            "click",
            async () => {

                const upiId =
                    upiIdElement.textContent.trim();

                try {

                    await navigator.clipboard.writeText(
                        upiId
                    );

                    const originalText =
                        copyButton.innerHTML;

                    copyButton.innerHTML =
                        '<i class="fa-solid fa-check"></i> Copied!';

                    setTimeout(() => {

                        copyButton.innerHTML =
                            originalText;

                    }, 2000);

                }
                catch (error) {

                    alert(
                        "Unable to copy UPI ID. Please copy it manually."
                    );

                }

            }
        );

    }


    /* DONATE VIA UPI */

    if (donateButton && upiIdElement) {

        donateButton.addEventListener(
            "click",
            () => {

                const upiId =
                    upiIdElement.textContent.trim();

                const upiUrl =
                    `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent("Jaiswal Vaivaahiki")}&cu=INR`;

                window.location.href =
                    upiUrl;

            }
        );

    }

}