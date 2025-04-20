import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useSignup } from '../../Hooks/useSignUp';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = () => {
    // const phoneRegex = /^(010|011|012|015)\d{8}$/;
    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // defining register entries using useState
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [Email, setEmail] = useState('')
    const navigate = useNavigate(); 


        // Grab the signup hook props
        const { isLoading, error, signup} = useSignup()


    // HandleSubmit
    const handleSubmit = async (e) => {
        e.preventDefault()

        // calling signup function from the hook 
        const success = await signup(name, Email, password, phoneNumber)
        // console.log({ name: name, email: Email, phone: phoneNumber, password: password })
    
        // Implementing toast container for successfull snackbar status
        if (success) {
            toast.success('Account created successfully!', {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
            });
            // Redirect after a short delay
            setTimeout(() => {
                navigate('/home');
            }, 2500);
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
                <h1>Create an account</h1>
                <p>Enter your details below</p>
                </div>
                { /* Outputting Errors if exist*/}
                {error && <div className="error">{ error}</div>}
                
                <form onSubmit={handleSubmit}>
                <div className="input-group">
                        <input type="text"  placeholder="Name"
                            onChange={(e)=> setName(e.target.value)}
                            value={name}
                    
                    />
                </div>

                <div className="input-group">
                    <input
                            type="email" placeholder="Email"
                            value={Email}
                            onChange={(e)=> setEmail(e.target.value)}
                    />
                </div>

                <div className="input-group">
                    <input
                            type="text" placeholder="Phone number"
                            value={phoneNumber}
                            onChange={(e)=> setPhoneNumber(e.target.value)}
                    />
                </div>


                
                <div className="input-group">
                    <input
                            type="password" placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                    <button disabled={ isLoading} className="create-account-btn" href="/dashboard">
                    Create Account
                </button>

                <button type="button" className="google-signup-btn">
                    <img src="https://dashboard.codeparrot.ai/api/image/Z8YNMW9e-96e2cWq/icon-goo.png" alt="Google" />
                    <span>Sign up with Google</span>
                </button>

                <div className="login-prompt">
                    <span>Already have account?</span>
                    <NavLink to ={"/login"} className='login-link'>Log in</NavLink>
                </div>
            </form>
        </div>
        </div>
    );
};

export default SignUp;

