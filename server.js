
require("dotenv").config({ path: "code.env" });

const express = require("express");
const sgMail = require("@sendgrid/mail");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Configure SendGrid
if (!process.env.API_KEY || !process.env.FROM_EMAIL) {
    console.error("Missing API_KEY or FROM_EMAIL in code.env");
    process.exit(1);
}

sgMail.setApiKey(process.env.API_KEY);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve index.html, CSS, JavaScript, and images from this folder
app.use(express.static(__dirname));

// Newsletter subscription and welcome email
app.post("/subscribe", async (req, res) => {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();

    if (!name || !email) {
        return res.status(400).json({
            message: "Please enter your name and email."
        });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        return res.status(400).json({
            message: "Please enter a valid email address."
        });
    }

    const message = {
        to: email,
        from: process.env.FROM_EMAIL,
        subject: "Welcome to DEV@Deakin!",
        text: `Hello ${name},

Welcome to DEV@Deakin!

Thank you for subscribing to our newsletter.
We are happy to have you in our community!

Regards,
DEV@Deakin Team`
    };

    try {
        await sgMail.send(message);

        return res.status(200).json({
            message: `Thank you, ${name}! Your welcome email has been sent.`
        });
    } catch (error) {
        console.error(
            "SendGrid error:",
            error.response?.body || error.message
        );

        return res.status(500).json({
            message: "Unable to send your welcome email. Please check your SendGrid settings."
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
