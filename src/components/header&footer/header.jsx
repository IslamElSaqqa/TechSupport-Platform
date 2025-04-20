import React from 'react';
import { useLogout } from '../../Hooks/useLogout';
import classNames from 'classnames';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'

const Header = () => {
    const navigate = useNavigate()
    const isActive = (path) =>{
        return window.location.pathname === path;
    };

    const { logout } = useLogout()
    const handleClick = () => {
                logout()
                toast.success('Logged out successfully!', {
                        position: 'top-right',
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                });
                    // Redirect after a short delay
                setTimeout(() => {
                        navigate('/login');
                    }, 2000);
            }


    return (
        <header className="header">
            <ToastContainer />
        <div className="header-container">
            
            <a href="/home" >
            <img 
            src="https://dashboard.codeparrot.ai/api/image/Z8YNMW9e-96e2cWq/logo-and.png" 
            alt="Logo" 
            className="logo"
            />
            </a>
            
            <nav className="nav-links">
            <a href="/home" className={classNames("nav-link", {'active': isActive("/home")})} >Home</a>
            <a href="/online-servicing" className={classNames("nav-link", {'active': isActive("/online-servicing")})}>Servicing</a>
            <a href="/store" className={classNames("nav-link", {'active': isActive("/store")})}>Store</a>
            <a href="/repair-shops" className={classNames("nav-link", {'active': isActive("/repair-shops")})}>Repair Shops</a>
            <a href="/windows-errors1" className={classNames("nav-link", {'active': isActive("/windows-errors1")})}>Windows Errors</a>
            </nav>

            <div className="right-section">
            <div className="search-container">
                <input
                type="text"
                placeholder="Search everywhere on the web"
                className="search-input"
                />
                <img 
                src="https://dashboard.codeparrot.ai/api/image/Z8YNMW9e-96e2cWq/componen.png" 
                alt="Search" 
                className="search-icon"
                />
            </div>

            <div className="user-icons">
                <a href='/community'>
                <img 
                src="https://dashboard.codeparrot.ai/api/image/Z8YNMW9e-96e2cWq/communit.png" 
                alt="Community" 
                className="icon"
                />
                </a>
                <a href="/profile-page">
                <img 
                    src="https://dashboard.codeparrot.ai/api/image/Z8YNMW9e-96e2cWq/user.png" 
                    alt="User" 
                    className="icon"
                />
                </a>
                <div>
                    <button onClick={ handleClick} className='logout-btn'>logout</button>    
                </div>        
            </div>
            </div>
        </div>
        </header>
    );
};

Header.defaultProps = {
    logoSrc: "https://dashboard.codeparrot.ai/api/image/Z8YNMW9e-96e2cWq/logo-and.png",
    navLinks: [
        { href: '/', label: 'Home' },
        { href: '/online-servicing', label: 'Servicing' },
        { href: '/store', label: 'Store' },
        { href: '/repair-shops', label: 'Repair Shops' },
        { href: '/windows-errors1', label: 'Windows Errors' }
        ],
    searchPlaceholder: "Search everywhere on the web",
    communityIconSrc: "https://dashboard.codeparrot.ai/api/image/Z8YNMW9e-96e2cWq/communit.png",
    userIconSrc: "https://dashboard.codeparrot.ai/api/image/Z8YNMW9e-96e2cWq/user.png"
};

export default Header;

