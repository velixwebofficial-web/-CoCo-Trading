/* =========================================================
   WQ Wholesale responsive design system
   Desktop, tablet, and mobile layouts
========================================================= */
:root {
  --navy-950: #041426;
  --navy-900: #061c35;
  --navy-850: #082440;
  --navy-800: #0a2e52;
  --blue-700: #0b4c8c;
  --blue-600: #1465ad;
  --blue-100: #eaf3fb;
  --ink: #132033;
  --muted: #637083;
  --line: #e5eaf0;
  --soft: #f5f7fa;
  --white: #fff;
  --beige: #f6f1ed;
  --shadow-sm: 0 8px 28px rgba(6, 28, 53, .08);
  --shadow-md: 0 20px 60px rgba(6, 28, 53, .14);
  --radius-sm: 12px;
  --radius-md: 20px;
  --radius-lg: 30px;
  --container: 1280px;
  --header-height: 84px;
  --ease: 220ms ease;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; scroll-padding-top: calc(var(--header-height) + 20px); }
body { margin: 0; min-width: 320px; font-family: "Poppins", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: var(--ink); background: var(--white); line-height: 1.65; overflow-x: hidden; }
body.menu-open { overflow: hidden; }
img { display: block; max-width: 100%; }
a { color: inherit; text-decoration: none; }
button, input, select, textarea { font: inherit; }
button { color: inherit; }
ul { margin: 0; padding: 0; list-style: none; }
h1, h2, h3, p { margin-top: 0; }
h1, h2, h3 { line-height: 1.14; }
button, a { -webkit-tap-highlight-color: transparent; }
[hidden] { display: none !important; }

