import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState('All Apron Areas');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--canvas-bg)' }}>
      {/* Sidebar Rail */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} selectedArea={selectedArea} onAreaChange={setSelectedArea} />
        <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          <Outlet context={{ selectedArea, setSelectedArea }} />
        </main>
      </div>
    </div>
  );
}
