# Prithvi & Jyosthna — wedding invitation

A Telugu wedding invitation website. Static HTML/CSS/JS, no build step.

```
index.html   all wording and sections
style.css    look, fonts, animations
script.js    envelope + Ganesha opening, music, scratch & dhol cards, scroll motion, tera, countdown, RSVP
config.js    muhurtham date, music, WhatsApp/call numbers, RSVP form, venue, calendar entries
assets/      images, Telugu font, music
card/        శుభలేఖ — traditional Telugu wedding card (shubhalekha.png for WhatsApp, .pdf for print)
```

## Before sharing
- `config.js`: set `whatsappNumber` (digits with country code) so RSVPs go straight to the family,
  and `callNumber` to show "Call the family".
- `index.html`: the WhatsApp preview image (`og:image`) points to the sister invite's card. After deploying,
  change it to this site's own address, e.g. `https://<your-site>/assets/og/card-kumkum.jpg`.

## Run locally
`python -m http.server 5178` in this folder, then open http://localhost:5178.

## Deploy
Vercel → Add New → Project → import this repository (Framework: Other, no build command).
