import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Features from './pages/Features';
import HowItWorks from './pages/HowItWorks';
import VehicleMonitoring from './pages/VehicleMonitoring';
import Dashboard from './pages/Dashboard';
import Maintenance from './pages/Maintenance';
import Fleet from './pages/Fleet';
import FederatedLearning from './pages/FederatedLearning';
import Reports from './pages/Reports';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="features" element={<Features />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="vehicle-monitoring" element={<VehicleMonitoring />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="fleet" element={<Fleet />} />
          <Route path="federated-learning" element={<FederatedLearning />} />
          <Route path="reports" element={<Reports />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
