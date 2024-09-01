import React, { useRef, useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import google_auth from '../assets/google_auth.svg';
import google_auth2 from '../assets/google_auth2.svg';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from '../LoginPage.module.css';

const LoginPage = () => {
    const containerRef = useRef(null);
    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const [username, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [phone_num, setPhoneNum] = useState();

    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
    };

    const query = useQuery();
    const role = query.get('role');

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
        setIsActive(prevState => !prevState);
        setTimeout(() => {
            setIsSignUp(!isSignUp);
        }, 260);
    };

    const handleSignUp = async (event) => {
        event.preventDefault();
        try {
            console.log("SignUp");
        } catch (error) {
            console.error('Error during registration:', error);
        }
    };

    const handleSignIn = async (event) => {
        event.preventDefault();
        try {
            console.log("Login");
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (
            <div className="bg-zinc-900 flex items-center justify-center min-h-screen">
                <HelmetProvider>
                    <Helmet>
                        <link rel="preconnect" href="https://fonts.googleapis.com" />
                        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
                    </Helmet>
                </HelmetProvider>
                <div className={`hidden sm:block`}>
                    <div className={`bg-primary items-center justify-center ${styles.container} max-h-[60vh]`} style={{ fontFamily: 'Montserrat' }} ref={containerRef}>
                        <div className={`mx-auto max-w-sm overflow-hidden rounded-md ${styles.formContainer} ${isSignUp ? styles.signup : styles.signin} ${isSignUp && isActive ? styles.activesignup : ''}  ${!isSignUp && isActive ? styles.activesignin : ''}`} >
                            <form className={`p-6 text-black ${styles.containerform}`}>
                                <h1 className={`text-3xl heading text-gray-600`} style={{ fontWeight: 700 }}>{isSignUp ? 'Create Account' : 'Sign In'}</h1>
                                <div className={`mb-2 ${styles.socialIcons}`}>
                                    <img src={role === 'freelancer' ? google_auth2 : google_auth} alt="Google" className="relative h-[94%] z-[5]" />
                                </div>
                                <span className={`${styles.containerspan} mb-1 text-gray-600`}>{isSignUp ? 'or use your email for registration' : 'or use your email password'}</span>
                                {isSignUp && <input type="text" placeholder="Name" id="username" className={`${styles.containerinput}`} onChange={(e) => setName(e.target.value)} />}
                                <input type="email" placeholder="Email" id="email" className={`${styles.containerinput}`} onChange={(e) => setEmail(e.target.value)} />
                                <input type="password" placeholder="Password" id="password" className={`${styles.containerinput}`} onChange={(e) => setPassword(e.target.value)} />
                                {isSignUp && <input type="number" placeholder="Phone Number" id="number" className={`${styles.containerinput}`} onChange={(e) => setPhoneNum(e.target.value)} />}
                                {isSignUp && <button className={`${styles.containerbutton} ${role === 'freelancer' ? 'bg-[#c52cef]' : 'bg-[#512da8]'}`} type="submit" id="signup" onClick={handleSignUp}>Sign Up</button>}
                                {!isSignUp && (
                                    <>
                                        <a href="#" className={`text-xs text-gray-600 block mb-2 forgotPassword cursor-pointer`}>Forgot Your Password?</a>
                                        <button className={`${styles.containerbutton} ${role === 'freelancer' ? 'bg-[#c52cef]' : 'bg-[#512da8]'}`} type="submit" id="signin" onClick={handleSignIn}>Sign In</button>
                                    </>
                                )}
                            </form>
                        </div>
                        <div className={`${styles.togglecontainer} w-1/2 h-full overflow-hidden bg-gradient-to-l from-primary to-transparent ${isActive ? styles.activetogglecontainer : ''}`}>
                            <div className={`h-full bg-gradient-to-r from-primary to-transparent text-white ${role === 'freelancer' ? 'bg-[#c52cef]' : 'bg-[#512da8]'} styles.toggle ${isActive ? styles.activetoggle : ''}`}>
                                <div className={`${styles.togglepanel} ${styles.toggleright} min-w-80 -mr-[8rem] p-6 text-center ${isActive ? styles.activetoggleright : ''}`}>
                                    <h1 className={`text-3xl font-semibold mb-4 toggleHeading`} style={{ fontWeight: 700 }}>Hello, Friend!</h1>
                                    <p className={`text-sm mb-4 toggleText`}>Register with your personal details to use all site features</p>
                                    <button className={`${styles.button2}`} id="signuptemp" onClick={handleToggle}>Sign Up</button>
                                </div>
                                <div className={`${styles.togglepanel} ${styles.toggleleft} min-w-80 -ml-[8rem] p-6 text-center togglePanel ${isActive ? styles.activetoggleleft : ''}`}>
                                    <h1 className={`text-3xl font-semibold mb-4 toggleHeading`} style={{ fontWeight: 700 }}>Welcome Back!</h1>
                                    <p className={`text-sm mb-4 toggleText`}>Enter your personal details to use all site features</p>
                                    <button className={`${styles.button2}`} id="signintemp" onClick={handleToggle}>Sign In</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`bg-primary min-h-screen flex items-center justify-center container2 max-w-[80%] xs:max-w-[50%] sm:hidden`} style={{ fontFamily: 'Montserrat' }}>
                    <div className={`mx-auto max-w-sm overflow-hidden rounded-md form-container ${isSignUp ? 'sign-up-mob' : 'sign-in-mob'}`} >
                        <form className={`p-6 form flex flex-col items-center`}>
                            <h1 className={`text-3xl mb-5 mt-3 heading`} style={{ fontWeight: 700 }}>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
                            <div className={`mb-2 socialIcons`}>
                                <img src={google_auth} alt="Google" className="relative h-[94%] z-[5]" />
                            </div>
                            <span className={`span mb-1`}>{isSignUp ? 'or use your email for registration' : 'or use your email password'}</span>
                            {isSignUp && <input type="text" placeholder="Name" id="username_mob" className={`input z-10`} onChange={(e) => setName(e.target.value)} />}
                            <input type="email" placeholder="Email" id="email_mob" className={`input z-10`} onChange={(e) => setEmail(e.target.value)} />
                            <input type="password" placeholder="Password" id="password_mob" className={`input z-10`} onChange={(e) => setPassword(e.target.value)} />
                            {isSignUp && (
                                <>
                                    <input type="number" placeholder="Phone Number" id="number_mob" className={`input z-10`} onChange={(e) => setPhoneNum(e.target.value)} />
                                    <button className={`btn-primary signInButton z-10`} type="submit" id="signup_mob" onClick={handleSignUp}>Sign Up</button>
                                    <a href="#" className={`text-xs text-gray-600 block mb-2 forgotPassword`} onClick={handleToggle}>Already having Account? Sign In</a>
                                </>
                            )}
                            {!isSignUp && (
                                <>
                                    <a href="#" className={`text-xs text-gray-600 block mb-2 z-10 forgotPassword`}>Forgot Your Password?</a>
                                    <button className={`btn-primary signInButton z-10`} type="submit" id="signin_mob" onClick={handleSignIn}>Sign In</button>
                                    <a href="#" className={`text-xs text-gray-600 block z-10 mb-2 forgotPassword`} onClick={handleToggle}>Not having Account? Sign Up</a>
                                </>
                            )}
                        </form>
                    </div>
                </div>
                <div className={`absolute z-[0] w-[70%] h-[40%] right-20 bottom-40 ${styles.white__gradient}`} />
            </div>
    );
};

export default LoginPage;
