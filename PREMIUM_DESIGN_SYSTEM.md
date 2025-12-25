# 🎨 MEATHUB PREMIUM DESIGN SYSTEM

## 🎯 OBJECTIVE: BEAT LICIOUS & TENDERCUTS

---

## 🎨 **COLOR PALETTE - PREMIUM MEAT BRAND**

### **Primary Colors:**
```css
--burgundy-900: #450a0a;      /* Deep burgundy - headers */
--burgundy-800: #7f1d1d;      /* Rich burgundy - primary CTA */
--burgundy-700: #991b1b;      /* Medium burgundy - hover */
--burgundy-600: #b91c1c;      /* Bright burgundy - accent */
--burgundy-500: #dc2626;      /* Active burgundy - focus */
```

### **Secondary - Gold Accent:**
```css
--gold-900: #78350f;          /* Deep gold - premium badges */
--gold-700: #a16207;          /* Rich gold - icons */
--gold-500: #eab308;          /* Bright gold - highlights */
--gold-300: #fde047;          /* Light gold - subtle highlights */
```

### **Neutral - Warm Cream:**
```css
--cream-50: #fffef5;          /* Very light cream - background */
--cream-100: #fef9e7;         /* Light cream - cards */
--cream-200: #fcf4dd;         /* Medium cream - borders */
--cream-900: #1c1917;         /* Dark charcoal - text */
```

### **Success - Forest Green:**
```css
--green-700: #15803d;         /* Deep green - success */
--green-500: #22c55e;         /* Bright green - fresh badge */
--green-300: #86efac;         /* Light green - highlight */
```

### **Copper Accent:**
```css
--copper-700: #92400e;        /* Deep copper */
--copper-500: #b45309;        /* Medium copper */
--copper-300: #fdba74;        /* Light copper */
```

---

## ✍️ **TYPOGRAPHY**

### **Font Families:**
```typescript
const typography = {
  heading: '"Playfair Display", Georgia, serif',
  body: '"Inter", -apple-system, sans-serif',
  accent: '"Montserrat", sans-serif',
  mono: '"JetBrains Mono", monospace'
}
```

### **Font Scales:**
```css
--text-xs: 0.75rem;   /* 12px */
--text-sm: 0.875rem;  /* 14px */
--text-base: 1rem;    /* 16px */
--text-lg: 1.125rem;  /* 18px */
--text-xl: 1.25rem;   /* 20px */
--text-2xl: 1.5rem;   /* 24px */
--text-3xl: 1.875rem; /* 30px */
--text-4xl: 2.25rem;  /* 36px */
--text-5xl: 3rem;     /* 48px */
--text-6xl: 3.75rem;  /* 60px */
```

### **Font Weights:**
```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-black: 900;
```

---

## 🎭 **ANIMATIONS & TRANSITIONS**

### **Easing Functions:**
```typescript
const easing = {
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
}
```

### **Duration:**
```css
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
--duration-slower: 700ms;
```

### **Framer Motion Variants:**
```typescript
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

const slideUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } }
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}
```

---

## 🎨 **COMPONENT STYLES**

### **Buttons:**
```typescript
// Primary CTA
className="
  px-8 py-4 
  bg-gradient-to-r from-burgundy-800 to-burgundy-700
  text-white font-semibold text-lg
  rounded-full
  shadow-lg shadow-burgundy-900/30
  hover:shadow-xl hover:shadow-burgundy-900/40
  hover:scale-105
  transition-all duration-300
  active:scale-95
"

// Secondary Button
className="
  px-6 py-3
  bg-white border-2 border-burgundy-800
  text-burgundy-800 font-semibold
  rounded-full
  hover:bg-burgundy-50
  transition-all duration-300
"

// Icon Button
className="
  p-3 rounded-full
  bg-cream-100 hover:bg-cream-200
  transition-all duration-200
  hover:scale-110 active:scale-95
"
```

