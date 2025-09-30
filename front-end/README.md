# AI Chatbot Landing Page

A modern, responsive landing page built with React, TypeScript, Vite, Tailwind CSS, and shadcn/ui.

## Features

✨ **Modern Design**
- Beautiful gradient backgrounds and smooth animations
- Glass-morphism effects
- Responsive design for all screen sizes

🌐 **Multi-Language Support**
- English and Arabic language toggle
- RTL (Right-to-Left) support for Arabic

🎨 **UI Components**
- Hero section with animated elements
- Feature highlights with icons
- About section with mission and vision
- Responsive navigation bar
- User authentication menu
- Chatbot access button

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Lucide React** - Icons
- **Framer Motion** - Animations

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn/pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
front-end/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── Navigation.tsx   # Navigation bar
│   │   ├── Hero.tsx         # Hero section
│   │   ├── Features.tsx     # Features section
│   │   └── About.tsx        # About section
│   ├── contexts/
│   │   └── LanguageContext.tsx  # Language management
│   ├── lib/
│   │   └── utils.ts         # Utility functions
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   ├── index.css            # Global styles
│   └── App.css              # App-specific styles
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Vite config
├── tailwind.config.js       # Tailwind config
└── postcss.config.js        # PostCSS config
```

## Features Implemented

### Navigation Bar
- Sticky navigation with blur effect on scroll
- Language toggle (English/Arabic)
- User authentication dropdown (Login/Sign Up)
- Chatbot access button
- Responsive mobile menu

### Hero Section
- Animated gradient background
- Floating elements
- Call-to-action buttons
- Feature pills
- Scroll indicator

### Features Section
- 6 feature cards with icons
- Glass-morphism effect
- Hover animations
- Statistics display

### About Section
- Mission and vision statements
- Animated visual elements
- Achievement cards
- Responsive layout

## Customization

### Colors
Edit `src/index.css` to customize the color scheme:
```css
:root {
  --primary: 262 83% 58%;  /* Purple */
  --secondary: 210 40% 96.1%;
  /* ... other colors */
}
```

### Translations
Add or modify translations in `src/contexts/LanguageContext.tsx`:
```typescript
const translations: Translations = {
  key: { en: 'English', ar: 'Arabic' },
  // Add more translations
};
```

## License

MIT

## Author

Built with ❤️ using React + TypeScript + shadcn/ui
