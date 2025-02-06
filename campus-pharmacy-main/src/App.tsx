import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/navigation/Navbar';
import { Footer } from './components/navigation/Footer';
import { Home } from './pages/Home';
import { Medicines } from './pages/Medicines';
import { PharmacyList } from './pages/PharmacyList';
import { PharmacyLogin } from './pages/PharmacyLogin';
import { PharmacyDashboard } from './pages/PharmacyDashboard';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { About } from './pages/About';
import { Contact } from './pages/Contact';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/medicines" element={<Medicines />} />
            <Route path="/pharmacies" element={<PharmacyList />} />
            <Route path="/pharmacy-login" element={<PharmacyLogin />} />
            <Route path="/pharmacy-dashboard" element={<PharmacyDashboard />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;