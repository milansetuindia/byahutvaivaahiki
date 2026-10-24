/* ==========================================
   PAYMENT WITH DOWNLOAD RECOVERY
========================================== */

const PENDING_PAYMENT_KEY = "jv_pending_paid_pdf_v1";

let paymentBusy = false;


/* ==========================================
   GET EXISTING PAYMENT RECORD
========================================== */

function getPendingPayment() {

    for (const store of [localStorage, sessionStorage]) {

        try {

            const value = store.getItem(
                PENDING_PAYMENT_KEY
            );

            if (value) {
                return JSON.parse(value);
            }

        } catch (error) {

            console.warn(
                "Cannot read saved payment:",
                error
            );

        }

    }

    return null;

}


/* ==========================================
   SAVE PAYMENT RECORD
========================================== */

function savePendingPayment(value) {

    const json = JSON.stringify(value);

    // Persistent storage is required for payment recovery.
    try {

        localStorage.setItem(PENDING_PAYMENT_KEY, json);

    } catch (error) {

        console.error("Cannot save payment recovery data:", error);

        return false;

    }

    // Optional second copy for this tab.
    try {

        sessionStorage.setItem(PENDING_PAYMENT_KEY, json);

    } catch (error) {

        console.warn("Session backup unavailable:", error);

    }

    return true;
}

/* ==========================================
   CLEAR COMPLETED PAYMENT RECORD
========================================== */

function clearPendingPayment() {

    for (const store of [localStorage, sessionStorage]) {

        try {
            store.removeItem(PENDING_PAYMENT_KEY);
        } catch (error) {
            console.warn(error);
        }

    }

}


/* ==========================================
   CALL BACKEND API
========================================== */

async function paymentPost(route, payload) {

    const response = await fetch(

        window.API_URL + "/api/payment/" + route,

        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(payload)
        }

    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Payment service unavailable"
        );
    }

    return data;

}


/* ==========================================
   OPEN OR RESUME RAZORPAY CHECKOUT
========================================== */

function openRazorpayCheckout(order, pending) {

    if (!order?.id || !order?.amount || !order?.currency) {
        throw new Error("Incomplete Razorpay order details.");
    }

    if (
        !window.RAZORPAY_KEY ||
        typeof Razorpay === "undefined"
    ) {
        throw new Error("Razorpay checkout is not configured.");
    }

    const options = {

        key: window.RAZORPAY_KEY,

        amount: order.amount,

        currency: order.currency,

        name: window.APP_NAME || "Jaiswal Vaivaahiki",

        description: "Matrimonial Biodata PDF",

        order_id: order.id,

        handler: async function(response) {

            // Preserve the successful checkout response
            // before contacting the backend.

            const latest = getPendingPayment() || pending;

            latest.razorpayResponse = response;

            if (!savePendingPayment(latest)) {

                alert(
                    "Payment response could not be saved. " +
                    "Keep this page open and contact support."
                );

                return;
            }

            await recoverPaidDownload();
        },

        theme: {
            color: "#7B1113"
        }
    };

    const checkout = new Razorpay(options);

    checkout.open();
}



/* ==========================================
   RECOVER PAYMENT OR RESUME CHECKOUT
========================================== */

