# Tania's Portfolio

Interactive portfolio website showcasing my journey as a Data Scientist and Business Engineer.
Built with vanilla HTML, CSS, and JavaScript, deployed on GitHub Pages.

**Live site:** [taniahdzl.github.io](https://taniahdzl.github.io)

---

## About

This is the personal portfolio of **Tania**, a Data Science & Business Engineering student at ITAM (Mexico City), graduating 2026. The site tells her story across multiple dimensions:

- **Academic background** — Double major in Data Science & Business Engineering at ITAM
- **Professional experience** — AML dashboards, fintech, data engineering, strategy
- **Community impact** — Vice-President of Huerto ITAM (sustainable university garden since 2022)
- **Global perspective** — Exchange student at NUS Singapore (2025), followed by independent travel across 7 Asian countries
- **Creative interests** — Flag football, music, sustainable business models, community outreach

---

## Features

### 🎨 **Visual Design**
- Editorial × Collage aesthetic with Asian-Latina influences
- Custom color palette (cream, ink, green, gold, red, blue)
- Premium typography using Fraunces, Syne, and DM Mono
- Smooth scroll behavior and refined transitions
- Responsive grid layouts

### 🎠 **Interactive Elements**
- **Object carousel** — Rotating slideshow of visual metaphors (vinyl record, boarding pass, flag football, plant, etc.)
- **Timeline section** — Staggered fade-in animations for experience entries
- **Atlas grid** — Interactive city cards with gradient backgrounds and hover effects
- **Collage zone** — Mouse parallax effects on about section
- **Country marquee** — Scrolling list of visited countries
- **Smooth scrolling** — Native HTML scroll-behavior and custom anchor links

### 📱 **Responsive Design**
- Mobile-first approach
- Adapts gracefully from mobile to desktop
- Touch support for carousel (swipe gestures)
- Optimized performance with Intersection Observer

---

## Project Structure

```
taniahdzl.github.io/
├── index.html           # Main HTML document
├── style.css           # All styling (design system + components)
├── script.js           # Carousel, animations, interactivity
├── img/               # Image assets
└── README.md          # This file
```

### Key Files

| File | Purpose |
|------|---------|
| **index.html** | Single-page document with all sections (Hero, About, Experience, Asia Atlas, Music, Contact) |
| **style.css** | Complete design system (variables, typography, components, responsive breakpoints) |
| **script.js** | Carousel functionality, scroll effects, timeline animations, event handlers |

---

## Technologies Used

- **HTML5** — Semantic markup
- **CSS3** — Flexbox, CSS Grid, animations, gradients, blur effects
- **JavaScript (Vanilla)** — No frameworks; pure DOM manipulation
- **Google Fonts** — Fraunces (display), Syne (UI), DM Mono (monospace)
- **GitHub Pages** — Hosting & deployment

---

## Sections Breakdown

### 1. **Navigation** (`.nav`)
- Fixed header with blur backdrop
- Smooth scroll links to sections
- Status indicator ("Available 2026")

### 2. **Hero Section** (`#hero`)
- Animated background text
- Title + CTA button
- Object carousel with 8 interactive items
- Auto-rotating slides (4-second interval)

### 3. **About/Collage** (`#about`)
- Stats section (languages, years building, playlists)
- Collage cards with mouse parallax
- Bio and language pills

### 4. **Experience/Timeline** (`#experience`)
- 8 timeline items with scroll-triggered animations
- Color-coded tags by category (Fintech, Asia, Awards, Education, etc.)
- Skills badges for each entry

### 5. **Asia Atlas** (`#gallery`)
- Introductory text about the exchange semester
- 2×2 grid of city cards (Kyoto, Singapore, Bangkok, Seoul)
- Unique gradients and hover effects per city
- Full-width summary card at bottom
- Scrolling marquee of all visited countries

### 6. **Music Section** (`#music`)
- Vinyl record illustration
- Playlist showcase
- Music as a theme connecting experiences

### 7. **Footer/Contact** (`#contact`)
- Links and closing statement
- Social media integration ready

---

## Customization Guide

### Colors
Edit the CSS variables in `style.css`:
```css
:root {
    --bg:          #F2EDE6;
    --bg-dark:     #0E0E0E;
    --cream:       #FAF7F2;
    --ink:         #1A1A1A;
    --green:       #2A6B3F;
    --green-light: #5BAD72;
    --red:         #D14B35;
    --gold:        #C49A3C;
    --blue:        #2B4C8C;
    --white:       #FFFFFF;
}
```

### Typography
Fonts are imported from Google Fonts. To change families, update the `@import` and `:root` variables:
```css
--font-display: 'Fraunces', serif;  /* Large headings */
--font-ui:      'Syne', sans-serif;  /* Body text */
--font-mono:    'DM Mono', monospace; /* Code/labels */
```

### Carousel
The carousel auto-rotates every 4 seconds. Modify in `script.js`:
```javascript
function resetOcarAuto() {
    clearInterval(ocarAuto);
    ocarAuto = setInterval(() => {
        ocarGo(ocarIndex + 1);
    }, 4000);  // Change this value (milliseconds)
}
```

### Sections
Each section is a self-contained `<section>` element. Add new sections by:
1. Adding a `<section id="section-name">` to HTML
2. Styling with `.section-label` and `.section-title` classes
3. Adding corresponding CSS and JavaScript as needed

---

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Requires JavaScript enabled for full interactivity
- CSS Grid and Flexbox support required
- Backdrop-filter support for blur effects (gracefully degrades)

---

## Performance Notes

- **Single HTML file** — No build process needed
- **Optimized CSS** — ~900 lines, well-organized with comments
- **Vanilla JavaScript** — ~180 lines, no external dependencies
- **Lazy loading** — Intersection Observer for timeline animations
- **Smooth animations** — Hardware-accelerated transforms and transitions

---

## Deployment

This site is hosted on **GitHub Pages**. To deploy updates:

```bash
# Just push to the main branch
git add .
git commit -m "Update portfolio"
git push origin main
```

The site will automatically update at `https://taniahdzl.github.io`

---

## Future Enhancements

Potential improvements (not yet implemented):
- [ ] Dark mode toggle
- [ ] Multi-language support
- [ ] Blog/Articles section
- [ ] Contact form backend
- [ ] Photography gallery lightbox
- [ ] Project case studies
- [ ] Downloadable resume

---

## Credits & Design

- **Design & Development** — Tania (2026)
- **Fonts** — [Google Fonts](https://fonts.google.com)
- **Deployment** — [GitHub Pages](https://pages.github.com)
- **Aesthetic influences** — Editorial design, collage, Asian-Latina culture

---

## License

This portfolio is personal in nature. While you're welcome to view and learn from the code, please don't copy it directly. Feel free to use it as inspiration for your own portfolio!

---

## Contact

For inquiries, reach out through the contact section on the live site or visit [taniahdzl.github.io](https://taniahdzl.github.io)

---

**Last updated:** March 2026  
**Status:** Actively maintained ✨
