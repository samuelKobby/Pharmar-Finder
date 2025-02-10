import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { MainLayout } from './components/layouts/MainLayout';
import { AuthLayout } from './components/layouts/AuthLayout';
import { PharmacyLayout } from './components/layouts/PharmacyLayout';
import { PharmacyAuthProvider, RequirePharmacyAuth } from './contexts/PharmacyAuthContext';
import { Home } from './pages/Home';
import { Medicines } from './pages/Medicines';
import { Pharmacies } from './pages/Pharmacies';
import { CategoryView } from './pages/CategoryView';
import { MedicineDetails } from './pages/MedicineDetails';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminSignup } from './pages/admin/AdminSignup';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { Analytics } from './pages/admin/Analytics';
import { PharmacyManagement } from './pages/admin/Categories';
import { Inventory } from './pages/admin/Inventory';
import { Notifications } from './pages/admin/Notifications';
import { Users } from './pages/admin/Users';
import { Settings } from './pages/admin/Settings';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { PharmacyLogin } from './pages/PharmacyLogin';
import { PharmacyDashboard } from './pages/pharmacy/PharmacyDashboard';
import { PharmacyInventory } from './pages/pharmacy/PharmacyInventory';
import { PharmacyHours } from './pages/pharmacy/PharmacyHours';
import { PharmacyNotifications } from './pages/pharmacy/PharmacyNotifications';
import { PharmacySettings } from './pages/pharmacy/PharmacySettings';

function App() {
  return (
    <Router>
      <PharmacyAuthProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Main Layout Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="medicines" element={<Medicines />} />
            <Route path="medicine/:id" element={<MedicineDetails />} />
            <Route path="pharmacies" element={<Pharmacies />} />
            <Route path="category/:id" element={<CategoryView />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
          </Route>

          {/* Auth Layout Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/pharmacy/login" element={<PharmacyLogin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/signup" element={<AdminSignup />} />
          </Route>

          {/* Pharmacy Routes */}
          <Route path="/pharmacy" element={<PharmacyLayout />}>
            <Route path="dashboard" element={
              <RequirePharmacyAuth>
                <PharmacyDashboard />
              </RequirePharmacyAuth>
            } />
            <Route path="inventory" element={
              <RequirePharmacyAuth>
                <PharmacyInventory />
              </RequirePharmacyAuth>
            } />
            <Route path="hours" element={
              <RequirePharmacyAuth>
                <PharmacyHours />
              </RequirePharmacyAuth>
            } />
            <Route path="notifications" element={
              <RequirePharmacyAuth>
                <PharmacyNotifications />
              </RequirePharmacyAuth>
            } />
            <Route path="settings" element={
              <RequirePharmacyAuth>
                <PharmacySettings />
              </RequirePharmacyAuth>
            } />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </PharmacyAuthProvider>
    </Router>
  );
}

export default App;