export interface Translations {
  navigation: {
    home: string;
    features: string;
    about: string;
    login: string;
    signup: string;
    logout: string;
    profile: string;
    chatbot: string;
  };
  hero: {
    title: string;
    subtitle: string;
    getStarted: string;
    learnMore: string;
    badge: string;
    pills: {
      fast: string;
      secure: string;
      aiPowered: string;
    };
  };
  features: {
    title: string;
    subtitle: string;
    feature1: {
      title: string;
      description: string;
    };
    feature2: {
      title: string;
      description: string;
    };
    feature3: {
      title: string;
      description: string;
    };
    feature4: {
      title: string;
      description: string;
    };
    feature5: {
      title: string;
      description: string;
    };
    feature6: {
      title: string;
      description: string;
    };
  };
  about: {
    title: string;
    subtitle: string;
    description: string;
    mission: {
      title: string;
      description: string;
    };
    vision: {
      title: string;
      description: string;
    };
    stats: {
      industryLeading: {
        title: string;
        description: string;
      };
      users: {
        title: string;
        description: string;
      };
      satisfaction: {
        title: string;
        description: string;
      };
    };
  };
  auth: {
    signIn: {
      title: string;
      subtitle: string;
      description: string;
      button: string;
      noAccount: string;
      backToHome: string;
    };
    signUp: {
      title: string;
      subtitle: string;
      description: string;
      button: string;
      creating: string;
      haveAccount: string;
    };
    fields: {
      email: string;
      emailPlaceholder: string;
      password: string;
      passwordPlaceholder: string;
      confirmPassword: string;
      fullName: string;
      fullNamePlaceholder: string;
      username: string;
      usernamePlaceholder: string;
      passwordHint: string;
    };
    options: {
      orContinueWith: string;
      orSignUpWith: string;
      google: string;
      github: string;
    };
    terms: {
      agreeToTerms: string;
      termsOfService: string;
      and: string;
      privacyPolicy: string;
    };
  };
  chat: {
    newChat: string;
    createChat: string;
    chatHistory: string;
    deleteChat: string;
    clearHistory: string;
    typeMessage: string;
    send: string;
    emptyState: {
      title: string;
      description: string;
    };
    timeGroups: {
      today: string;
      yesterday: string;
      lastWeek: string;
      older: string;
    };
  };
  chatbot: {
    title: string;
    selectModel: string;
    models: {
      gpt4: string;
      gpt35: string;
      claude: string;
    };
  };
  profile: {
    myProfile: string;
    aiSummary: string;
    interests: string;
    commonQueries: string;
    stats: {
      totalChats: string;
      favoriteModel: string;
      memberSince: string;
    };
    actions: {
      editProfile: string;
    };
  };
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    close: string;
    confirm: string;
    search: string;
    filter: string;
    sort: string;
    viewMore: string;
    viewLess: string;
  };
  errors: {
    generic: string;
    network: string;
    unauthorized: string;
    notFound: string;
    validation: {
      required: string;
      email: string;
      username: {
        min: string;
        max: string;
        pattern: string;
      };
      password: {
        min: string;
        max: string;
        uppercase: string;
        lowercase: string;
        number: string;
        special: string;
      };
      passwordMatch: string;
    };
    serverError: string;
    timeout: string;
    invalidCredentials: string;
    googleAuthFailed: string;
    loginFailed: string;
    signupFailed: string;
    emailAlreadyExists: string;
    weakPassword: string;
  };
  messages: {
    chatCreated: string;
    chatDeleted: string;
    profileUpdated: string;
    settingsSaved: string;
    messageSent: string;
    copySuccess: string;
    copyError: string;
  };
}

export type Language = 'en' | 'ar';

export type TranslationKey = string;
