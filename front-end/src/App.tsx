import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ChatProvider } from '@/contexts/ChatContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import PublicRoute from '@/components/PublicRoute';
import Navigation from '@/components/Navigation';
import Landing from '@/pages/Landing';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import Chat from '@/pages/Chat';
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
                  <footer className="bg-secondary/50 py-8 border-t">
                    <div className="container mx-auto px-4">
                      <div className="text-center text-muted-foreground">
                        <p>&copy; 2025 AI Chatbot. All rights reserved.</p>
                        <p className="mt-2 text-sm">Built with React, TypeScript, and shadcn/ui</p>
                      </div>
                    </div>
                  </footer>
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

            {/* Chat Page - Protected, requires authentication */}
            <Route 
              path="/chat" 
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
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
