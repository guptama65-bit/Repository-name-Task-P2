require("dotenv").config();

const express = require("express");
const path = require("path");
const sgMail = require("@sendgrid/mail");

const app = express();

const PORT = 3000;


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

app.post("/subscribe", async (req, res) => {

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

        });

    }


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

        });

    }


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

});


// ======================================
// Start server
// ======================================

app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );

});
