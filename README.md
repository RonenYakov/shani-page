# Shani Social Media - Bilingual SMM Landing Page

A modern, conversion-focused social media management landing page with bilingual support (Hebrew/English), built with React + TypeScript + Tailwind CSS.

## 🚀 Features

- **Bilingual Support**: Hebrew (default) and English with RTL/LTR switching
- **Mobile-First Design**: Optimized for mobile with sticky WhatsApp CTA
- **Conversion Optimized**: Lead magnet, service packages, case studies, testimonials
- **Video Integration**: Modal video player for case studies and portfolio
- **Analytics Ready**: Facebook Pixel, TikTok Pixel, Google Analytics support
- **SEO Optimized**: Proper meta tags, structured data, OG tags

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **UI Components**: shadcn/ui
- **Deployment**: Ready for Vercel/Netlify

## 📁 Project Structure

```
src/
├── components/          # All React components
│   ├── Hero.tsx        # Hero section with video background
│   ├── Services.tsx    # Service packages (retainers)
│   ├── WorkCategories.tsx  # Portfolio with video modal
│   ├── CaseStudies.tsx # Mini case studies
│   ├── Testimonials.tsx # Client testimonials
│   ├── LeadMagnet.tsx  # Lead capture form
│   ├── FAQ.tsx         # Frequently asked questions
│   └── ...
├── content/            # Content management
│   ├── services.json   # Service packages data
│   ├── caseStudies.json # Case studies data
│   ├── testimonials.json # Testimonials data
│   ├── faq.json       # FAQ data
│   └── socials.ts     # Social media links
├── i18n/              # Internationalization
│   ├── he.json        # Hebrew translations
│   ├── en.json        # English translations
│   └── index.ts       # i18n system
└── pages/
    └── Index.tsx      # Main landing page
```

## 🎨 How to Customize Content

### 1. Update Services/Packages
Edit `src/content/services.json`:
```json
{
  "id": "starter",
  "nameKey": "services.package.starter", 
  "price": "₪2,500",
  "deliverables": {
    "he": ["8 פוסטים חודשיים", "..."],
    "en": ["8 monthly posts", "..."]
  }
}
```

### 2. Update Case Studies
Edit `src/content/caseStudies.json`:
```json
{
  "category": "Awareness",
  "title": {"he": "כותרת בעברית", "en": "English title"},
  "videoUrl": "/path/to/video.mov"
}
```

### 3. Update Text/Copy
Edit translation files:
- `src/i18n/he.json` - Hebrew text
- `src/i18n/en.json` - English text

### 4. Update Contact Info
Edit `src/content/socials.ts`:
```typescript
export const socials = {
  whatsappUrl: "https://wa.me/YOUR_NUMBER",
  calendlyUrl: "https://calendly.com/your-link", // optional
  instagram: "https://instagram.com/your_handle"
}
```

## 🔧 Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📊 Analytics Setup

1. Copy `env.example` to `.env.local`
2. Add your tracking IDs:
```env
VITE_META_PIXEL_ID=your_facebook_pixel_id
VITE_TIKTOK_PIXEL_ID=your_tiktok_pixel_id
VITE_GA_ID=your_google_analytics_id
```

## 🎯 Performance Checklist

- [x] Image optimization with lazy loading
- [x] Video preloading with poster images
- [x] Code splitting for heavy components
- [x] Mobile-first responsive design
- [x] Accessibility (ARIA labels, keyboard nav)
- [x] SEO meta tags and structured data
- [x] Core Web Vitals optimization

## 🌍 Deployment

### Assets Required
Place these in `/public/`:
- `/videos/hero.webm` & `/videos/hero.mp4` - Hero background video
- `/images/hero-poster.jpg` - Hero video poster
- `/images/og.jpg` - Social sharing image
- Portfolio videos in `/assets/` folder

### Environment Variables
Set these in your deployment platform:
- `VITE_META_PIXEL_ID`
- `VITE_TIKTOK_PIXEL_ID` 
- `VITE_GA_ID`

## 📝 Content Management

All content is managed through JSON files and TypeScript constants, making it easy to update without touching React code:

- **Services**: `src/content/services.json`
- **Case Studies**: `src/content/caseStudies.json`
- **Testimonials**: `src/content/testimonials.json`
- **FAQ**: `src/content/faq.json`
- **Social Links**: `src/content/socials.ts`
- **Copy/Text**: `src/i18n/he.json` & `src/i18n/en.json`

## 🎨 Design System

Built with a luxury/cinematic color palette:
- **Primary**: Gold (#E6B325)
- **Dark**: Cinematic Black (#0D0D0F)  
- **Light**: Cream (#FDF8F2)
- **Accent**: Light Brown (#C8A97E)

Typography: Playfair Display (headings) + Inter (body)
