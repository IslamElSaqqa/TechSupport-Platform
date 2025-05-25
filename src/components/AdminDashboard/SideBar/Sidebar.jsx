import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';

const Sidebar = ({ className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const activePath = location.pathname; // Get the current path

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className={`${styles.sidebar} ${className}`}>
      <div className={styles.header}>
        <img src="https://dashboard.codeparrot.ai/api/image/Z9EZLCppvFKitT90/logo.png" alt="Logo" className={styles.logo} />
      </div>
      
      <nav className={styles.navbar}>
        <div className={styles.wrapper}>
          <div
            className={`${styles.navItem} ${location.pathname === '/dashboard' ? styles.active : ''}`}
            onClick={() => handleNavigation('/dashboard')}
          >
            <img src="https://dashboard.codeparrot.ai/api/image/Z9EZLCppvFKitT90/home.png" alt="Dashboard" className={styles.icon} />
            <span>Dashboard</span>
          </div>
        </div>

        <div className={styles.settingsWrapper}>
          <div className={styles.navList}>
            <div
              className={`${styles.navItem} ${location.pathname === '/servicing' ? styles.active : ''}`}
              onClick={() => handleNavigation('/servicing')}
            >
              <img src="https://dashboard.codeparrot.ai/api/image/Z9EZLCppvFKitT90/mask-gro.png" alt="Servicing" className={styles.icon} />
              <span>Servicing requests</span>
            </div>
            
            <div
              className={`${styles.navItem} ${location.pathname === '/accounting' ? styles.active : ''}`}
              onClick={() => handleNavigation('/accounting')}
            >
              <img src="https://dashboard.codeparrot.ai/api/image/Z9EZLCppvFKitT90/group-10.png" alt="Accounting" className={styles.icon} />
              <span>All Technicians</span>
            </div>
            
            <div
              className={`${styles.navItem} ${location.pathname === '/users' ? styles.active : ''}`}
              onClick={() => handleNavigation('/users')}
            >
              <img src="https://dashboard.codeparrot.ai/api/image/Z9EZLCppvFKitT90/group-10-2.png" alt="Users" className={styles.icon} />
              <span>Users</span>
            </div>
            
            <div
              className={`${styles.navItem} ${location.pathname === '/admin-repairshops' ? styles.active : ''}`}
              onClick={() => handleNavigation('/admin-repairshops')}
            >
              <img src="https://dashboard.codeparrot.ai/api/image/Z9EZLCppvFKitT90/frame-10.png" alt="Repair" className={styles.icon} />
              <span>Repair Shops</span>
            </div>
            
            <div
              className={`${styles.navItem} ${location.pathname === '/winerrors' ? styles.active : ''}`}
              onClick={() => handleNavigation('/winerrors')}
            >
              <img src="https://dashboard.codeparrot.ai/api/image/Z9EZLCppvFKitT90/frame-10-2.png" alt="Errors" className={styles.icon} />
              <span>Win errors</span>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
