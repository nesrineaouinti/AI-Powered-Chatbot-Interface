# AI-Powered Chatbot Interface

A modern, responsive AI chatbot interface built with React, TypeScript, Vite, Tailwind CSS, and shadcn/ui. Features real-time chat, multi-language support, user authentication, and profile management.

## Features

🤖 **AI Chatbot**
- Real-time messaging with AI models
- Multiple AI model support (Groq, Llama, etc.)
- Message history and chat management
- Typing indicators and loading states

🌐 **Multi-Language Support**
- English and Arabic language toggle
- RTL (Right-to-Left) support for Arabic
- Dynamic language switching

🔐 **User Authentication**
- Sign up and sign in functionality
- Protected routes and user sessions
- Profile management and editing

🎨 **Modern UI/UX**
- Beautiful gradient backgrounds and smooth animations
- Glass-morphism effects
- Responsive design for all screen sizes
- Dark/light theme support

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Lucide React** - Icons
- **React Router** - Client-side routing
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **date-fns** - Date utilities

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
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── ChatSidebar.tsx     # Chat sidebar with conversation list
│   │   ├── ChatMessages.tsx    # Chat message display component
│   │   ├── ChatInput.tsx       # Message input component
│   │   ├── Navigation.tsx      # Main navigation bar
│   │   ├── Hero.tsx            # Landing page hero section
│   │   ├── Features.tsx        # Features showcase section
│   │   ├── About.tsx           # About section
│   │   ├── Footer.tsx          # Footer component
│   │   ├── LanguageSwitcher.tsx # Language toggle component
│   │   ├── GoogleLoginButton.tsx # Google OAuth button
│   │   ├── EditProfileDialog.tsx # User profile editing modal
│   │   ├── ProtectedRoute.tsx  # Route protection wrapper
│   │   ├── PublicRoute.tsx     # Public route wrapper
│   │   └── index.ts            # Component exports
│   ├── pages/
│   │   ├── Chatbot.tsx         # Main chat interface
│   │   ├── Landing.tsx         # Landing/home page
│   │   ├── Profile.tsx         # User profile page
│   │   ├── SignIn.tsx          # Sign in page
│   │   └── SignUp.tsx          # Sign up page
│   ├── contexts/
│   │   ├── AuthContext.tsx     # Authentication state management
│   │   ├── ChatContext.tsx     # Chat state and operations
│   │   └── LanguageContext.tsx # Language and translations
│   ├── services/
│   │   ├── chatService.ts      # Chat API calls
│   │   └── authService.ts      # Authentication API calls
│   ├── types/
│   │   ├── chat.ts             # Chat and message type definitions
│   │   └── auth.ts             # Authentication type definitions
│   ├── schemas/
│   │   └── authSchemas.ts      # Form validation schemas
│   ├── hooks/
│   │   └── useAuth.ts          # Custom authentication hook
│   ├── locales/
│   │   ├── en.json             # English translations
│   │   └── ar.json             # Arabic translations
│   ├── config/
│   │   └── firebase.ts         # Firebase configuration
│   ├── lib/
│   │   ├── utils.ts            # Utility functions
│   │   └── validations.ts      # Validation helpers
│   ├── App.tsx                 # Main app component with routing
│   ├── main.tsx                # React application entry point
│   ├── index.css               # Global styles and Tailwind imports
│   └── App.css                 # App-specific styles
├── public/                     # Static assets
├── index.html                  # HTML template
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite build configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
└── README.md                   # This file
```

## Features Implemented

### Chatbot Interface
- **Real-time messaging** with AI models (Groq, Llama, etc.)
- **Message history** with persistent chat conversations
- **Typing indicators** and loading states during AI responses
- **Chat sidebar** with conversation list and search
- **Message timestamps** and response time tracking
- **Multi-language chat** support (English/Arabic)
- **Responsive chat layout** for mobile and desktop

### User Authentication & Profile
- **Google OAuth integration** for seamless login
- **User registration and login** forms with validation
- **Protected routes** requiring authentication
- **User profile management** with editable information
- **Session management** with automatic logout

### Navigation & UI
- **Responsive navigation** with mobile-friendly sidebar
- **Multi-language support** (English/Arabic) with RTL layout
- **Dark/light theme** compatibility
- **Modern glass-morphism design** with smooth animations
- **Mobile-responsive layout** for all screen sizes

### Technical Features
- **TypeScript** for complete type safety
- **Form validation** using Zod schemas
- **Context-based state management** for auth, chat, and language
- **API integration** with backend services
- **Internationalization** with JSON-based translations

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
