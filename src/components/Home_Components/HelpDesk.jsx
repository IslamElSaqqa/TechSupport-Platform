import { NavLink, useNavigate } from "react-router-dom";
import { React, useState } from "react";

const HelpDesk = () => {
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll up smoothly
    navigate("/online-servicing");
  };

  return (
    <div className="helpdesk-help-desk-container">
      <div className="helpdesk-content-wrapper">
        <div className="helpdesk-text-container">
          <div className="helpdesk-logo">Online Help Desk</div>
          <h1 className="helpdesk-title">
            Solve your issue online with out support team
          </h1>
          <button className="helpdesk-cta-button" onClick={handleSubmit}>
            Schedule you meeting
          </button>
        </div>

        <div className="helpdesk-image-container">
          <div className="helpdesk-image-circle"></div>
        </div>
      </div>
    </div>
  );
};

export default HelpDesk;
