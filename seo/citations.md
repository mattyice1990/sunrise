# Citation & Local Link Plan — Sunrise Roofers LLC

Values to paste come from `seo/citation-paste.txt` (regenerate with
`node scripts/citation-pack.mjs --write`). Verify the repo still matches with
`node scripts/check-nap.mjs` before any push.

**Rule:** identical NAP every time. Inconsistent listings are worse than no listing.
Tick the box when live, and note anything a directory forced you to change.

---

## Tier 1 — Core maps & search (do first, all free)
These feed the map pack directly.

- [x] **Google Business Profile** — already live
- [ ] **Bing Places** — https://www.bingplaces.com — can import straight from GBP
- [ ] **Apple Business Connect** — https://businessconnect.apple.com — owns Apple Maps + Siri
- [x] **Yelp** — live
- [x] **Facebook** — live
- [ ] **Nextdoor Business** — https://business.nextdoor.com — unusually strong for Tucson home services
- [ ] **Instagram bio link** — confirm it points at https://roofwithsunrise.com

## Tier 2 — Data aggregators (one submission syndicates to hundreds)
Highest leverage per unit of effort. Do these before any individual directory.

- [ ] **Data Axle** — https://www.data-axle.com/support/expressupdate/
- [ ] **Foursquare** — https://location.foursquare.com/products/places/
- [ ] **Neustar Localeze** — paid, ~$99/yr — feeds Apple, Bing, Yelp and many others

## Tier 3 — Roofing / contractor industry
Topically relevant, so these carry more weight than generic directories.

- [x] **BBB** — live (DR 93, best link on the profile)
- [x] **GAF contractor directory** — live (DR 85)
- [x] **Arizona Roofing Contractors Association** — live via arizonaroofers.com
- [ ] **AZ ROC license listing** — https://roc.az.gov — confirm ROC #358079 shows the
      correct address, phone and website; this is a public record Google trusts
- [ ] **Angi** — https://www.angi.com/companylist/join
- [ ] **Thumbtack** — https://www.thumbtack.com/pro
- [ ] **Houzz** — https://www.houzz.com/professionals
- [ ] **Porch** — https://pro.porch.com
- [ ] **BuildZoom** — https://www.buildzoom.com — auto-creates from license data; claim it
- [ ] **Owens Corning contractor locator** — only if a certified installer
- [ ] **NRCA member directory** — https://www.nrca.net — paid membership

## Tier 4 — Tucson local (best map-pack signal after Tier 1)
Local relevance beats domain authority for the map pack. Prioritise these over Tier 5.

- [ ] **Tucson Metro Chamber** — https://www.tucsonchamber.org — paid, strongest local link
- [ ] **Marana Chamber of Commerce** — https://www.maranachamber.com
- [ ] **Oro Valley Chamber** — https://www.orovalleychamber.com
- [ ] **Green Valley / Sahuarita Chamber** — https://www.greenvalleysahuarita.com
- [ ] **Local First Arizona** — https://www.localfirstaz.com
- [ ] **Visit Tucson business directory** — https://www.visittucson.org
- [ ] **Arizona Daily Star / tucson.com business listing** — https://tucson.com

## Tier 5 — General directories (low value, do last)
Cheap consistency signals. Not worth paying for.

- [x] **DexKnows** — live
- [x] **Superpages** — live
- [ ] **Yellow Pages** — https://www.yellowpages.com
- [ ] **Manta** — https://www.manta.com
- [ ] **Hotfrog** — https://www.hotfrog.com
- [ ] **Chamberofcommerce.com** — https://www.chamberofcommerce.com
- [ ] **MapQuest** — https://www.mapquest.com
- [ ] **Alignable** — https://www.alignable.com

---

## Open questions to resolve before bulk submission

1. **The address is a mailbox.** "Ste 154-276" is a PMB/mailbox suite, not a
   storefront. Google's guidelines prohibit listing a mailbox at a mail centre as
   a business address, and this is a suspension risk on GBP as well as a ranking
   limiter. The compliant setup for this business is a **service-area business**
   with the address hidden. Decide this before spraying the address across 30
   directories, because changing it later means redoing all of them.
2. **Schema geo coordinates.** `index.html` carries `32.2226, -110.9747`, which is
   central Tucson, not the La Cholla/Ina area implied by the street address.
   Confirm which is intended and make them agree.
3. **`/backups/*.html` is publicly served** and not blocked in `robots.txt`. Those
   snapshots still carry the old email and old business name, so they are
   indexable duplicate content contradicting the live NAP. Delete or block.