.container { width: min(calc(100% - 40px), var(--container)); margin-inline: auto; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
.skip-link { position: fixed; left: 12px; top: -80px; z-index: 10000; padding: 10px 16px; color: var(--white); background: var(--navy-950); border-radius: 8px; transition: top var(--ease); }
.skip-link:focus { top: 12px; }

/* Top bar */
.topbar { background: var(--navy-950); color: rgba(255,255,255,.88); font-size: 12px; }
.topbar__inner { min-height: 38px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
.topbar__contacts, .topbar__locations { display: flex; align-items: center; gap: 22px; }
.topbar a { display: inline-flex; align-items: center; gap: 7px; transition: color var(--ease); }
.topbar a:hover { color: var(--white); }

/* Header and navbar */
.site-header { position: sticky; top: 0; z-index: 1000; background: rgba(255,255,255,.97); border-bottom: 1px solid rgba(229,234,240,.86); box-shadow: 0 4px 20px rgba(6,28,53,.04); backdrop-filter: blur(14px); }
.nav-shell { min-height: var(--header-height); display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: clamp(22px, 4vw, 58px); }
.brand { display: inline-flex; align-items: center; flex-shrink: 0; }
.brand img { width: 94px; height: auto; }
.primary-nav { justify-self: center; }
.nav-menu { display: flex; align-items: center; gap: clamp(18px, 2.5vw, 38px); }
.nav-menu a { position: relative; display: block; padding: 31px 0 27px; font-size: 13px; font-weight: 600; letter-spacing: .03em; color: #263349; white-space: nowrap; }
.nav-menu a::after { content: ""; position: absolute; left: 50%; bottom: 19px; width: 0; height: 2px; background: var(--blue-600); transform: translateX(-50%); transition: width var(--ease); }
.nav-menu a:hover, .nav-menu a.active { color: var(--blue-700); }
.nav-menu a:hover::after, .nav-menu a.active::after { width: 28px; }
.nav-actions { display: flex; align-items: center; justify-content: flex-end; gap: 14px; }
.nav-icon, .menu-toggle, .search-close { border: 0; background: transparent; cursor: pointer; }
.nav-icon { width: 42px; height: 42px; display: inline-grid; place-items: center; border-radius: 50%; transition: background var(--ease), color var(--ease); }
.nav-icon:hover { background: var(--blue-100); color: var(--blue-700); }
/* CSS fallback keeps the search control visible even when the icon CDN is offline. */
.search-toggle { position: relative; }
.search-toggle > i { display: none; }
.search-toggle::before { content: ""; width: 13px; height: 13px; border: 2px solid currentColor; border-radius: 50%; transform: translate(-1px, -1px); }
.search-toggle::after { content: ""; position: absolute; width: 7px; height: 2px; background: currentColor; border-radius: 2px; transform: translate(7px, 7px) rotate(45deg); }
.search-close > i { display: none; }
.search-close::before { content: "×"; font-size: 26px; line-height: 1; }
.language-chip { display: inline-flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 600; }
.menu-toggle { display: none; width: 44px; height: 44px; padding: 10px; border-radius: 50%; }
.menu-toggle span { display: block; width: 22px; height: 2px; margin: 5px auto; background: var(--ink); border-radius: 3px; transition: transform var(--ease), opacity var(--ease); }
.menu-toggle[aria-expanded="true"] span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.menu-toggle[aria-expanded="true"] span:nth-child(2) { opacity: 0; }
.menu-toggle[aria-expanded="true"] span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

.search-panel { border-top: 1px solid var(--line); background: var(--white); box-shadow: var(--shadow-sm); }
.search-form { min-height: 76px; display: grid; grid-template-columns: 1fr auto auto; align-items: center; gap: 12px; }
.search-form input { width: 100%; height: 46px; border: 1px solid var(--line); border-radius: 999px; padding: 0 18px; color: var(--ink); outline: none; }
.search-form input:focus { border-color: var(--blue-600); box-shadow: 0 0 0 4px rgba(20,101,173,.10); }
.search-close { width: 42px; height: 42px; font-size: 20px; }

/* Buttons */
.button { min-height: 48px; display: inline-flex; align-items: center; justify-content: center; gap: 10px; padding: 12px 24px; border: 1px solid var(--blue-700); border-radius: 999px; background: var(--blue-700); color: var(--white); font-weight: 600; font-size: 14px; cursor: pointer; box-shadow: 0 10px 24px rgba(11,76,140,.18); transition: transform var(--ease), background var(--ease), box-shadow var(--ease); }
.button:hover { background: var(--blue-600); transform: translateY(-2px); box-shadow: 0 14px 30px rgba(11,76,140,.24); }
.button--small { min-height: 42px; padding: 9px 20px; font-size: 13px; }
.button--outline { color: var(--blue-700); background: transparent; box-shadow: none; }
.button--outline:hover { color: var(--white); }
.button--light { color: var(--navy-900); border-color: var(--white); background: var(--white); box-shadow: none; }
.button--light:hover { color: var(--white); background: transparent; }
.text-link { display: inline-flex; align-items: center; gap: 9px; color: var(--blue-700); font-size: 14px; font-weight: 600; }

/* Hero */
.home-hero { position: relative; min-height: clamp(530px, 49vw, 650px); display: grid; align-items: center; isolation: isolate; overflow: hidden; background: var(--navy-950); }
.home-hero__media { position: absolute; inset: 0; z-index: -3; background: url("../assets/optimized/hero.webp") 50% center / cover no-repeat; transform: scale(1.003); }
.home-hero__shade { position: absolute; inset: 0; z-index: -2; background: linear-gradient(90deg, rgba(4,20,38,.98) 0%, rgba(4,20,38,.91) 28%, rgba(4,20,38,.46) 51%, rgba(4,20,38,.04) 78%); }
.home-hero__content { padding-block: 82px; }
.hero-copy { max-width: 600px; color: var(--white); }
.eyebrow { margin-bottom: 12px; font-size: 12px; font-weight: 700; letter-spacing: .2em; color: var(--blue-600); }
.home-hero .eyebrow, .cta-band .eyebrow, .benefit-strip .eyebrow { color: #b9d7f4; }
.hero-copy h1 { max-width: 580px; margin-bottom: 18px; font-family: "Playfair Display", Georgia, serif; font-size: clamp(52px, 6vw, 82px); font-weight: 700; letter-spacing: -.025em; }
.hero-script { margin-bottom: 18px; font-family: "Playfair Display", Georgia, serif; font-style: italic; font-size: clamp(18px, 2vw, 24px); color: rgba(255,255,255,.92); }
.hero-lead { max-width: 510px; margin-bottom: 28px; color: rgba(255,255,255,.78); font-size: 15px; }
.hero-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 20px; }
.trust-note { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; color: rgba(255,255,255,.80); }

/* Sections */
.section { padding-block: clamp(68px, 7vw, 105px); }
.section--soft { background: var(--soft); }
.section--categories { padding-block: 58px 72px; background: #fff; }
.section-heading { margin-bottom: 34px; }
.section-heading--split { display: flex; align-items: end; justify-content: space-between; gap: 24px; }
.section-heading--center { max-width: 720px; margin-inline: auto; text-align: center; }
.section-heading h2, .content-card h2, .catalog-toolbar h2, .contact-panel h2, .quote-form h2 { margin-bottom: 0; font-family: "Playfair Display", Georgia, serif; font-size: clamp(34px, 4vw, 50px); letter-spacing: -.02em; }
.section-heading p:not(.eyebrow) { color: var(--muted); }

/* Category cards */
.category-grid { display: grid; gap: 14px; }
.category-grid--home { grid-template-columns: repeat(7, minmax(0, 1fr)); }
.category-grid--catalog { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px; }
/* One consistent background across every product category card. */
.category-card { position: relative; min-height: 220px; overflow: hidden; border: 1px solid #e9e4de; border-radius: 4px; background: linear-gradient(145deg, #faf8f6 0%, #f2ede8 100%); isolation: isolate; transition: transform var(--ease), box-shadow var(--ease), border-color var(--ease); }
.category-card:hover { z-index: 2; transform: translateY(-7px); border-color: #d9e2eb; box-shadow: var(--shadow-md); }
.category-card__copy { position: relative; z-index: 2; display: flex; min-height: 100%; flex-direction: column; align-items: flex-start; justify-content: space-between; gap: 20px; padding: 18px 14px; }
.category-card h3 { max-width: 110px; margin: 0; font-family: "Playfair Display", Georgia, serif; font-size: clamp(18px, 1.7vw, 25px); }
.category-card img { position: absolute; right: -8%; bottom: -7%; z-index: 1; width: 88%; max-height: 82%; object-fit: contain; object-position: right bottom; transition: transform 400ms ease; }
.category-card:hover img { transform: scale(1.06) translate(-2%, -1%); }

/* Product artwork uses transparent backgrounds so the unified card surface remains visible. */
#mens-underwear.category-card img,
#womens-underwear.category-card img,
#bras.category-card img { background: transparent; }
.circle-link { width: 34px; height: 34px; display: grid; place-items: center; border-radius: 50%; background: rgba(255,255,255,.90); color: var(--navy-900); box-shadow: 0 5px 18px rgba(6,28,53,.10); font-size: 12px; transition: background var(--ease), color var(--ease); }
.circle-link:hover { color: var(--white); background: var(--blue-700); }
.category-grid--catalog .category-card { min-height: 310px; border-radius: var(--radius-sm); }
.category-grid--catalog .category-card__copy { padding: 24px; }
.category-grid--catalog .category-card h3 { max-width: 170px; font-size: clamp(23px, 2.2vw, 32px); }
.category-grid--catalog .category-card img { width: 82%; }

/* Benefits */
.benefit-strip { background: var(--navy-900); color: var(--white); }
.benefit-grid { display: grid; grid-template-columns: repeat(4, 1fr); }
.benefit-item { min-height: 138px; display: flex; align-items: center; gap: 16px; padding: 27px 22px; border-right: 1px solid rgba(255,255,255,.12); }
.benefit-item:first-child { border-left: 1px solid rgba(255,255,255,.12); }
.benefit-item > i { width: 42px; flex: 0 0 42px; font-size: 28px; color: #b9d7f4; text-align: center; }
.benefit-item h2 { margin-bottom: 7px; font-size: 16px; }
.benefit-item p { margin: 0; color: rgba(255,255,255,.64); font-size: 12px; line-height: 1.55; }

/* Split content */
.split-layout { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, .95fr); align-items: center; gap: clamp(38px, 6vw, 82px); }
.split-layout--wide { align-items: stretch; }
.media-card { min-height: 400px; overflow: hidden; border-radius: var(--radius-md); box-shadow: var(--shadow-md); }
.media-card img { width: 100%; height: 100%; min-height: inherit; object-fit: cover; }
.content-card h2 { margin-bottom: 24px; }
.content-card p { margin-bottom: 18px; color: var(--muted); }
.content-card .button { margin-top: 10px; }

/* Statistics and values */
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
.stat-card { display: grid; min-height: 190px; place-items: center; align-content: center; padding: 28px 18px; border: 1px solid var(--line); border-radius: var(--radius-sm); background: var(--white); text-align: center; box-shadow: 0 10px 30px rgba(6,28,53,.05); }
.stat-card i { margin-bottom: 14px; font-size: 30px; color: var(--blue-600); }
.stat-card strong { display: block; margin-bottom: 5px; font-family: "Playfair Display", Georgia, serif; font-size: clamp(27px, 3vw, 38px); }
.stat-card span { color: var(--muted); font-size: 13px; }
.value-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.value-card { padding: 32px 26px; border: 1px solid var(--line); border-radius: var(--radius-sm); background: var(--white); box-shadow: 0 10px 30px rgba(6,28,53,.04); }
.value-card > i { width: 54px; height: 54px; display: grid; place-items: center; margin-bottom: 22px; border-radius: 14px; background: var(--blue-100); color: var(--blue-700); font-size: 22px; }
.value-card h3 { margin-bottom: 12px; font-size: 19px; }
.value-card p { margin: 0; color: var(--muted); font-size: 14px; }

/* CTA */
.cta-band { padding-block: 56px; color: var(--white); background: linear-gradient(115deg, var(--navy-950), var(--navy-800)); }
.cta-band__inner { display: flex; align-items: center; justify-content: space-between; gap: 30px; }
.cta-band h2 { margin: 0; font-family: "Playfair Display", Georgia, serif; font-size: clamp(30px, 4vw, 46px); }

/* Generic page hero */
.page-hero { position: relative; min-height: 400px; display: grid; align-items: center; color: var(--white); overflow: hidden; isolation: isolate; background: var(--navy-900); }
.page-hero::before { content: ""; position: absolute; inset: 0; z-index: -2; background: url("../assets/optimized/hero.webp") center / cover no-repeat; }
.page-hero::after { content: ""; position: absolute; inset: 0; z-index: -1; background: linear-gradient(90deg, rgba(4,20,38,.98), rgba(4,20,38,.75) 50%, rgba(4,20,38,.30)); }
.page-hero--about::before { background-image: url("../assets/optimized/about.webp"); }
.page-hero--about::after { background: linear-gradient(90deg, rgba(4,20,38,.96), rgba(4,20,38,.73), rgba(4,20,38,.48)); }
.page-hero--contact::before { background-position: 65% center; }
.page-hero--compact { min-height: 320px; }
.page-hero__content { padding-block: 70px; }
.page-hero__content h1 { max-width: 760px; margin-bottom: 18px; font-family: "Playfair Display", Georgia, serif; font-size: clamp(46px, 6vw, 72px); }
.page-hero__content p:not(.eyebrow) { max-width: 720px; margin: 0; color: rgba(255,255,255,.78); }

/* Product catalog toolbar */
.catalog-toolbar { display: flex; align-items: end; justify-content: space-between; gap: 30px; margin-bottom: 34px; }
.catalog-toolbar h2 { font-size: clamp(30px, 3vw, 40px); }
.catalog-toolbar p { margin: 8px 0 0; color: var(--muted); }
.catalog-search { width: min(100%, 350px); height: 48px; display: flex; align-items: center; gap: 10px; padding: 0 16px; border: 1px solid var(--line); border-radius: 999px; background: var(--white); }
.catalog-search i { color: var(--muted); }
.catalog-search input { width: 100%; border: 0; outline: 0; background: transparent; }
.empty-state { padding: 70px 20px; text-align: center; color: var(--muted); }
.empty-state > i { margin-bottom: 16px; font-size: 50px; color: var(--blue-600); }
.empty-state h2 { color: var(--ink); }

/* Contact page */
.contact-layout { display: grid; grid-template-columns: minmax(300px, .75fr) minmax(0, 1.25fr); gap: 34px; align-items: start; }
.contact-panel, .quote-form { padding: clamp(28px, 4vw, 46px); border: 1px solid var(--line); border-radius: var(--radius-md); background: var(--white); box-shadow: var(--shadow-sm); }
.contact-panel { position: sticky; top: calc(var(--header-height) + 28px); }
.contact-panel h2, .quote-form h2 { margin-bottom: 28px; }
.contact-line { display: flex; align-items: center; gap: 16px; padding: 18px 0; border-top: 1px solid var(--line); }
.contact-line > i { width: 44px; height: 44px; display: grid; place-items: center; flex: 0 0 44px; border-radius: 50%; color: var(--blue-700); background: var(--blue-100); }
.contact-line span { display: grid; color: var(--muted); font-size: 14px; }
.contact-line strong { color: var(--ink); font-size: 13px; }
.contact-note { display: flex; gap: 14px; margin-top: 24px; padding: 18px; border-radius: var(--radius-sm); background: var(--soft); color: var(--muted); font-size: 13px; }
.contact-note p { margin: 0; }
.contact-note i { color: var(--blue-700); }
.form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; }
.form-grid label { display: grid; gap: 8px; color: var(--ink); font-size: 13px; font-weight: 600; }
.form-grid input, .form-grid select, .form-grid textarea { width: 100%; border: 1px solid var(--line); border-radius: 10px; padding: 12px 14px; color: var(--ink); background: var(--white); outline: none; font-weight: 400; }
.form-grid input, .form-grid select { min-height: 48px; }
.form-grid textarea { resize: vertical; }
.form-grid input:focus, .form-grid select:focus, .form-grid textarea:focus { border-color: var(--blue-600); box-shadow: 0 0 0 4px rgba(20,101,173,.10); }
.form-grid .invalid { border-color: #c23e3e; }
.form-span { grid-column: 1 / -1; }
.quote-form .button { margin-top: 22px; }
.form-message { min-height: 24px; margin: 14px 0 0; color: var(--blue-700); font-size: 13px; }
.location-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px; }
.location-card { display: flex; gap: 18px; padding: 30px; border: 1px solid var(--line); border-radius: var(--radius-sm); background: var(--white); }
.location-card > i { width: 50px; height: 50px; display: grid; place-items: center; flex: 0 0 50px; border-radius: 14px; background: var(--blue-100); color: var(--blue-700); font-size: 20px; }
.location-card h3 { margin-bottom: 8px; }
.location-card p { margin: 0; color: var(--muted); }

/* Product details */
.product-layout { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, .9fr); gap: clamp(38px, 6vw, 82px); align-items: start; }
.product-main-image { aspect-ratio: 1; display: grid; place-items: center; overflow: hidden; border-radius: var(--radius-md); background: linear-gradient(145deg, #faf8f6, #f0ece8); }
.product-main-image img { width: 88%; height: 88%; object-fit: contain; }
.product-thumbs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 14px; }
.product-thumb { aspect-ratio: 1; padding: 7px; border: 1px solid var(--line); border-radius: 10px; background: var(--soft); cursor: pointer; overflow: hidden; }
.product-thumb img { width: 100%; height: 100%; object-fit: contain; }
.product-thumb.active { border-color: var(--blue-600); box-shadow: 0 0 0 3px rgba(20,101,173,.10); }
.product-summary { padding-top: 10px; }
.product-summary h2 { margin-bottom: 20px; font-family: "Playfair Display", Georgia, serif; font-size: clamp(38px, 5vw, 58px); }
.product-summary > p:not(.eyebrow) { color: var(--muted); }
.check-list { display: grid; gap: 13px; margin: 28px 0; }
.check-list li { display: flex; align-items: center; gap: 10px; }
.check-list i { width: 24px; height: 24px; display: grid; place-items: center; border-radius: 50%; background: var(--blue-100); color: var(--blue-700); font-size: 11px; }
.spec-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.spec-grid div { padding: 16px; border: 1px solid var(--line); border-radius: 10px; background: var(--soft); }
.spec-grid span, .spec-grid strong { display: block; }
.spec-grid span { color: var(--muted); font-size: 11px; text-transform: uppercase; letter-spacing: .08em; }
.spec-grid strong { margin-top: 3px; font-size: 14px; }
.product-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }

/* 404 */
.error-page { min-height: calc(100vh - var(--header-height)); display: grid; place-items: center; padding: 70px 0; background: radial-gradient(circle at 50% 20%, #eef5fb, var(--white) 58%); }
.error-card { max-width: 760px; text-align: center; }
.error-code { margin-bottom: 0; font-family: "Playfair Display", Georgia, serif; font-size: clamp(110px, 18vw, 190px); font-weight: 700; line-height: .85; color: var(--blue-100); text-shadow: 0 8px 30px rgba(11,76,140,.10); }
.error-card h1 { margin-bottom: 14px; font-family: "Playfair Display", Georgia, serif; font-size: clamp(36px, 5vw, 56px); }
.error-card > p:not(.error-code) { color: var(--muted); }
.error-actions { display: flex; justify-content: center; flex-wrap: wrap; gap: 12px; margin-top: 28px; }

/* Footer */
.site-footer { padding-top: 68px; color: rgba(255,255,255,.72); background: var(--navy-950); }
.footer-grid { display: grid; grid-template-columns: 1.3fr 1fr .8fr 1.3fr; gap: clamp(28px, 4vw, 60px); }
.footer-block { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; }
.footer-block h2 { margin-bottom: 10px; color: var(--white); font-size: 16px; }
.footer-block p { margin: 0; font-size: 13px; }
.footer-block a { display: inline-flex; align-items: center; gap: 9px; font-size: 13px; transition: color var(--ease); }
.footer-block a:hover { color: var(--white); }
.footer-brand img { width: 105px; padding: 4px; border-radius: 8px; background: var(--white); }
.social-links { display: flex; gap: 9px; margin-top: 8px; }
.social-links a { width: 38px; height: 38px; display: grid; place-items: center; border-radius: 50%; color: var(--white); background: rgba(255,255,255,.10); }
.social-links a:hover { color: var(--navy-950); background: var(--white); }
.footer-bottom { margin-top: 52px; padding: 24px 0; border-top: 1px solid rgba(255,255,255,.10); text-align: center; font-size: 12px; }
.footer-bottom p { margin: 0; }

/* Content is always visible; interactions do not depend on animation support. */
.reveal { opacity: 1; transform: none; }

/* Tablet */
@media (max-width: 1120px) {
  :root { --header-height: 76px; }
  .topbar__contacts a:nth-child(2) { display: none; }
  .nav-shell { gap: 22px; }
  .nav-menu { gap: 20px; }
  .nav-menu a { font-size: 12px; }
  .language-chip { display: none; }
  .category-grid--home { grid-template-columns: repeat(4, 1fr); }
  .category-grid--catalog { grid-template-columns: repeat(3, 1fr); }
  .value-grid { grid-template-columns: repeat(2, 1fr); }
  .footer-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 900px) {
  .topbar { display: none; }
  .nav-shell { position: relative; grid-template-columns: 44px 1fr auto; min-height: var(--header-height); gap: 10px; }
  .menu-toggle { display: block; }
  .brand { justify-self: center; }
  .brand img { width: 82px; }
  .primary-nav { position: fixed; top: var(--header-height); left: 0; right: 0; width: 100%; justify-self: stretch; visibility: hidden; opacity: 0; pointer-events: none; transform: translateY(-10px); transition: opacity var(--ease), transform var(--ease), visibility var(--ease); }
  .primary-nav.open { visibility: visible; opacity: 1; pointer-events: auto; transform: none; }
  .nav-menu { display: grid; gap: 0; max-height: calc(100vh - var(--header-height)); overflow-y: auto; padding: 12px 20px 22px; border-top: 1px solid var(--line); background: var(--white); box-shadow: var(--shadow-md); }
  .nav-menu li { border-bottom: 1px solid var(--line); }
  .nav-menu a { padding: 17px 4px; font-size: 14px; }
  .nav-menu a::after { display: none; }
  .nav-actions { gap: 2px; }
  .nav-contact { display: none; }
  .home-hero { min-height: 570px; }
  .home-hero__shade { background: linear-gradient(90deg, rgba(4,20,38,.97), rgba(4,20,38,.74) 58%, rgba(4,20,38,.34)); }
  .category-grid--home { grid-template-columns: repeat(3, 1fr); }
  .benefit-grid { grid-template-columns: repeat(2, 1fr); }
  .benefit-item:nth-child(2) { border-right: 0; }
  .benefit-item:nth-child(n+3) { border-top: 1px solid rgba(255,255,255,.12); }
  .split-layout, .product-layout { grid-template-columns: 1fr; }
  .media-card { min-height: 340px; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .contact-layout { grid-template-columns: 1fr; }
  .contact-panel { position: static; }
  .category-grid--catalog { grid-template-columns: repeat(2, 1fr); }
}

/* Mobile */
@media (max-width: 640px) {
  .container { width: min(calc(100% - 28px), var(--container)); }
  .nav-shell { grid-template-columns: 42px 1fr 42px; }
  .nav-icon { width: 42px; height: 42px; }
  .search-form { grid-template-columns: 1fr auto; padding-block: 12px; }
  .search-form .button { grid-column: 1 / -1; }
  .search-close { position: absolute; right: 12px; top: -53px; color: var(--white); background: var(--navy-950); border-radius: 50%; }
  .home-hero { min-height: 610px; align-items: end; }
  .home-hero__media { background-position: 62% center; }
  .home-hero__shade { background: linear-gradient(90deg, rgba(4,20,38,.96), rgba(4,20,38,.79) 58%, rgba(4,20,38,.45)); }
  .home-hero__content { padding-block: 70px 58px; }
  .hero-copy h1 { max-width: 430px; font-size: clamp(46px, 14vw, 64px); }
  .hero-lead { max-width: 390px; }
  .hero-actions { align-items: flex-start; flex-direction: column; }
  .section { padding-block: 64px; }
  .section--categories { padding-block: 44px 58px; }
  .section-heading--split, .catalog-toolbar, .cta-band__inner { align-items: flex-start; flex-direction: column; }
  .category-grid--home, .category-grid--catalog { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
  .category-card { min-height: 190px; }
  .category-card__copy { padding: 14px 12px; }
  .category-card h3 { max-width: 105px; font-size: 19px; }
  .category-grid--catalog .category-card { min-height: 230px; }
  .category-grid--catalog .category-card__copy { padding: 18px 14px; }
  .category-grid--catalog .category-card h3 { font-size: 22px; }
  .benefit-item { min-height: 125px; padding: 22px 14px; align-items: flex-start; }
  .benefit-item > i { width: 34px; flex-basis: 34px; font-size: 23px; }
  .benefit-item h2 { font-size: 14px; }
  .benefit-item p { font-size: 11px; }
  .media-card { min-height: 270px; border-radius: var(--radius-sm); }
  .value-grid { grid-template-columns: 1fr; }
  .page-hero { min-height: 360px; }
  .page-hero--compact { min-height: 300px; }
  .page-hero__content { padding-block: 58px; }
  .page-hero__content h1 { font-size: clamp(42px, 12vw, 58px); }
  .form-grid { grid-template-columns: 1fr; }
  .form-span { grid-column: auto; }
  .location-grid { grid-template-columns: 1fr; }
  .footer-grid { grid-template-columns: 1fr; }
  .footer-bottom { margin-top: 38px; }
  .product-actions .button { width: 100%; }
}

@media (max-width: 390px) {
  .category-grid--home, .category-grid--catalog { grid-template-columns: 1fr 1fr; }
  .category-card { min-height: 175px; }
  .category-card img { width: 92%; }
  .benefit-grid { grid-template-columns: 1fr; }
  .benefit-item, .benefit-item:first-child { border: 0; border-top: 1px solid rgba(255,255,255,.12); }
  .benefit-item:first-child { border-top: 0; }
  .stats-grid { grid-template-columns: 1fr; }
  .spec-grid { grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
}


/* Multilingual language switcher */
.language-switcher { position: relative; display: inline-flex; flex: 0 0 auto; }
.language-toggle { min-width: 66px; min-height: 42px; justify-content: center; padding: 0 10px; border: 1px solid transparent; border-radius: 10px; color: var(--navy-900); background: transparent; cursor: pointer; transition: border-color var(--ease), background var(--ease), color var(--ease); }
.language-toggle:hover, .language-switcher.open .language-toggle { border-color: var(--line); background: var(--soft); color: var(--blue-700); }
.language-chevron { font-size: 10px; transition: transform var(--ease); }
.language-switcher.open .language-chevron { transform: rotate(180deg); }
.language-menu { position: absolute; z-index: 140; top: calc(100% + 10px); right: 0; min-width: 176px; padding: 7px; border: 1px solid var(--line); border-radius: 12px; background: var(--white); box-shadow: var(--shadow-md); }
.language-menu[hidden] { display: none; }
.language-menu button { width: 100%; display: grid; grid-template-columns: 42px 1fr; align-items: center; gap: 8px; padding: 11px 12px; border: 0; border-radius: 8px; color: var(--navy-900); background: transparent; text-align: left; cursor: pointer; font: inherit; }
.language-menu button:hover, .language-menu button.active { color: var(--blue-700); background: var(--blue-100); }
.language-code { font-size: 12px; font-weight: 700; }

/* Arabic right-to-left support */
html[dir="rtl"] body { font-family: Tahoma, Arial, sans-serif; text-align: right; }
html[dir="rtl"] h1, html[dir="rtl"] h2, html[dir="rtl"] h3, html[dir="rtl"] .hero-script { font-family: Tahoma, Arial, sans-serif; }
html[lang="zh-CN"] body { font-family: "Microsoft YaHei", "PingFang SC", Arial, sans-serif; }
html[lang="zh-CN"] h1, html[lang="zh-CN"] h2, html[lang="zh-CN"] h3, html[lang="zh-CN"] .hero-script { font-family: "Microsoft YaHei", "PingFang SC", Arial, sans-serif; }
html[dir="rtl"] .language-menu { right: auto; left: 0; }
html[dir="rtl"] .language-menu button { text-align: right; }
html[dir="rtl"] .home-hero__shade { background: linear-gradient(270deg, rgba(4,20,38,.97), rgba(4,20,38,.75) 54%, rgba(4,20,38,.16)); }
html[dir="rtl"] .hero-copy, html[dir="rtl"] .page-hero__content, html[dir="rtl"] .content-card, html[dir="rtl"] .product-summary { text-align: right; }
html[dir="rtl"] .hero-copy { margin-left: auto; margin-right: 0; }
html[dir="rtl"] .hero-actions, html[dir="rtl"] .section-heading--split, html[dir="rtl"] .cta-band__inner { direction: rtl; }
html[dir="rtl"] .fa-arrow-right { transform: rotate(180deg); }
html[dir="rtl"] .location-card, html[dir="rtl"] .benefit-item, html[dir="rtl"] .check-list li { flex-direction: row-reverse; }
html[dir="rtl"] .footer-block { align-items: flex-start; }
html[dir="rtl"] input, html[dir="rtl"] textarea, html[dir="rtl"] select { text-align: right; }
html[dir="rtl"] .search-close { right: auto; left: 0; }
html[dir="rtl"] .primary-nav { direction: rtl; }

@media (max-width: 1120px) {
  .language-chip { display: inline-flex; }
}
@media (max-width: 900px) {
  .nav-actions { gap: 0; }
  .language-toggle { min-width: 54px; padding-inline: 7px; }
  .language-toggle > .fa-globe { display: none; }
  .language-menu { position: fixed; top: calc(var(--header-height) - 2px); right: 14px; left: auto; }
  html[dir="rtl"] .language-menu { right: auto; left: 14px; }
}
@media (max-width: 640px) {
  .nav-shell { grid-template-columns: 42px 1fr auto; }
  .language-toggle { min-width: 48px; font-size: 12px; }
  .language-toggle .language-chevron { display: none; }
  html[dir="rtl"] .home-hero__shade { background: linear-gradient(270deg, rgba(4,20,38,.96), rgba(4,20,38,.80) 58%, rgba(4,20,38,.44)); }
}

/* Language-specific typography refinements */
html[dir="rtl"] .hero-copy h1 {
  max-width: 680px;
  font-size: clamp(46px, 5.4vw, 72px);
  line-height: 1.16;
  letter-spacing: 0;
}
html[lang="zh-CN"] .hero-copy h1 {
  max-width: 650px;
  font-size: clamp(48px, 5.5vw, 74px);
  line-height: 1.12;
  letter-spacing: 0;
}
html[dir="rtl"] .hero-script,
html[lang="zh-CN"] .hero-script {
  line-height: 1.65;
}
html[dir="rtl"] .category-card h3 {
  max-width: 138px;
  font-size: 18px;
  line-height: 1.35;
}
html[lang="zh-CN"] .category-card h3 {
  max-width: 132px;
  line-height: 1.3;
}
html[dir="rtl"] .eyebrow,
html[lang="zh-CN"] .eyebrow {
  letter-spacing: .06em;
}

@media (max-width: 640px) {
  html[dir="rtl"] .hero-copy h1 {
    max-width: 100%;
    font-size: clamp(38px, 10.8vw, 48px);
    line-height: 1.28;
  }
  html[lang="zh-CN"] .hero-copy h1 {
    max-width: 100%;
    font-size: clamp(43px, 12vw, 54px);
    line-height: 1.16;
  }
  html[dir="rtl"] .hero-lead,
  html[lang="zh-CN"] .hero-lead {
    font-size: 14px;
    line-height: 1.85;
  }
  html[dir="rtl"] .category-card h3 {
    max-width: 128px;
    font-size: 15px;
    line-height: 1.35;
  }
  html[lang="zh-CN"] .category-card h3 {
    font-size: 18px;
  }
}
