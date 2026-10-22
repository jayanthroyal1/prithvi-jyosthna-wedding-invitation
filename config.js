/*  Settings used by the page's scripts. All wording lives in index.html. */
window.INVITE = {
  // Wedding muhurtham — drives the countdown
  date: "2026-12-19T07:49:00-06:00",

  // Background music (starts when the envelope is tapped).
  // Taken from the reference reel: Etrusco Music · Tamil Nadu Traditional Music (Ancient South Indian Heritage)
  music: { src: "assets/music.mp3?v=2", volume: 0.7 },

  // RSVP: WhatsApp number with country code, digits only (e.g. "14695551234").
  // Leave "" and "Send RSVP on WhatsApp" lets the guest pick the chat to send it to.
  whatsappNumber: "",
  // "Prefer to call? Call the family" — phone with country code, e.g. "+14695551234". Leave "" to hide the line.
  callNumber: "",
  // Google Form shown as a second way to RSVP
  rsvpUrl: "https://forms.gle/Wqi8K8yjgFob7DCH6",

  // Venue for "Directions"
  venueQuery: "Serengeti Estates, Gate B, 3487 Co Rd 338, Melissa, TX 75454",

  // Calendar entries (UTC times)
  events: {
    wedding: {
      title: "Prithvi & Jyosthna — Wedding Muhurtham",
      start: "20261219T134900Z", end: "20261219T183000Z"
    },
    celebration: {
      title: "Prithvi & Jyosthna — Cocktails & Celebration",
      start: "20261221T000000Z", end: "20261221T050000Z"
    }
  }
};
