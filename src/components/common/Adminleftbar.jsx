import React from 'react';
import { Link , useNavigate} from 'react-router-dom';
import '../../styles/style.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faLongArrowDown } from '@fortawesome/free-solid-svg-icons';
import {faFile } from '@fortawesome/free-solid-svg-icons';

import { toast } from 'react-toastify';
import { FaTachometerAlt, FaUsers, FaCalendarAlt, FaUsersCog } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

function Adminleftbar({ isOpen }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");

    navigate('/');
  };
  return (
    <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <ul className="sidebar-menu">
        <li><Link to="/Admin-dashboard"><FaTachometerAlt />  Dashboard</Link></li>
        <li><Link to="/Admin-dashboard/AdminEmployeeManagement"><FaUsers /> Employees</Link></li>
        <li><Link to="/Admin-dashboard/AdminAttendancePage"><FaCalendarAlt />Attendance Management</Link></li>
        <li><Link to="/Admin-dashboard/AdminTask"><FaCalendarAlt />  Assign Task</Link></li>
        <li><Link to="/Admin-dashboard/AdminHRManagementPage"><FaUsersCog />  HR Management</Link></li>
        <li><Link to="/Admin-dashboard/AddOfficeEventPage"><FaUsersCog />  Add Office Event</Link></li>
        <li><Link to="/Admin-dashboard/AdminDocumentsPage"><FontAwesomeIcon icon={faFile} />  AdminDocumentsPage</Link></li>

        <li onClick={handleLogout} >
          <FontAwesomeIcon icon={faLongArrowDown} rotation={90} /> Logout </li>
      </ul>
    </div>
  );
}
export default Adminleftbar;


