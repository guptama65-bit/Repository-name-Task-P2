require("dotenv").config({ path: ".env", quiet: true });

const express = require("express");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.BREVO_API_KEY || !process.env.FROM_EMAIL) {
    console.error("Missing BREVO_API_KEY or FROM_EMAIL. Copy .env.example to .env and fill it in.");
    process.exit(1);
}

app.use(express.json());

// Mailing list: subscribers are stored in subscribers.json (git-ignored, contains personal data)
const LIST_FILE = __dirname + "/subscribers.json";
function addToMailingList(name, email) {
    let list = [];
    try { list = JSON.parse(fs.readFileSync(LIST_FILE, "utf8")); } catch (e) { /* first subscriber */ }
    if (list.some((s) => s.email === email)) return false; // already subscribed
    list.push({ name, email, subscribedAt: new Date().toISOString() });
    fs.writeFileSync(LIST_FILE, JSON.stringify(list, null, 2));
    return true;
}

// Serve only the public front-end files (never the whole folder, so .env can't be fetched)
const publicFiles = ["index.html", "style.css", "script.js", "mayank.jpg"];
app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));
publicFiles.forEach((file) =>
    app.get("/" + file, (req, res) => res.sendFile(__dirname + "/" + file))
);

const escapeHtml = (s) =>
    s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

app.post("/subscribe", async (req, res) => {
    const name = String(req.body.name || "").trim().slice(0, 80);
    const email = String(req.body.email || "").trim().toLowerCase().slice(0, 254);

    if (name.length < 2 || !email) {
        return res.status(400).json({ message: "Please enter your name and email." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: "Please enter a valid email address." });
    }

    const message = {
        sender: { name: "DEV@Deakin", email: process.env.FROM_EMAIL },
        to: [{ email, name }],
        subject: "Welcome to DEV@Deakin!",
        textContent: `Hello ${name},

Welcome to DEV@Deakin!

Thank you for subscribing to our newsletter.

You can explore educational articles, programming tutorials,
technology news and learning resources on our website.

We are happy to have you in our community!

Regards,
DEV@Deakin Team`,
        htmlContent: `<p>Hello ${escapeHtml(name)},</p>
<p><strong>Welcome to DEV@Deakin!</strong></p>
<p>Thank you for subscribing to our newsletter.</p>
<p>You can explore educational articles, programming tutorials, technology news and learning resources on our website.</p>
<p>We are happy to have you in our community!</p>
<p>Regards,<br>DEV@Deakin Team</p>`
    };

    try {
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "api-key": process.env.BREVO_API_KEY,
                "content-type": "application/json",
                accept: "application/json"
            },
            body: JSON.stringify(message)
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(`Brevo ${response.status}: ${JSON.stringify(result)}`);
        const isNew = addToMailingList(name, email);
        console.log(isNew ? "Added to mailing list." : "Already on mailing list.");
        console.log("Welcome email sent successfully.");
        console.log("Brevo status:", response.status, "(accepted)");
        console.log("Message ID:", result.messageId);
        console.log("Subscriber:", email);
        return res.status(200).json({ message: `Thank you, ${name}! Your welcome email has been sent.` });
    } catch (error) {
        console.error("Brevo error:", error.message);
        return res.status(500).json({ message: "Unable to send your welcome email. Please try again later." });
    }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
