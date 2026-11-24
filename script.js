document.getElementById("current-year").textContent = new Date().getFullYear();

const form = document.getElementById("signup-form");
const button = document.getElementById("submit-btn");
const messageBox = document.getElementById("form-message");

function showMessage(text, type) {
    messageBox.textContent = text;
    messageBox.className = type;
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();

    button.disabled = true;
    showMessage("Sending your welcome email...", "");

    try {
        const response = await fetch("/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email })
        });
        const data = await response.json();

        if (response.ok) {
            showMessage(data.message, "success");
            form.reset();
        } else {
            showMessage(data.message || "Something went wrong.", "error");
        }
    } catch (err) {
        showMessage("Could not reach the server. Is it running?", "error");
    } finally {
        button.disabled = false;
    }
});
