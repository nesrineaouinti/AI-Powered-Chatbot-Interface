import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface Translations {
  [key: string]: {
    en: string;
    ar: string;
  };
}

const translations: Translations = {
  // Navigation
  home: { en: 'Home', ar: 'الرئيسية' },
  features: { en: 'Features', ar: 'المميزات' },
  about: { en: 'About', ar: 'حول' },
  login: { en: 'Login', ar: 'تسجيل الدخول' },
  signup: { en: 'Sign Up', ar: 'إنشاء حساب' },
  logout: { en: 'Logout', ar: 'تسجيل الخروج' },
  profile: { en: 'Profile', ar: 'الملف الشخصي' },
  chatbot: { en: 'Chatbot', ar: 'المساعد الذكي' },
  
  // Hero Section
  heroTitle: { 
    en: 'Your Intelligent AI Assistant', 
    ar: 'مساعدك الذكي بالذكاء الاصطناعي' 
  },
  heroSubtitle: { 
    en: 'Experience the future of conversation with our advanced AI chatbot. Get instant answers, personalized assistance, and seamless interactions.', 
    ar: 'اختبر مستقبل المحادثة مع روبوت الدردشة المتقدم بالذكاء الاصطناعي. احصل على إجابات فورية ومساعدة شخصية وتفاعلات سلسة.' 
  },
  getStarted: { en: 'Get Started', ar: 'ابدأ الآن' },
  learnMore: { en: 'Learn More', ar: 'اعرف المزيد' },
  
  // Features Section
  featuresTitle: { en: 'Powerful Features', ar: 'مميزات قوية' },
  featuresSubtitle: { 
    en: 'Everything you need for intelligent conversations', 
    ar: 'كل ما تحتاجه للمحادثات الذكية' 
  },
  
  feature1Title: { en: '24/7 Availability', ar: 'متاح 24/7' },
  feature1Desc: { 
    en: 'Get instant responses anytime, anywhere. Our AI never sleeps.', 
    ar: 'احصل على ردود فورية في أي وقت وأي مكان. الذكاء الاصطناعي لدينا لا ينام أبداً.' 
  },
  
  feature2Title: { en: 'Multi-Language Support', ar: 'دعم متعدد اللغات' },
  feature2Desc: { 
    en: 'Communicate in your preferred language with seamless translation.', 
    ar: 'تواصل بلغتك المفضلة مع ترجمة سلسة.' 
  },
  
  feature3Title: { en: 'Smart Context Understanding', ar: 'فهم ذكي للسياق' },
  feature3Desc: { 
    en: 'Advanced AI that understands context and provides relevant answers.', 
    ar: 'ذكاء اصطناعي متقدم يفهم السياق ويقدم إجابات ذات صلة.' 
  },
  
  feature4Title: { en: 'Secure & Private', ar: 'آمن وخاص' },
  feature4Desc: { 
    en: 'Your conversations are encrypted and your privacy is our priority.', 
    ar: 'محادثاتك مشفرة وخصوصيتك هي أولويتنا.' 
  },
  
  feature5Title: { en: 'Personalized Experience', ar: 'تجربة شخصية' },
  feature5Desc: { 
    en: 'AI learns from your preferences to provide tailored responses.', 
    ar: 'يتعلم الذكاء الاصطناعي من تفضيلاتك لتقديم ردود مخصصة.' 
  },
  
  feature6Title: { en: 'Fast & Efficient', ar: 'سريع وفعال' },
  feature6Desc: { 
    en: 'Lightning-fast responses powered by cutting-edge technology.', 
    ar: 'ردود سريعة البرق مدعومة بأحدث التقنيات.' 
  },
  
  // About Section
  aboutTitle: { en: 'About Our Platform', ar: 'حول منصتنا' },
  aboutSubtitle: { 
    en: 'Building the future of AI-powered communication', 
    ar: 'بناء مستقبل الاتصال المدعوم بالذكاء الاصطناعي' 
  },
  aboutDesc: { 
    en: 'We are dedicated to creating intelligent solutions that enhance human-AI interaction. Our chatbot leverages state-of-the-art natural language processing to understand and respond to your needs with unprecedented accuracy and efficiency.', 
    ar: 'نحن ملتزمون بإنشاء حلول ذكية تعزز التفاعل بين الإنسان والذكاء الاصطناعي. يستفيد روبوت الدردشة الخاص بنا من أحدث معالجة اللغة الطبيعية لفهم احتياجاتك والاستجابة لها بدقة وكفاءة غير مسبوقة.' 
  },
  
  missionTitle: { en: 'Our Mission', ar: 'مهمتنا' },
  missionDesc: { 
    en: 'To make AI accessible and beneficial for everyone through intuitive and powerful conversational interfaces.', 
    ar: 'جعل الذكاء الاصطناعي متاحاً ومفيداً للجميع من خلال واجهات محادثة بديهية وقوية.' 
  },
  
  visionTitle: { en: 'Our Vision', ar: 'رؤيتنا' },
  visionDesc: { 
    en: 'A world where AI seamlessly integrates into daily life, empowering people with instant knowledge and assistance.', 
    ar: 'عالم يتكامل فيه الذكاء الاصطناعي بسلاسة في الحياة اليومية، ويمكّن الناس بالمعرفة والمساعدة الفورية.' 
  },
  
  // Sign In Page
  signInTitle: { en: 'Sign In', ar: 'تسجيل الدخول' },
  signInSubtitle: { en: 'Welcome back! Sign in to continue', ar: 'مرحباً بعودتك! سجل الدخول للمتابعة' },
  signInDescription: { en: 'Enter your credentials to access your account', ar: 'أدخل بيانات الاعتماد للوصول إلى حسابك' },
  email: { en: 'Email', ar: 'البريد الإلكتروني' },
  emailPlaceholder: { en: 'you@example.com', ar: 'you@example.com' },
  password: { en: 'Password', ar: 'كلمة المرور' },
  passwordPlaceholder: { en: '••••••••', ar: '••••••••' },
  forgotPassword: { en: 'Forgot password?', ar: 'نسيت كلمة المرور؟' },
  rememberMe: { en: 'Remember me for 30 days', ar: 'تذكرني لمدة 30 يوماً' },
  signInButton: { en: 'Sign In', ar: 'تسجيل الدخول' },
  orContinueWith: { en: 'Or continue with', ar: 'أو تابع باستخدام' },
  google: { en: 'Google', ar: 'جوجل' },
  github: { en: 'GitHub', ar: 'جيت هاب' },
  noAccount: { en: "Don't have an account?", ar: 'ليس لديك حساب؟' },
  backToHome: { en: '← Back to home', ar: 'العودة للرئيسية ←' },
  
  // Sign Up Page
  signUpTitle: { en: 'Create Account', ar: 'إنشاء حساب' },
  signUpSubtitle: { en: 'Create your account to get started', ar: 'أنشئ حسابك للبدء' },
  signUpDescription: { en: 'Sign up to start chatting with our AI assistant', ar: 'سجل للبدء في الدردشة مع مساعدنا الذكي' },
  fullName: { en: 'Full Name', ar: 'الاسم الكامل' },
  fullNamePlaceholder: { en: 'John Doe', ar: 'أحمد محمد' },
  confirmPassword: { en: 'Confirm Password', ar: 'تأكيد كلمة المرور' },
  passwordHint: { en: 'Must be at least 8 characters', ar: 'يجب أن تكون 8 أحرف على الأقل' },
  agreeToTerms: { en: 'I agree to the', ar: 'أوافق على' },
  termsOfService: { en: 'Terms of Service', ar: 'شروط الخدمة' },
  and: { en: 'and', ar: 'و' },
  privacyPolicy: { en: 'Privacy Policy', ar: 'سياسة الخصوصية' },
  createAccountButton: { en: 'Create Account', ar: 'إنشاء حساب' },
  orSignUpWith: { en: 'Or sign up with', ar: 'أو سجل باستخدام' },
  haveAccount: { en: 'Already have an account?', ar: 'لديك حساب بالفعل؟' },
  
  // Chatbot Page
  chatbotTitle: { en: 'AI Assistant', ar: 'المساعد الذكي' },
  selectModel: { en: 'Select AI Model', ar: 'اختر نموذج الذكاء الاصطناعي' },
  gpt4: { en: 'GPT-4 (Most Capable)', ar: 'GPT-4 (الأكثر قدرة)' },
  gpt35: { en: 'GPT-3.5 (Balanced)', ar: 'GPT-3.5 (متوازن)' },
  claude: { en: 'Claude (Creative)', ar: 'كلود (إبداعي)' },
  typeMessage: { en: 'Type your message...', ar: 'اكتب رسالتك...' },
  send: { en: 'Send', ar: 'إرسال' },
  newChat: { en: 'New Chat', ar: 'محادثة جديدة' },
  chatHistory: { en: 'Chat History', ar: 'سجل المحادثات' },
  today: { en: 'Today', ar: 'اليوم' },
  yesterday: { en: 'Yesterday', ar: 'أمس' },
  lastWeek: { en: 'Last 7 Days', ar: 'آخر 7 أيام' },
  older: { en: 'Older', ar: 'أقدم' },
  deleteChat: { en: 'Delete Chat', ar: 'حذف المحادثة' },
  clearHistory: { en: 'Clear History', ar: 'مسح السجل' },
  
  // User Profile
  myProfile: { en: 'My Profile', ar: 'ملفي الشخصي' },
  aiSummary: { en: 'AI-Generated Summary', ar: 'ملخص من الذكاء الاصطناعي' },
  interests: { en: 'Your Interests', ar: 'اهتماماتك' },
  commonQueries: { en: 'Common Queries', ar: 'الاستفسارات الشائعة' },
  totalChats: { en: 'Total Chats', ar: 'إجمالي المحادثات' },
  favoriteModel: { en: 'Favorite Model', ar: 'النموذج المفضل' },
  memberSince: { en: 'Member Since', ar: 'عضو منذ' },
  editProfile: { en: 'Edit Profile', ar: 'تعديل الملف' },
  settings: { en: 'Settings', ar: 'الإعدادات' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'font-arabic' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
