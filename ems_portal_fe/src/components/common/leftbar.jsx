import { Link, useNavigate } from 'react-router-dom';
import '../../styles/style.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowDown } from '@fortawesome/free-solid-svg-icons';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faUserAlt } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { FaTachometerAlt, FaCalendarCheck, FaTasks, FaUserTie } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext'; // Import the auth context

function Leftbar({ isOpen }) {
  const navigate = useNavigate();
  const { logout } = useAuth(); // Get the logout function from context

  const handleLogout = () => {
    // Use the logout function from AuthContext
    logout();
    toast.success("Logged out successfully!");
    navigate('/');  // Navigate to login page
  };

  return (
    <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <ul className="sidebar-menu">
        <li><Link to="/employee-dashboard"><FaTachometerAlt />  Dashboard</Link></li>
        {/* <li><Link to="/employee-dashboard/employee"><FontAwesomeIcon icon={faUsers} /> Employee Management</Link></li> */}
        <li><Link to="/employee-dashboard/attendance"><FaCalendarCheck/> Attendance</Link></li>
        {/* <li><Link to="/employee-dashboard/leave"><FontAwesomeIcon icon={faFile} /> Leave Management</Link></li> */}
        <li><Link to="/employee-dashboard/Task"><FaTasks/> Tasks</Link></li>
        <li><Link to="/employee-dashboard/LeaveRequestPage"><FaUserTie /> HR Requests</Link></li>
        <li><Link to="/employee-dashboard/DocumentCenter"><FontAwesomeIcon icon={faFile} /> DocumentCenter</Link></li>
        <li><Link to="/employee-dashboard/OfficeEventPage"><FontAwesomeIcon icon={faUsers} /> OfficeEventPage</Link></li>
        <li><Link to="/employee-dashboard/EmployeeProfile"><FontAwesomeIcon icon={faUserAlt} /> EmployeeProfile</Link></li>
        <li onClick={handleLogout} style={{ cursor: 'pointer' }}>
          <FontAwesomeIcon icon={faLongArrowDown} rotation={90} /> Logout
        </li>
      </ul>
    </div>
  );
}

export default Leftbar;