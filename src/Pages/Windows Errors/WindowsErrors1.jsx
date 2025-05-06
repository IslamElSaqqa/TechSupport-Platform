import React from 'react';
import { useNavigate } from "react-router-dom";


const WindowsErrors1 = () => {

  const navigate = useNavigate();



  const handleSearch = () => {
  
    navigate("/windows-errors-2");
  };

  return (
    <div className="content-container">
      <div className="search-container-error">
      <h1 className="DIVO-logo-error"><span className="orange-text">D</span>IVO</h1>
      <div className="search-box-container-error">
        <div className="search-input-error">
          <input 
            type="text" 
            placeholder="Code 22 , Code 23, etc"
          />
        </div>
        <button className="search-button" onClick={handleSearch}>
          SEARCH
        </button>
      </div>

      <div className="tabs-container">
        <div className="tabs">
          <span className="tab active">Popular</span>
          <span className="tab">Recent</span>
        </div>
        <div className="hot-tag">HOT</div>
      </div>

      <div className="cards-container">
        <div className="card">
          <h3>How to fix the blue screen of death error in windows 10</h3>
          <div className="image-container">
            <img src="https://dashboard.codeparrot.ai/api/image/Z9Criud_tb-16vJL/image-92.png" alt="Blue screen" />
          </div>
          <div className="card-footer">
            <img src="https://dashboard.codeparrot.ai/api/image/Z9Criud_tb-16vJL/group-3.png" alt="Group icon" />
          </div>
        </div>

        <div className="card">
          <h3>Error Messages in Windows 7</h3>
          <div className="image-container">
            <img src="https://dashboard.codeparrot.ai/api/image/Z9Criud_tb-16vJL/image-95.png" alt="Error message" />
          </div>
          <div className="card-footer">
            <img src="https://dashboard.codeparrot.ai/api/image/Z9Criud_tb-16vJL/group-3-2.png" alt="Group icon" />
          </div>
        </div>

        <div className="card">
          <h3>Windows XP error</h3>
          <div className="image-container">
            <img src="https://dashboard.codeparrot.ai/api/image/Z9Criud_tb-16vJL/image-94.png" alt="Windows XP error" />
          </div>
          <div className="card-footer">
            <img src="https://dashboard.codeparrot.ai/api/image/Z9Criud_tb-16vJL/group-3-3.png" alt="Group icon" />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default WindowsErrors1;

