# 🎵 Beat Store

> Een webshop waar producers hun beats kunnen aanbieden en klanten beats kunnen kopen en bestellen.

---

## Certificaat

<!-- Vul in zodra je het weet -->
`[ ] Met studiepunten` &nbsp; `[ ] Zonder studiepunten`

---

## Over het project

Beat Store is een full-client webapplicatie gebouwd met vanilla JavaScript en Tailwind CSS. De shop stelt gebruikers in staat om een catalogus van beats te bekijken, beats toe te voegen aan een winkelwagen en een bestelling te plaatsen. Via een apart admin-paneel kunnen producten beheerd worden en bestellingen ingezien worden.

**Functionaliteiten:**
- Productoverzicht met beats (titel, genre, BPM, prijs)
- Filteren op genre
- Winkelwagen beheren (toevoegen, verwijderen)
- Bestelling plaatsen met bestelbevestiging op de pagina
- Admin-paneel: producten toevoegen, wijzigen en verwijderen
- Admin-paneel: bestellingen bekijken met datum en tijd
- Producten resetten naar de standaard 5 beats
- Data opgeslagen in `localStorage`

**Technieken gebruikt:**
- Vanilla JavaScript
- Tailwind CSS v3 (CLI)
- localStorage
- JSON als databron

---

## Online te vinden

<!-- Vul in na deployment -->
🔗 [beat-store.netlify.app](https://placeholder.netlify.app)

---

## Lokaal uitvoeren

### Vereisten

- [Node.js](https://nodejs.org/) (v18 of hoger)
- npm

### Installatie

```bash
# 1. Clone de repository
git clone https://github.com/RIPP3R1337/beat-website.git

# 2. Ga naar de projectmap
cd beat-website

# 3. Installeer dependencies
npm install
```

### Starten

```bash
# Start Tailwind in watch-modus
npm run dev
```

Open daarna `public/index.html` in je browser — bijvoorbeeld via de Live Server extensie in VS Code.

### Bouwen voor productie

```bash
npm run build
```

Dit genereert een geminificeerde `output.css` klaar voor deployment.

---

## Projectstructuur

```
beat-website/
├── public/                   # Netlify publish directory
│   ├── index.html            # Klantenomgeving
│   ├── cart.html             # Winkelwagen & afrekenen
│   ├── admin.html            # Adminpaneel
│   ├── css/
│   │   └── output.css        # Gegenereerde Tailwind CSS
│   ├── js/
│   │   ├── storage.js        # localStorage logica
│   │   ├── products.js       # Producten laden & renderen
│   │   ├── cart.js           # Winkelwagen logica
│   │   └── admin.js          # Admin CRUD & bestellingen
│   └── data/
│       └── beats.json        # Standaard productdata (fallback)
└── src/
    └── css/
        └── input.css         # Tailwind directives (bronbestand)
├── package.json
└── README.md
```