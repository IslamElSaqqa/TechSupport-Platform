import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTechnicianLogin } from '../../../Hooks/Technician/useTechnicianLogin';
import { useTechnicianContext } from '../../../Hooks/Technician/useTechnicianContext';
const TechnicianLogin = () => {
      // defining Technician Login entries using useState
        const [password, setPassword] = useState('')
        const [email, setEmail] = useState("");
    
        const navigate = useNavigate(); 


    // preventing multiple technician login
    useEffect(() => {
    const storedTechnician = sessionStorage.getItem('Technician');
    if (storedTechnician) {
        try {
        const parsedTech = JSON.parse(storedTechnician);
            if (parsedTech.token) {
                navigate('/tech', { replace: true });
            }
        } catch (err) {
        console.error('Error parsing technician data:', err);
        }
        sessionStorage.removeItem('Technician');
    }
    }, [navigate]);

    
    
    
        // Destructuring login func, error and isLoading States
        const { error, isLoading, technicianLogin} = useTechnicianLogin()
    
        // HandleSubmit
        const handleSubmit = async (e) => {
            e.preventDefault()
            
            const successLogin = await technicianLogin(email, password)

    
            if (successLogin) {
                toast.success(`Welcome ${email}`, {
                        position: 'top-right',
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                });
                setTimeout(() => {
                        navigate('/tech');
                    }, 2000);
            }
        };
    return (
        <div className="content-container">
            <ToastContainer />
        <div className="side-image">
            <img 
            src="https://dashboard.codeparrot.ai/api/image/Z8YNMW9e-96e2cWq/side-ima.png"
            alt="Repair Service" 
            className="repair-image"
            /> 
        </div>
        
        <div className="form-container">
            <div className="form-header">
            <div className="specialist-form-header">
                <h1 className='technician-title'>IT Technician</h1>            
            </div>
            <h1>Log in to Exclusive</h1>
            <p>Enter your details below</p>
                </div>
                {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit} >
            
            <div className="input-group">
                <input
                        type="text" placeholder="Email"
                        value={email}
                        onChange={(e)=> setEmail(e.target.value) }
                />
            </div>

            <div className="input-group">
                <input
                            type="password" placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value) }
                />
            </div>

                    <button disabled={ isLoading} className="create-account-btn">Log In</button>
            </form>
        </div>
        </div>
    );
};

export default TechnicianLogin;
