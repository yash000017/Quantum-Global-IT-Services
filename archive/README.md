# Quantum Global IT Services — Website

A futuristic, minimal, Apple-inspired website for **Quantum Global IT Services**.

---

## 🗂 Project Structure

```
quantum-global/
├── index.html          — Homepage
├── about.html          — About Us
├── services.html       — Services
├── contact.html        — Contact
├── book.html           — Book a Meeting
│
├── css/
│   ├── main.css        — Design system (tokens, reset, typography)
│   ├── animations.css  — Keyframes + scroll-reveal utilities
│   ├── components.css  — Nav, footer, buttons, cards, cursor, forms
│   ├── home.css        — Homepage-specific styles
│   └── inner.css       — Inner pages (about, services, contact, book)
│
└── js/
    ├── particles.js    — Canvas quantum particle network
    ├── cursor.js       — Custom cursor (dot + ring follow)
    ├── nav.js          — Nav scroll behaviour + mobile menu
    ├── scroll-anim.js  — IntersectionObserver reveal + counter + parallax
    └── main.js         — Initialiser, form handler, magnetic buttons
```

---

## 🚀 Running Locally

### Option 1 — VS Code Live Server (recommended)
1. Install the **Live Server** extension in VS Code
2. Right-click `index.html` → **Open with Live Server**

### Option 2 — Node.js `serve`
```bash
npx serve .
```

### Option 3 — Python
```bash
python3 -m http.server 5500
```

### Option 4 — GitHub Codespaces
Open the repo in a Codespace. VS Code Live Server is pre-installed.
Port 5500 will be auto-forwarded.

> ⚠️ Always use a local server (not `file://`) — the particle canvas and font imports need HTTP.

---

## ✨ Features

| Feature | Detail |
|---|---|
| **Particle Canvas** | Interactive quantum network that reacts to mouse position |
| **Custom Cursor** | Cyan dot + ring with hover expansion state |
| **Frosted Nav** | Transparent on hero, glassmorphism on scroll |
| **Scroll Reveal** | `data-reveal` + `data-delay` attributes on any element |
| **Counter Animation** | `data-count` attribute for animated stats |
| **Magnetic Buttons** | Subtle gravitational pull on primary buttons |
| **Tech Marquee** | Infinite scrolling tech stack strip |
| **Mobile Menu** | Full-screen overlay with smooth fade |
| **Form Handling** | Styled success modal (wire up to backend/Formspree) |

---

## 🎨 Design Tokens (in `css/main.css`)

| Variable | Value | Use |
|---|---|---|
| `--bg-base` | `#020209` | Page background |
| `--cyan` | `#00d4ff` | Primary accent |
| `--purple` | `#7c3aed` | Secondary accent |
| `--t1` | `#f0f0fa` | Body text |
| `--t2` | `#6e6e8a` | Muted text |
| `--font-display` | Syne | Headings |
| `--font-body` | Outfit | Body text |

---

## 🔌 Connecting a Real Backend

### Forms → Formspree (easiest)
1. Create a free account at [formspree.io](https://formspree.io)
2. Replace the `<form data-form>` tag with:
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```
3. Remove the `data-form` attribute (or keep both for the success modal)

### Forms → Netlify
If deploying to Netlify, add `netlify` attribute to each form:
```html
<form data-form netlify name="contact">
```

---

## 🌐 Deployment

| Platform | Command |
|---|---|
| **Netlify** | Drag-drop the folder, or connect GitHub |
| **Vercel** | `vercel deploy` from the project root |
| **GitHub Pages** | Enable Pages in repo Settings → Source: root |
| **Cloudflare Pages** | Connect repo, build command: none, root: `/` |

---

## 📝 Customisation Checklist

- [ ] Replace email `hello@quantumglobal.co.uk` in footer + contact page
- [ ] Replace phone number throughout
- [ ] Update address / location
- [ ] Replace team member names, roles, bios in `about.html`
- [ ] Swap stats numbers (`data-count`) for real figures
- [ ] Add real social media links in footer
- [ ] Connect forms to Formspree / backend
- [ ] Add company logo to `assets/` and update `nav-logo`
- [ ] Add favicon SVG/ICO to root
- [ ] Update `<meta description>` tags on each page

---

## 🛠 Extending the Site

### Adding a new page
1. Copy any inner page HTML (e.g. `services.html`)
2. Update `<title>`, `<meta name="description">`
3. Add to nav links in all pages
4. Add your sections with `data-reveal` attributes for free scroll animations

### Adding scroll reveal to any element
```html
<div data-reveal="up" data-delay="200">Your content</div>
```
Options: `up`, `down`, `left`, `right`, `scale`, `fade`
Delays: `100`, `200`, `300`, `400`, `500`, `600`, `700`

### Adding an animated counter
```html
<span data-count="99" data-suffix="%">99%</span>
```

---

Made with ⚡ by Quantum Global IT Services
