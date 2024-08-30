import React, { useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import google_auth from '../assets/google_auth.svg';
import { useNavigate } from 'react-router-dom';
import { toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
    const containerRef = useRef(null);
    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = useState(false);

    const [username, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNum, setPhoneNum] = useState('');

    const signinSuccess = () => {
        toast.success('Successfully Signed In!', {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Zoom,
        });
    };

    const signinFailure = () => {
        toast.error('Failed to Sign In!', {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Zoom,
        });
    };

    const signupSuccess = () => {
        toast.success('Successfully Registered New User!', {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Zoom,
        });
    };

    const signupFailure = () => {
        toast.error('Failed to Register New User!', {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Zoom,
        });
    };

    const handleToggle = () => {
        containerRef.current.classList.toggle('active');
        setTimeout(() => {
            setIsSignUp(!isSignUp);
        }, 260);
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        // Implement sign-in logic here
        console.log("Sign In");

        // Simulate sign-in success and redirect
        signinSuccess();
        const queryParams = new URLSearchParams(window.location.search);
        const role = queryParams.get('role');
        if (role === 'employer') {
            navigate('/employer');
        } else if (role === 'freelancer') {
            navigate('/freelancer');
        } else {
            signinFailure();
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        // Implement sign-up logic here
        console.log("Sign Up");

        // Simulate sign-up success
        signupSuccess();
    };

    return (
        <div className="bg-primary flex items-center justify-center h-[75vh]">
            <Helmet>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
            </Helmet>
            <div className="hidden sm:block">
                <div className="bg-primary items-center justify-center container max-h-[70vh]" style={{ fontFamily: 'Montserrat' }} ref={containerRef}>
                    <div className={`mx-auto max-w-sm overflow-hidden rounded-md form-container ${isSignUp ? 'sign-up' : 'sign-in'}`}>
                        <form className="p-6 form" onSubmit={isSignUp ? handleSignUp : handleSignIn}>
                            <h1 className="text-3xl mb-6 heading" style={{ fontWeight: 700 }}>
                                {isSignUp ? 'Create Account' : 'Sign In'}
                            </h1>
                            <div className="mb-2 socialIcons">
                                <img src={google_auth} alt="Google" className="relative h-[94%] z-[5]" />
                            </div>
                            <span className="span mb-1">
                                {isSignUp ? 'or use your email for registration' : 'or use your email password'}
                            </span>
                            {isSignUp && (
                                <input
                                    type="text"
                                    placeholder="Name"
                                    id="username"
                                    className="input"
                                    value={username}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            )}
                            <input
                                type="email"
                                placeholder="Email"
                                id="email"
                                className="input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                id="password"
                                className="input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {isSignUp && (
                                <input
                                    type="number"
                                    placeholder="Phone Number"
                                    id="number"
                                    className="input"
                                    value={phoneNum}
                                    onChange={(e) => setPhoneNum(e.target.value)}
                                />
                            )}
                            {isSignUp ? (
                                <button className="button" type="submit" id="signup">Sign Up</button>
                            ) : (
                                <>
                                    <a href="#" className="text-xs text-gray-600 block mb-2 forgotPassword cursor-pointer">Forgot Your Password?</a>
                                    <button className="btn-primary signInButton" type="submit" id="signin">Sign In</button>
                                </>
                            )}
                        </form>
                    </div>
                    <div className="toggle-container w-1/2 h-full overflow-hidden bg-gradient-to-l from-primary to-transparent toggleContainer">
                        <div className="toggle h-full bg-gradient-to-r from-primary to-transparent text-white toggle">
                            <div className="toggle-panel toggle-right p-6 text-center togglePanel">
                                <h1 className="text-3xl font-semibold mb-4 toggleHeading" style={{ fontWeight: 700 }}>Hello, Friend!</h1>
                                <p className="text-sm mb-4 toggleText">Register with your personal details to use all site features</p>
                                <button className="button2" id="signuptemp" onClick={handleToggle}>Sign Up</button>
                            </div>
                            <div className="toggle-panel toggle-left p-6 text-center togglePanel">
                                <h1 className="text-3xl font-semibold mb-4 toggleHeading" style={{ fontWeight: 700 }}>Welcome Back!</h1>
                                <p className="text-sm mb-4 toggleText">Enter your personal details to use all site features</p>
                                <button className="button2" id="signintemp" onClick={handleToggle}>Sign In</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-primary min-h-screen flex items-center justify-center container2 max-w-[80%] xs:max-w-[50%] sm:hidden" style={{ fontFamily: 'Montserrat' }}>
                <div className={`mx-auto max-w-sm overflow-hidden rounded-md form-container ${isSignUp ? 'sign-up-mob' : 'sign-in-mob'}`}>
                    <form className="p-6 form flex flex-col items-center" onSubmit={isSignUp ? handleSignUp : handleSignIn}>
                        <h1 className="text-3xl mb-6 heading" style={{ fontWeight: 700 }}>
                            {isSignUp ? 'Sign Up' : 'Sign In'}
                        </h1>
                        <div className="mb-2 socialIcons">
                            <img src={google_auth} alt="Google" className="relative h-[94%] z-[5]" />
                        </div>
                        <span className="span mb-1">
                            {isSignUp ? 'or use your email for registration' : 'or use your email password'}
                        </span>
                        {isSignUp && (
                            <input
                                type="text"
                                placeholder="Name"
                                id="username_mob"
                                className="input z-10"
                                value={username}
                                onChange={(e) => setName(e.target.value)}
                            />
                        )}
                        <input
                            type="email"
                            placeholder="Email"
                            id="email_mob"
                            className="input z-10"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            id="password_mob"
                            className="input z-10"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {isSignUp && (
                            <>
                                <input
                                    type="number"
                                    placeholder="Phone Number"
                                    id="number_mob"
                                    className="input z-10"
                                    value={phoneNum}
                                    onChange={(e) => setPhoneNum(e.target.value)}
                                />
                            </>
                        )}
                        {isSignUp ? (
                            <button className="button" type="submit" id="signup_mob">Sign Up</button>
                        ) : (
                            <>
                                <a href="#" className="text-xs text-gray-600 block mb-2 forgotPassword cursor-pointer">Forgot Your Password?</a>
                                <button className="btn-primary signInButton" type="submit" id="signin_mob">Sign In</button>
                            </>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
