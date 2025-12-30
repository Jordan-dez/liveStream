import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { Home } from '@/pages/Home';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { Concerts } from '@/pages/Concerts';
import { ConcertDetails } from '@/pages/ConcertDetails';
import { PaymentSuccess } from '@/pages/PaymentSuccess';
import { Stream } from '@/pages/Stream';

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const token = localStorage.getItem('livestream_auth_token');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/concerts" element={<Concerts />} />
            <Route path="/concerts/:concertId" element={<ConcertDetails />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route
              path="/stream/:concertId"
              element={
                <PrivateRoute>
                  <Stream />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

