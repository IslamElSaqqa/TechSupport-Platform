import React, { useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';
import { useWindowsErrorsContext } from '../../Hooks/windowsErrorsHooks/useWindowsErrorsContext';
import { useWindowsErrors } from '../../Hooks/windowsErrorsHooks/useWindowsError';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WindowsErrors2 = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const errorCode = queryParams.get("code");

  const { windowsErrors } = useWindowsErrorsContext();
  const { getWindowsError, isLoading, error } = useWindowsErrors();
  const [inputError, setInputError] = useState(errorCode)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchError = async () => {
      if (errorCode) {
        await getWindowsError(errorCode);
      }
      setLoading(false);
    };

    fetchError();
  }, [errorCode]);

  if (loading) return <p>Loading...</p>;

  // handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await getWindowsError(inputError);
    if (!success) {
      console.log("Failed to fetch error for code:", inputError);
    }
    setLoading(false);
  };

  // handle Yes button
  const handleYesButton = () => {
      // Show toast
    toast.success('Thanks for your feedback', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
    });
  }

  // handle No button
  const handleNoButton = () => {
    // Show toast
    toast.error("sorry, you can help you book an online service\n with a specialist", {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
  });
}
  return (
    <div className="content-container">
      <ToastContainer />
      <div className="search-container-error">
        <h1 className="DIVO-logo-error"><span className="orange-text">D</span>IVO</h1>
        {error && <div className="error">{ error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="search-box-container-error">
              <div className="search-input-error">
                <input
                  type="text"
                  value={inputError}
                  onChange={(e) => setInputError(e.target.value)}
                />
              </div>
            <button disabled={ isLoading } className="search-button">
                {isLoading ? "SEARCHING..." : "SEARCH"}
            </button>
          </div>
        </form>

        <div className="reactivation-container">
          <h1 className="title-error">"{windowsErrors?.error_code}" Error</h1>
          <h1 className="solution-title">Error Details:</h1>
          <p className="text-error">{windowsErrors?.description || "No description available."}</p>
          <h3 className="solution-title">Solution:</h3>
          <p className="text-error">{windowsErrors?.solution || "No solution provided."}</p>
          <p className="info-help">
            <b> If you need further assistance, please contact {" "}   <a href="https://support.microsoft.com/en-us/windows" target="_blank" className="MicrosoftSupp" rel="noopener noreferrer"> Microsoft Support</a> .</b>
          </p><br></br>
          <p className="info-help"><b>Was this information helpful?</b></p>
          <div className="button-group">
            <button disabled={isLoading}  onClick={ handleYesButton}  type="submit" className="Yes-error">Yes</button>
            <button disabled={ isLoading} onClick={ handleNoButton} type="button" className="No-error">No</button>
          </div>
        </div>
      </div>
    </div>
  );
}; 
export default WindowsErrors2;
