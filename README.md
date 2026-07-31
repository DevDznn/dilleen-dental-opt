# Dilleen Dental Website

Open `index.html` in a browser to preview the website.

## Project structure

```text
/
├── index.html
├── about-us.html
├── services.html
├── full-team.html
├── appointment.html
├── contact-team.html
├── css/
├── js/
└── images/
```

## Stylesheets

- `css/base.css` — design variables, reset, shared layout, typography and buttons
- `css/header.css` — top bar, navigation and mobile menu
- `css/footer.css` — shared footer
- `css/hero.css`, `trust.css`, `services.css`, `about.css`, `team.css`,
  `funds.css`, `contact.css`, `animations.css` — homepage sections
- `css/about-us.css` — About Us page
- `css/service-page.css` — Services page
- `css/full-team.css` — Full Team page
- `css/appointment.css` — Appointment page
- `css/contact-team.css` — Contact Team page

## JavaScript

Each HTML page loads one matching script from `js/`:

- `js/index.js`
- `js/about-us.js`
- `js/services.js`
- `js/full-team.js`
- `js/appointment.js`
- `js/contact-team.js`

Reusable logos are normal files inside `images/`; no Base64 images or inline
JavaScript are stored inside the HTML.
