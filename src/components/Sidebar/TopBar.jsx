import React from 'react';
import { FiLogOut } from 'react-icons/fi';

import { useNavigate } from 'react-router-dom';
import styles from './TopBar.module.css';
import NotificationBell from '../NotificationBell.jsx/NotificationBell.jsx';
import user4 from '../../assets/images/user4.png';

const TopBar = () => {
  const navigate = useNavigate();
  const userName = "John"; 

  const handleLogout = () => {
    // Clear local storage/session if needed
    // localStorage.clear();
    navigate("/");
  };

  return (
    <header className={styles.navbar}>
      <h2>Hi!, {userName}</h2>

      <div className={styles.rightSection}>
        <NotificationBell />
         <img src={user4} alt="User" />
        
        <button className={styles.logoutButton} onClick={handleLogout}>
          <FiLogOut className={styles.logoutIcon} />
          Logout
        </button>
      </div>
    </header>
  );
};

export default TopBar;
