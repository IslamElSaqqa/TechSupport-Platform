import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useForgotPass } from '../../Hooks/useForgotPass';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const TroubleLogin = () => {
        const [email, setEmail] = useState("");
        const navigate = useNavigate(); 

        // const checkEmailFormat = (value) => {
        //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        //     if (emailRegex.test(value))
        //         return "Invalid Email";            
        //     return "";
        // };
    
          // handling changes based on the identifier
        
        // Destructuring forgotPassword function, error and isLoading States
        const { error, isLoading, forgotPassword } = useForgotPass()

        // HandleSubmit
        const handleSubmit = async (e) => {
            e.preventDefault()
            console.log(email)
            const successForgotPassword = await forgotPassword(email)

            // Implementing toast container for successfull snackbar status
            if (successForgotPassword) {
                toast.success('OTP sent Successfully!', {
                        position: 'top-right',
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                });
                    // Redirect after a short delay
                setTimeout(() => {
                        navigate('/Forgetpass');
                    }, 2000);
            }
        };

        const handleCreateAccount = () => {
            console.log('Navigate back to login');
            navigate("/signup")
        };

        const handleBackToLogin = () => {
            console.log('Navigate back to login');
            navigate("/login")
        };
    return (
        <div className="content-container">
            <ToastContainer />
        <div className="side-image">
        <img 
            src="https://dashboard.codeparrot.ai/api/image/Z8dpFdMaYryy9hsO/frame-93.png" 
            alt="Repair Service" 
            className="repair-image"
                />
        </div>
        
        <div className="content-wrapper">
            <div className="icon-section">
                <img src="https://dashboard.codeparrot.ai/api/image/Z8YysMhTinWyM7HO/group.png" alt="Lock Icon" className="lock-icon" />
            </div>
            <div className="header-section">
                <h1>Trouble Logging in?</h1>
                <p className="description">
                    Enter your email or phone and we'll<br />
                    Send you an OTP number to get back into your account
                </p>
                </div>
                
                {error && <div className="error">{error}</div>}

            <form onSubmit={handleSubmit} >
                <div className="input-section">
                    <div className="input-wrapper">
                        <input
                            type="text"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e)=> setEmail(e.target.value)}
                        />
                        <img src="https://dashboard.codeparrot.ai/api/image/Z8YysMhTinWyM7HO/envelope.png" alt="Email" className="email-icon" />
                    </div>
                </div>
                    <button disabled={isLoading} className="verify-button">
                        {isLoading ? "Sending..." : "Send Verification Code"}
                    </button>
            </form>
                
            <div className="divider">
            <hr className="line" />
            </div>

            <button className="create-account-button" onClick={handleCreateAccount}>
            Create New Account
            </button>

            <div className="divider">
            <hr className="line-short" />
            </div>

            <button className="back-login-button" onClick={handleBackToLogin}>
            Back to Login
            </button>
            
        </div>
        </div>
    );
};

export default TroubleLogin;

