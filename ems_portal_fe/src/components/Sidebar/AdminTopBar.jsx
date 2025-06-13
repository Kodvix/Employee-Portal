import React, { useState } from 'react';
import { FiLogOut, FiMenu, FiSettings, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import styles from './AdminTopBar.module.css';

const AdminTopBar = () => {
  const navigate = useNavigate();
  const adminName = "Admin"; // You can replace this with actual admin name from your auth system
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    navigate("/");
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.leftSection}>
        <button className={styles.menuToggle}>
          <FiMenu />
        </button>
        <h2>Admin Portal</h2>
      </div>
        <button className={styles.logoutButton} onClick={handleLogout}>
          <FiLogOut className={styles.logoutIcon} />
          Logout
        </button>

    </header>
  );
};

export default AdminTopBar;