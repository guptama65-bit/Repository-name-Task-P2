# DEV@Deakin – Welcome Email (Task P2)

A portfolio page with a newsletter form. Submitting name + email sends a welcome email through Brevo (Node.js + Express).

## Run
1. `npm install`
2. Copy `.env.example` to `.env` and set `BREVO_API_KEY` and `FROM_EMAIL` (a sender you verified in Brevo → Senders).
3. `npm start` and open http://localhost:3000
4. Subscribe; the terminal prints `Brevo status: 201` (Brevo accepted the email).

## Security
- The API key lives only in `.env`, which is git-ignored; `.env.example` shows the format.
- The server serves only the four public front-end files, so `.env` can never be downloaded.
- Subscribers are saved to `subscribers.json` (git-ignored).
- Input is validated and HTML-escaped; errors never reveal key details.
