import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ChatProvider } from '@/contexts/ChatContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import PublicRoute from '@/components/PublicRoute';
import Navigation from '@/components/Navigation';
import LanguageSync from '@/components/LanguageSync';
import Footer from '@/components/Footer';
import Landing from '@/pages/Landing';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import Chatbot from '@/pages/Chatbot';
import Profile from '@/pages/Profile';
import env from '@/config/env';
import './App.css';

function App() {
  return (
    <GoogleOAuthProvider clientId={env.googleClientId}>
      <Router>
        <LanguageProvider>
          <AuthProvider>
            <LanguageSync />
            <ChatProvider>
              <div className="min-h-screen bg-background text-foreground">
                <Navigation />
                <Routes>
                  {/* Landing Page with Footer */}
                  <Route
                    path="/"
                    element={
                      <>
                        <main>
                          <Landing />
                        </main>
                        <Footer />
                      </>
                    }
                  />

                  {/* Sign In Page - Redirect to chatbot if already logged in */}
                  <Route
                    path="/signin"
                    element={
                      <PublicRoute restricted>
                        <SignIn />
                      </PublicRoute>
                    }
                  />

                  {/* Sign Up Page - Redirect to chatbot if already logged in */}
                  <Route
                    path="/signup"
                    element={
                      <PublicRoute restricted>
                        <SignUp />
                      </PublicRoute>
                    }
                  />

        
                  {/* Chatbot Page - Protected, requires authentication */}
                  <Route
                    path="/chatbot"
                    element={
                      <ProtectedRoute>
                        <Chatbot />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/chatbot/:id"
                    element={
                      <ProtectedRoute>
                        <Chatbot />
                      </ProtectedRoute>
                    } />

                  {/* Profile Page - Protected, requires authentication */}
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </div>
            </ChatProvider>
          </AuthProvider>
        </LanguageProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
