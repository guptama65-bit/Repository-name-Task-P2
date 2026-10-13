<<<<<<< HEAD

require("dotenv").config();

const express = require("express");
const sgMail = require("@sendgrid/mail");
const path = require("path");
=======
require("dotenv").config();

const express = require("express");
const path = require("path");
const sgMail = require("@sendgrid/mail");
>>>>>>> ece768aa69c499030f8099fde312a3ddc14a3bf8

const app = express();

const PORT = 3000;

<<<<<<< HEAD
if (!process.env.API_KEY || !process.env.FROM_EMAIL) {
    console.error("Missing API_KEY or FROM_EMAIL in .env");
    process.exit(1);
}

sgMail.setApiKey(process.env.API_KEY);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const subscribers = [];
=======

// ======================================
// Middleware
// ======================================

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


// Serve index.html
app.use(express.static(__dirname));


// ======================================
// Check .env
// ======================================

console.log(
    "API KEY loaded:",
    process.env.API_KEY ? "YES" : "NO"
);

console.log(
    "FROM EMAIL:",
    process.env.FROM_EMAIL
);


if (!process.env.API_KEY) {

    console.error(
        "ERROR: API_KEY is missing from .env"
    );

    process.exit(1);
}


if (!process.env.FROM_EMAIL) {

    console.error(
        "ERROR: FROM_EMAIL is missing from .env"
    );

    process.exit(1);
}


// ======================================
// SendGrid
// ======================================

sgMail.setApiKey(
    process.env.API_KEY
);


// ======================================
// Subscribe
// ======================================
>>>>>>> ece768aa69c499030f8099fde312a3ddc14a3bf8

app.post("/subscribe", async (req, res) => {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();

<<<<<<< HEAD
    if (!name || !email) {
        return res.status(400).json({
            message: "Please enter your name and email."
=======
    // Get name and email
    const name = req.body.name;

    const email = req.body.email;


    console.log(
        "Subscriber name:",
        name
    );

    console.log(
        "Subscriber email:",
        email
    );


    // Check name
    if (!name) {

        return res.status(400).json({

            message: "Name is required."

        });

    }


    // Check email
    if (!email) {

        return res.status(400).json({

            message: "Email is required."

>>>>>>> ece768aa69c499030f8099fde312a3ddc14a3bf8
        });

    }

<<<<<<< HEAD
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        return res.status(400).json({
            message: "Please enter a valid email address."
=======

    // ==================================
    // Create email
    // ==================================

    const msg = {

        // Subscriber's email
        to: email,


        // IMPORTANT:
        // This MUST be verified in SendGrid
        from: process.env.FROM_EMAIL,


        subject: "Welcome to DEV@Deakin",


        text: `Hello ${name},

Welcome to DEV@Deakin!

Thank you for subscribing to the DEV@Deakin Daily Insider.

We are happy to have you with us.

You will receive the latest news, articles and updates from DEV@Deakin.

Regards,
DEV@Deakin Team`

    };


    // ==================================
    // Send email
    // ==================================

    try {

        const response =
            await sgMail.send(msg);


        console.log(
            "SendGrid status:",
            response[0].statusCode
        );


        console.log(
            "Email sent successfully!"
        );


        res.status(200).json({

            message:
                "Email sent successfully!"

>>>>>>> ece768aa69c499030f8099fde312a3ddc14a3bf8
        });

    }

<<<<<<< HEAD
    const alreadySubscribed = subscribers.some(
        subscriber => subscriber.email === email
    );

    if (alreadySubscribed) {
        return res.status(409).json({
            message: "This email is already subscribed."
        });
    }

    const message = {
        to: email,
        from: process.env.FROM_EMAIL,
        subject: "Newsletter Subscription Confirmation",
        text: `Hello ${name}, thank you for subscribing to our newsletter!`
    };

    try {
        await sgMail.send(message);

        subscribers.push({ name, email });

        return res.status(202).json({
            message: "Subscription accepted successfully!"
        });
    } catch (error) {
        console.error(
            "SendGrid error:",
            error.response?.body || error.message
        );

        return res.status(500).json({
            message: "Unable to process your subscription right now."
        });
    }
=======

    catch (error) {

        console.log(
            "========== SENDGRID ERROR =========="
        );


        if (error.response) {

            console.log(
                "Status:",
                error.response.statusCode
            );


            console.log(
                JSON.stringify(
                    error.response.body,
                    null,
                    2
                )
            );


            res.status(500).json({

                message:
                    error.response.body
                        ?.errors?.[0]?.message ||
                    "SendGrid error occurred."

            });

        }

        else {

            console.log(error);


            res.status(500).json({

                message:
                    error.message ||
                    "Failed to send email."

            });

        }


        console.log(
            "===================================="
        );

    }

>>>>>>> ece768aa69c499030f8099fde312a3ddc14a3bf8
});


// ======================================
// Start server
// ======================================

app.listen(PORT, () => {
<<<<<<< HEAD
    console.log(`Server running at http://localhost:${PORT}`);
=======

    console.log(
        `Server running on http://localhost:${PORT}`
    );

>>>>>>> ece768aa69c499030f8099fde312a3ddc14a3bf8
});
