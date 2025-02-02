import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import FormLogin from './components/FormLogin';
import Dashboard from './components/Dashboard';

export default function App() {

  
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<FormLogin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}