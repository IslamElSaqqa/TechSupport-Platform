import React from 'react';
import { useNavigate } from "react-router-dom";

const PassChanged = () => {
    const navigate = useNavigate();

        const onHomeClick = () => {
        navigate("/login");
        };
    return (
        <div className="content-container">
        <div className="success-container">
        <div className="success-content">
            <div className="success-image">
            <img src="https://dashboard.codeparrot.ai/api/image/Z8itkawi-41-yX4R/success.png" alt="Success" width="200" height="200" />
            </div>
            <h1 className="success-title">Password changed successfully</h1>
            <button className="home-button" onClick={onHomeClick}>
            Go to Home Page
            </button>
        </div>
        <div className="dots-overlay"></div>
        </div>
        </div>
    );
};
export default PassChanged;