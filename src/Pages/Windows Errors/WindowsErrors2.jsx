import React from "react";

const WindowsErrors2 = () => {
  const handleSearch = () => {
    // Handle search functionality
    console.log("Searching...");
  };
  const error_code = "0xc004f211";
  const description =
    " Activation helps verify that your copy of Windows is genuine and hasnt been used on more devices than the Microsoft Software License Terms allow. When installing Windows 10, the digital license associates . If you make significant hardware changes on your device, such as replacing your motherboard, Windows will no longer find a license that matches your device, and youll need to reactivate Windows to get it up and running.";
  const solution =
    "To activate Windows, you'll need either a digital license or a product key. To find out which you need. Then, use the following info to help you successfully prepare for a hardware change and reactivate Windows 10.";

  return (
    <div className="content-container">
      <div className="search-container-error">
        <h1 className="DIVO-logo-error">
          <span className="orange-text">D</span>IVO
        </h1>
        <div className="search-box-container-error">
          <div className="search-input-error">
            <input type="text" placeholder="Code 22 , Code 23, etc" />
          </div>
          <button className="search-button" onClick={handleSearch}>
            SEARCH
          </button>
        </div>

        <div className="reactivation-container">
          <h1 className="title-error">
            " <span className="orange-text">{error_code} </span>" Error{" "}
          </h1>
          <h1 className="solution-title">Error Description: </h1>
          <p className="text-error"> {description} </p>

          <h3 className="solution-title">Solution:</h3>
          <p className="text-error">
            {solution}
            {/* */}
          </p>
          <p className="info-help">
            <b> If you need further assistance, please contact {" "}   <a href="https://support.microsoft.com/en-us/windows" target="_blank" className="MicrosoftSupp" rel="noopener noreferrer"> Microsoft Support</a> .</b>
          </p><br></br>
          
          <p className="info-help">
            <b>Was this information helpful ?</b>
          </p>
          <div className="button-group">
            <button type="submit" className="Yes-error">
              Yes
            </button>
            <button type="button" className="No-error">
              No{" "}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WindowsErrors2;
