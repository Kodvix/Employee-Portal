import React, { useState } from 'react';
import Header from '../components/common/Header.jsx';
import Adminleftbar from '../components/common/Adminleftbar.jsx';
import { Outlet } from 'react-router-dom';

function AdminDashboards() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div>
      {/* Header on top */}
      <Header onToggleSidebar={toggleSidebar} />

      {/* Sidebar and content below header */}
      <div className="container">
        <Adminleftbar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
export default AdminDashboards;