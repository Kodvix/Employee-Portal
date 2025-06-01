import React from 'react';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaCalendarCheck, FaTasks, FaUserTie, FaChartLine } from 'react-icons/fa';
import logo from '../../assets/logos/kodvix-logo.png';
import styles from './UserSidebar.module.css';

const AdminSidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <img src={logo} alt="Kodvix Logo" />
      </div>
      <nav className={styles.sidebarMenu}>
        <a href="/dashboard"><FaTachometerAlt /> Dashboard</a>
        <Link to="/Attendance"><FaCalendarCheck /> Attendance</Link>
        <a href="/Task"><FaTasks /> Tasks</a>
        <a href="/LeaveRequestPage"><FaUserTie /> HR Requests</a>
        <a href="/UserPerformances"><FaChartLine /> Performance</a>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
