import React from 'react';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaCalendarAlt, FaUsersCog, FaChartBar, FaCog } from 'react-icons/fa';
import logo from '../../assets/logos/kodvix-logo.png';
import styles from './AdminSidebar.module.css';

const AdminSidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <img src={logo} alt="Kodvix Logo" />
      </div>
      <nav className={styles.sidebarMenu}>
        <Link to="/AdminDashboard"><FaTachometerAlt /> Dashboard</Link>
        <Link to="/AdminEmployeeManagement"><FaUsers /> Employees</Link>
        <Link to="/AdminAttendancePage"><FaCalendarAlt /> Attendance Management</Link>
        <Link to="/AdminTask"><FaCalendarAlt /> Assign Task</Link>
        <Link to="/AdminHRManagementPage"><FaUsersCog /> HR Management</Link>
        <Link to="/AddOfficeEventPage"><FaUsersCog /> Add Office Event</Link>
      </nav>
    </aside>
  );
};

export default AdminSidebar;