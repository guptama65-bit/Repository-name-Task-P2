
require("dotenv").config();

const express = require("express");
const sgMail = require("@sendgrid/mail");
const path = require("path");

const app = express();
const PORT = 3000;

if (!process.env.API_KEY || !process.env.FROM_EMAIL) {
    console.error("Missing API_KEY or FROM_EMAIL in .env");
    process.exit(1);
}

sgMail.setApiKey(process.env.API_KEY);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const subscribers = [];

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
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
