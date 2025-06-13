
import React, { useState } from 'react';
import styles from '../../styles/style.css'; 

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faBars, faTimes, faSliders } from '@fortawesome/free-solid-svg-icons';
// import { getUserProfile } from '../../api/userApi';
import logo from '../../assets/logos/kodvix-logo.png';


function Header({ onToggleSidebar }) {
  const [menuOpen, setMenuOpen] = useState(false);
  
  const toggleProfileMenu = () => {
    setMenuOpen(prev => !prev);
  };

//   useEffect(() => {
//     getUserProfile().then(res => {
//       setUser(res.data);
//       setLoading(false);
//     }).catch(err => {
//       console.error(err);
//       setLoading(false);
//     });
//   }, []);
  return (
    <div className="header">
      <div className="toggle-btn" onClick={onToggleSidebar}>
        <FontAwesomeIcon icon={faSliders} />
      </div>

      {/* <div className="inner-head-1 center-mobile-logo">
        <img src={logo} className="logo" alt="logo" />
      </div> */}
    <div className={styles.logo}>
        <img src={logo} alt="Kodvix Logo" />
      </div>
      {/* <div className={`inner-head-2 ${menuOpen ? 'show' : ''}`}>
        <FontAwesomeIcon icon={faBell} />
        <div className="profile">
          <img src="https://randomuser.me/api/portraits/men/10.jpg" alt="" />
          
          John Doe
        </div>
      </div> */}

      {/* <div className="toggle-btn" onClick={toggleProfileMenu}>
        <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
      </div> */}
    </div>
  );
}

export default Header;
