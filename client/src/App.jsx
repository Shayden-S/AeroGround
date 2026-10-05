import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Login from './pages/Login';
import MainDashboard from './pages/MainDashboard';
import EquipmentPage from './pages/EquipmentPage';
import FaultReportsPage from './pages/FaultReportsPage';
import AssignmentsPage from './pages/AssignmentsPage';
import InspectionsPage from './pages/InspectionsPage';
import MaintenancePage from './pages/MaintenancePage';
import ReportsPage from './pages/ReportsPage';
import UsersPage from './pages/UsersPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Full-screen Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Authenticated Layout Routes */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<MainDashboard />} />
          <Route path="/equipment" element={<EquipmentPage />} />

          {/* Planned Operational Route Placeholders */}
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/fault-reports" element={<FaultReportsPage />} />
          <Route path="/fault-reports/new" element={<FaultReportsPage />} />
          <Route path="/assignments" element={<AssignmentsPage />} />
          <Route path="/inspections" element={<InspectionsPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
