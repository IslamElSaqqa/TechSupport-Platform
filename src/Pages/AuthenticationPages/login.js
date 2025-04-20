import { React, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useLogin } from '../../Hooks/useLogin';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {

      // defining Login entries using useState
        const [password, setPassword] = useState('')

      // Check on the input type (Email or password)
        const [inputValue, setInputValue] = useState("");
        const [inputIdentifier, setInputIdentifier] = useState(""); 
        const navigate = useNavigate(); 


        const checkInputIdentifier = (value) => {
            const phoneRegex = /^(010|011|012|015)\d{8}$/;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (emailRegex.test(value)) return "email";
            if (phoneRegex.test(value)) return "phone";

        return "";
        };

      // handling changes based on the identifier
        const handleChanges = (e) => { 
            const value = e.target.value
            setInputValue(value)
            setInputIdentifier(checkInputIdentifier(value))
        }
        // Destructuring login func, error and isLoading States
        const { error, isLoading, login } = useLogin()
    
        // HandleSubmit
        const handleSubmit = async (e) => {
            e.preventDefault()
            // console.log(inputValue, password)
            const successLogin = await login(inputValue, password)

            // Implementing toast container for successfull snackbar status
            if (successLogin) {
                toast.success('Logged In successfully!', {
                        position: 'top-right',
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: true,
                });
                    // Redirect after a short delay
                setTimeout(() => {
                        navigate('/home');
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
            <h1>Log in to Exclusive</h1>
            <p>Enter your details below</p>
                </div>
                {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit} >
            
            <div className="input-group">
                <input
                        type="text" placeholder="Email or Phone Number"
                        value={inputValue}
                        onChange={handleChanges}
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
            
            <NavLink to ={"/trouble-login"} className="forgot-password"> Forget Password? </NavLink>

            <button type="button" className="google-signup-btn">
                <img src="https://dashboard.codeparrot.ai/api/image/Z8YNMW9e-96e2cWq/icon-goo.png" alt="Google" />
                <span>Sign up with Google</span>
            </button>

            <div className="signup-prompt">
            <span>Don't have an account?</span>
            <NavLink to ={"/signup"} className="signup-link">Sign Up</NavLink>
            
            </div>
            </form>
        </div>
        </div>
    );
};

export default Login;