### **Cards:**
```typescript
// Premium Product Card
className="
  group
  bg-white rounded-2xl
  border border-cream-200
  shadow-md hover:shadow-2xl
  transition-all duration-500
  overflow-hidden
  hover:-translate-y-2
"

// Glass Card
className="
  backdrop-blur-md
  bg-white/80
  border border-white/50
  rounded-3xl
  shadow-xl shadow-burgundy-900/10
"
```

### **Badges:**
```typescript
// Fresh Badge
className="
  px-3 py-1
  bg-gradient-to-r from-green-500 to-green-600
  text-white text-xs font-bold
  rounded-full
  shadow-md
  animate-pulse
"

// Premium Badge
className="
  px-4 py-1.5
  bg-gradient-to-r from-gold-700 to-gold-500
  text-white text-sm font-bold
  rounded-full
  shadow-lg
"
```

---

## 📐 **SPACING SYSTEM**

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

---

## 🖼️ **IMAGES & MEDIA**

### **Image Treatments:**
```css
/* Premium Product Image */
.product-image {
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: 1rem;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-image:hover {
  transform: scale(1.1);
}

/* Hero Image Overlay */
.hero-overlay {
  background: linear-gradient(
    135deg,
    rgba(69, 10, 10, 0.9) 0%,
    rgba(127, 29, 29, 0.7) 50%,
    rgba(153, 27, 27, 0.5) 100%
  );
}
```

---

## 🎯 **LAYOUT PATTERNS**

### **Container Widths:**
```css
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;
```

### **Grid Systems:**
```css
/* Product Grid */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

/* Category Grid */
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}
```

---

## ✨ **MICRO-INTERACTIONS**

### **Cart Add Animation:**
```typescript
const cartAdd = {
  initial: { scale: 1 },
  tap: { scale: 0.95 },
  added: {
    scale: [1, 1.2, 1],
    transition: { duration: 0.4, times: [0, 0.5, 1] }
  }
}
```

### **Hover Effects:**
```css
/* Glow Effect */
.glow-on-hover {
  transition: all 0.3s ease;
}

.glow-on-hover:hover {
  box-shadow: 
    0 0 20px rgba(220, 38, 38, 0.3),
    0 0 40px rgba(220, 38, 38, 0.2),
    0 0 60px rgba(220, 38, 38, 0.1);
}

/* Shine Effect */
.shine {
  position: relative;
  overflow: hidden;
}

.shine::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: left 0.6s;
}

.shine:hover::before {
  left: 100%;
}
```

---

## 🎨 **TAILWIND CONFIG INTEGRATION**

Add to `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        burgundy: {
          950: '#3a0808',
          900: '#450a0a',
          800: '#7f1d1d',
          700: '#991b1b',
          600: '#b91c1c',
          500: '#dc2626',
        },
        gold: {
          900: '#78350f',
          700: '#a16207',
          500: '#eab308',
          300: '#fde047',
        },
        cream: {
          50: '#fffef5',
          100: '#fef9e7',
          200: '#fcf4dd',
          900: '#1c1917',
        },
        copper: {
          700: '#92400e',
          500: '#b45309',
          300: '#fdba74',
        }
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Inter"', '-apple-system', 'sans-serif'],
        accent: ['"Montserrat"', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 20px 60px -12px rgba(69, 10, 10, 0.25)',
        'glow': '0 0 20px rgba(234, 179, 8, 0.4)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        }
      }
    }
  }
}
```

---

## 🚀 **IMPLEMENTATION PRIORITY:**

1. ✅ Update Tailwind config
2. ✅ Add Google Fonts (Playfair Display, Montserrat)
3. ✅ Create reusable component library
4. ✅ Implement animations with Framer Motion
5. ✅ Build premium homepage
6. ✅ Redesign product cards
7. ✅ Polish cart & checkout experience

---

**This design system will make MeatHub look MORE PREMIUM than Licious!** 🌟
