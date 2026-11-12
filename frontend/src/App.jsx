import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';
import ChatbotWidget from './components/Chatbot/ChatbotWidget';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <ChatbotWidget />
      </AuthProvider>
    </BrowserRouter>
  );
}