async function recoverPaidDownload() {

    const pending = getPendingPayment();

    if (!pending) {
        return false;
    }

    try {

        // Download was initiated earlier, but backend
        // finalization may have failed due to slow internet.

        if (pending.downloadInitiated && pending.token) {

            await finalizePaidDownload(pending.token);

            return true;
        }

        // Reuse an existing verified credit.

        if (pending.token) {

            const status = await paymentPost(
                "verify-download",
                {
                    token: pending.token
                }
            );

            if (status.success) {

                await downloadPDF();

                return true;
            }
        }

        let data = null;

        // Verify the Razorpay callback if available.

        if (pending.razorpayResponse) {

            try {

                data = await paymentPost(
                    "verify-payment",
                    pending.razorpayResponse
                );

            } catch (error) {

                // A network or capture delay may prevent
                // immediate verification. Ask Razorpay again
                // through our backend below.

                console.warn(
                    "Callback verification pending:",
                    error.message
                );
            }
        }

        // Recover payment directly from Razorpay.

        if (!data?.success) {

            data = await paymentPost(
                "recover-payment",
                {
                    orderId: pending.orderId,
                    recoveryKey: pending.recoveryKey
                }
            );
        }

        // SUCCESSFUL PAYMENT

        if (data.success && data.token) {

            pending.token = data.token;

            if (!savePendingPayment(pending)) {

                alert(
                    "Payment verified, but recovery details " +
                    "could not be saved. Do not pay again."
                );

                return true;
            }

            await downloadPDF();

            return true;
        }

        // UNPAID ORDER: REOPEN THE SAME CHECKOUT

        if (data.pending && data.resumable && data.order) {

            openRazorpayCheckout(data.order, pending);

            return true;
        }

        // Payment could be authorized or otherwise unsettled.
        // Do not open a second checkout when status is uncertain.

        alert(
            data.message ||
            "Payment status is not settled yet. " +
            "Please retry later without paying again."
        );

        return true;

    } catch (error) {

        console.error("Payment Recovery Error:", error);

        // Already consumed or invalid download credit.

        if (
            error.message === "Download already used" ||
            error.message === "Download token not found"
        ) {

            clearPendingPayment();

            try {
                localStorage.removeItem("downloadToken");
            } catch (_) {}

            // A new biodata can now create a new order.
            return false;
        }

        // Keep any uncertain paid order for recovery.

        alert(
            "Unable to verify your previous payment.\n\n" +
            "Your payment record has been preserved. " +
            "Please try again later; do not pay again " +
            "until its status is verified.\n\n" +
            error.message
        );

        return true;
    }
}


/* ==========================================
   START PAYMENT OR RECOVER DOWNLOAD
========================================== */

async function startPayment() {

    if (paymentBusy) {
        return;
    }

    paymentBusy = true;

    try {

        // Check any previously verified token.

        const oldToken =
            localStorage.getItem("downloadToken");

        if (oldToken && !getPendingPayment()) {

            try {

                const data = await paymentPost(
                    "verify-download",
                    {
                        token: oldToken
                    }
                );

                if (data.success) {

                    await downloadPDF();

                    return;

                }

            } catch (error) {

                if (
                    error.message === "Download already used" ||
                    error.message === "Download token not found"
                ) {

                    localStorage.removeItem("downloadToken");

                } else {

                    throw error;

                }

            }

        }

        // Never create a new order while an earlier
        // payment is unresolved.

        const recovered = await recoverPaidDownload();

        if (recovered) {
            return;
        }

        // Create a new order only if there is
        // no outstanding payment record.

        const data = await paymentPost(
            "create-order",
            {}
        );

        if (
            !data.success ||
            !data.order?.id ||
            !data.recoveryKey
        ) {
            throw new Error(
                "Unable to create payment order"
            );
        }

        const pending = {

            orderId: data.order.id,

            recoveryKey: data.recoveryKey,

            amount: data.order.amount,

            currency: data.order.currency

        };

        // Save recovery details BEFORE opening Razorpay.

        if (!savePendingPayment(pending)) {

            throw new Error(
                "Cannot save payment recovery details. " +
                "Back up your biodata and free browser storage " +
                "before making payment."
            );

        }

        openRazorpayCheckout(data.order, pending);

    } catch (error) {

        console.error(
            "Payment Error:",
            error
        );

        alert(
            error.message ||
            "Payment unavailable. Please retry later."
        );

    } finally {

        paymentBusy = false;

    }

}


/* ==========================================
   GLOBAL FUNCTIONS
========================================== */

window.startPayment = startPayment;

window.getPendingPayment = getPendingPayment;

window.savePendingPayment = savePendingPayment;

window.clearPendingPayment = clearPendingPayment;

window.paymentPost = paymentPost;