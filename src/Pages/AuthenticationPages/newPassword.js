import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useResetPass } from '../../Hooks/useResetPass';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Newpassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('') 
  const [confPassword, setConfPassword] = useState('')
  const { error, isLoading, resetPassword } = useResetPass()
  
  const handleSubmit = async (e) => { 
    e.preventDefault()
    if (newPassword !== confPassword) {
      toast.error('Passwords do not match!');
      return;
    }
      const email = sessionStorage.getItem('email')
      const otp = sessionStorage.getItem('otp')
    
      const success = await resetPassword(email, otp, newPassword)
    if (success) {
      sessionStorage.removeItem('email')
      sessionStorage.removeItem('otp')
      navigate('/pass-changed')
    }
    else { 
      console.log('failed to reset password')
      // toast.error('Failed to reset password!')
      return;
    }
}

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
            <img src="https://dashboard.codeparrot.ai/api/image/Z8igv6wi-41-yX4Q/group.png" alt="Lock Icon" className="lock-icon" />
        </div>
        <form onSubmit={handleSubmit}>
            <div className="header-section">
            <h1>Enter Your New Password</h1>
            <p className="description">
                Create a new password for your account</p>
          </div>
          {error && <div className='error'>{ error}</div>}
            <div className="input-section">
            <div className="input-wrapper">
                <input
                type="password"
                placeholder="Password"
                value={newPassword}
                onChange={(e)=> setNewPassword(e.target.value)}
                />
                <img src="https://dashboard.codeparrot.ai/api/image/Z8il37wkNXOiaV8r/envelope.png" alt="password" className="email-icon" />
            </div>
            <div className="input-wrapper">
                <input
                type="password"
                placeholder="Confirm Password"
                value={confPassword}
                onChange={(e)=> setConfPassword(e.target.value)}
                />
                <img src="https://dashboard.codeparrot.ai/api/image/Z8il37wkNXOiaV8r/envelope.png" alt="password" className="email-icon" />
            </div>
            
            </div>
            <button disabled={isLoading} className="verify-button">
                {isLoading ? "Resetting new password ..." : "Submit"}
              
            </button>
          </form>
        </div>
        </div>
    );
};
export default Newpassword;