import React, { useState, useRef, useEffect } from 'react';
import './pop-up-post.css';
import { useLogout } from '../../../Hooks/useLogout';
import { useNavigate, Link } from 'react-router-dom'
import { useAuthContext } from '../../../Hooks/useAuthContext';

function PopUpPost() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user} = useAuthContext()

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const navigate = useNavigate()
  const { logout } = useLogout()
  const handleClick = () => {
              logout()
                // Redirect after a short delay
              setTimeout(() => {
                      navigate('/login');
                  }, 1000);
  }
  
  const handleSignup = () => { 
        
    navigate('/signup')
  }

  const handleLogin = () => { 
    navigate('/login')
  }

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <div className="profile-icon" onClick={toggleDropdown}>
      <img src="https://dashboard.codeparrot.ai/api/image/Z8YNMW9e-96e2cWq/user.png" alt="" />
      </div>
      
      {isOpen && (
  <div className="dropdown-menu">
    {user ? (
      <>
        <Link to="/profile-page" className="menu-item">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              fill="currentColor" className="menu-icon">
              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
          </svg>
          Manage My Account
        </Link>

        <button className="menu-item" onClick={handleClick}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              fill="currentColor" className="menu-icon">
            <path d="M16 17v-3H9v-4h7V7l5 5-5 5z" />
            <path d="M14 7v2H5v6h9v2l5-5-5-5z" fill="none" stroke="currentColor" strokeWidth="0" />
            <path d="M12 3c-4.418 0-8 3.582-8 8v7c0 1.657 1.343 3 3 3h5c1.657 0 3-1.343 3-3v-7h-2" />
          </svg>
          <span className="logout-keyword">Logout</span>
        </button>
      </>
    ) : (
      <>
        <button onClick={handleLogin} className="menu-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                  fill="currentColor" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"
                  className="menu-icon">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
          <span className="logout-keyword">Login</span>
        </button>

        <button onClick={handleSignup} className="menu-item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                fill="currentColor" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
                className="menu-icon">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
          <span className="logout-keyword">Sign up</span>
        </button>
      </>
    )}
  </div>
)}
    </div>
  );
}

export default PopUpPost;