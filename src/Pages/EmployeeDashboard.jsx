import React, { useState } from 'react';
import Header from '../components/common/Header.jsx';
import Leftbar from '../components/common/leftbar.jsx';
import { Outlet } from 'react-router-dom';

function EmployeeDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div>

      <Header onToggleSidebar={toggleSidebar} />

          <div className="container">
        <Leftbar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
export default EmployeeDashboard;