# Dilleen Dental — Production Launch Checklist

This file tracks everything that must happen when the Vercel prototype is
connected to the production domain, `https://dilleendental.com.au`. Phase 2
has now prepared canonical tags, Open Graph/Twitter metadata, JSON-LD
structured data, `sitemap.xml`, and a ready-to-swap production `robots.txt`
— all already referencing the production domain. None of it has been
activated or submitted anywhere yet; it's built and waiting for launch.

## What Phase 2 already prepared (nothing left to build here)

- [x] `<link rel="canonical">` added to all 6 pages, each pointing to its
  `https://dilleendental.com.au/...` URL (never the `.vercel.app` domain).
- [x] Open Graph and Twitter Card metadata added to all 6 pages.
- [x] JSON-LD structured data added: `Dentist`/Organization (NAP + opening
  hours), `WebSite` (homepage only), `BreadcrumbList` (per page), `Person`
  for each of the 4 dentists (`full-team.html`), and a `makesOffer` service
  catalog for the 9 services (`services.html`). No `AggregateRating` or
  `Review` schema was added, per instruction — none exists on the site.
- [x] `sitemap.xml` created, listing the 6 real crawlable pages at their
  production URLs. Deliberately excludes `services.html`'s hash routes
  (`#dental-implants` etc.) since those aren't independently crawlable
  URLs — see the Phase 1 audit for why.
- [x] `robots.production.txt` prepared as a ready-to-swap file (allows
  crawling, references the production sitemap) — kept separate from the
  live, still-blocking `robots.txt` so the prototype stays protected.

## Before launch (do these first)

- [ ] **Remove the temporary `noindex` protection.** Delete the
  `<meta name="robots" content="noindex, nofollow">` tag (and its "TEMPORARY"
  comment) from all 6 pages: `index.html`, `about-us.html`, `full-team.html`,
  `services.html`, `appointment.html`, `contact-team.html`.
- [ ] **Activate the production `robots.txt`.** Replace the contents of the
  live `/robots.txt` (currently `Disallow: /`) with the contents already
  prepared in `robots.production.txt`, then delete `robots.production.txt`.
- [ ] **Confirm the final domain is the primary canonical domain.** The
  canonical tags already added all point to `https://dilleendental.com.au/...`
  — just confirm DNS/hosting actually serves the site from that domain as
  the single canonical version (www vs non-www, http vs https all resolved).
- [ ] **Test all canonical URLs** on the live production domain once DNS is
  connected — the tags are in place, but only testable end-to-end once the
  domain is live.
- [ ] **Test all redirects and internal links** on the production domain —
  re-check the Book Now button, nav links, footer links and service-card
  links behave correctly once real DNS/redirects are in front of them.
- [ ] **Test schema markup.** The JSON-LD is already in place and can be
  validated with Google's Rich Results Test right now, even while the
  prototype is noindexed — do this before launch, then re-check once live
  on the production domain.
- [ ] **Verify `robots.txt`** is being served correctly at
  `https://dilleendental.com.au/robots.txt` after the swap above.
- [ ] **Verify `sitemap.xml`** is reachable at
  `https://dilleendental.com.au/sitemap.xml` and lists only production URLs.
- [ ] **Submit the production sitemap to Google Search Console** — under a
  property for `https://dilleendental.com.au`, not the Vercel domain. Per
  earlier instruction, the `.vercel.app` URL and its sitemap must never be
  submitted to Search Console at any point, including before launch.
- [ ] **Ensure the Vercel prototype address doesn't compete with the final
  domain.** Once DNS is cut over, confirm the `.vercel.app` URL either
  redirects to the production domain or remains fully de-indexed/blocked —
  it should never be independently crawlable once the real site is live.

## Also required before launch (not yet covered by the SEO strategy phases)

- [ ] **Connect a real backend to `appointment.html` and `contact-team.html`.**
  Both forms are currently front-end-only prototypes — confirmed by
  inspection: `event.preventDefault()` with no `fetch`/`XHR` call anywhere,
  no form `action` attribute, and no third-party form-handling service
  wired up. Both forms already display honest placeholder messaging
  disclosing this ("Connect the form to your booking system or email
  handler before publishing it live" / "Connect it to your email or website
  form handler to receive enquiries") — that messaging must not be removed
  or replaced with a false "your request has been sent" claim until a real,
  approved backend is actually connected and tested.
- [ ] **Get explicit sign-off before collecting real patient information**
  through either form, per instruction — this includes confirming how
  submitted data will be transmitted, stored and secured (health information
  has its own handling obligations in Australia).

## Reference

- Prototype URL (do not use in any permanent SEO reference): `https://dilleen-dental.vercel.app/`
- Production domain (use for all canonical/OG/schema/sitemap URLs): `https://dilleendental.com.au/`

