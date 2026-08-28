const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/subscribe", async (req, res) => {

    const email = req.body.email;

    console.log("Received email:", email);

    // Check whether email was entered
    if (!email) {
        return res.status(400).json({
            message: "Email is required"
        });
    }

    // Check basic email format
    if (!email.includes("@")) {
        return res.status(400).json({
            message: "Please enter a valid email"
        });
    }

    /*
      TODO:
      Add your chosen Email API request here.

      The API should:
      1. Receive the subscriber's email.
      2. Send the welcome email.
      3. Return a 200 or 202 response.
    */

    console.log("Subscriber accepted");

    res.status(202).json({
        message: "Subscription successful!"
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});