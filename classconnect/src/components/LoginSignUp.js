import React, { useState } from "react";
import "./LoginSignUp.css";
import { useEffect } from "react";
import { signOut, sendEmailVerification } from "firebase/auth";
import { auth } from "../config/firebase";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheck, FaTimes } from 'react-icons/fa';

const LoginSignUp = () => {

    const {signup, login} = useAuth();
    const [currentUser, setCurrentUser] = useState(null);
    const user = currentUser;    
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoginFormVisible, setIsLoginFormVisible] = useState(location.pathname === '/login');

    useEffect(() => {
        setIsLoginFormVisible(location.pathname === '/login');
        if (location.pathname !== '/login' && location.pathname !== '/signup') {
            navigate('/signup');
        }

        if (currentUser) {
            navigate('/');
        }
    }, [location.pathname, currentUser, navigate]);

    const [activeBulletIndex, setActiveBulletIndex] = useState(0);

    const [loginEmail, setLoginEmail] = useState('');
    const [validLoginEmail] = useState(true);
    const [loginEmailFocus, setLoginEmailFocus] = useState(false);

    const [loginPwd, setLoginPwd] = useState('');
    const [validLoginPwd] = useState(true);
    const [loginPwdFocus, setLoginPwdFocus] = useState(false);

    const [regisEmail, setRegisEmail] = useState('');
    const [validRegisEmail] = useState(true);
    const [regisEmailFocus, setRegisEmailFocus] = useState(false);

    const [regisFirstname, setRegisFirstname] = useState('');
    const [validRegisFirstname] = useState(true);
    const [regisFirstnameFocus, setRegisFirstnameFocus] = useState(false);

    const [regisLastname, setRegisLastname] = useState('');
    const [validRegisLastname] = useState(true);
    const [regisLastnameFocus, setRegisLastnameFocus] = useState(false);

    const [regisPwd, setRegisPwd] = useState('');
    const [validRegisPwd] = useState(true);
    const [regisPwdFocus, setRegisPwdFocus] = useState(false);

    const [regisConfirmPwd, setRegisConfirmPwd] = useState('');
    const [validRegisConfirmPwd] = useState(true);
    const [regisConfirmPwdFocus, setRegisConfirmPwdFocus] = useState(false);

    const [passwordsMatch, setPasswordsMatch] = useState(true); // State to track if passwords match, default to true
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);


    const toggleForm = () => {
        setIsLoginFormVisible(!isLoginFormVisible);
        setError('');
    };

    const handleBulletClick = (index) => {
        setActiveBulletIndex(index);
    };

    async function handleRegisSubmit(e) {
        e.preventDefault();
        setError('');

        if(regisConfirmPwd !== regisPwd) {
            return setError('Passwords do not match');
        }

        if(!regisEmail || !regisFirstname || !regisLastname || !regisPwd || !regisConfirmPwd) {
            return setError('Please fill in all fields');
        }
        
        if (!regisEmail.endsWith('@cit.edu')) {
            return setError('Please use a Microsoft account with the domain "@cit.edu"');
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(regisPwd)) {
            return setError('Password must be at least 8 characters long and contain at least one uppercase letter and one digit');
        }

        try{
            setLoading(true);
            
            await signup(regisEmail, regisPwd, regisFirstname, regisLastname);

            const user = auth.currentUser;
            console.log("user:",user);
            await sendVerificationEmail(user);
            signOut(auth);
            toggleForm();

        }catch (e) {
            setSuccess('');
            setError(e.message);
        }
        setLoading(false);
    }
    async function sendVerificationEmail(user) {
        try {
            if (user) {
                await sendEmailVerification(user);
                setSuccess('Please check your email for a verification link to activate your account.');
                console.log("Verification email sent successfully.");
            }
        } catch (error) {
            setSuccess('');
            console.error("Error sending verification email:", error);
            throw error;
        }
    }

    async function handleLoginSubmit(e) {
        e.preventDefault();
        setError('');

    if (!loginPwd || !loginEmail) {
      setSuccess("");
      return setError("Please fill in all fields");
    }

    if (!loginEmail.endsWith("@cit.edu")) {
      setSuccess("");
      return setError(
        'Please use a Microsoft account with the domain "@cit.edu"'
      );
    }

    try {
      setLoading(true);

      await login(loginEmail, loginPwd);
      navigate("/");
    } catch (e) {
      console.log("Error:", e);
      setSuccess("");

      if (e.message === "Please verify your email before logging in.") {
        setError("Please verify your email before logging in.");
      } else {
        setError("Invalid email or password");
      }
    }
    setLoading(false);
  };

  const handleForgotPass = () => {
    navigate("/forgot-password");
  };

  // Function to handle changes in confirm password field
  const handleRegisConfirmPwdChange = (e) => {
    setRegisConfirmPwd(e.target.value); // Update confirm password state
    setPasswordsMatch(e.target.value === regisPwd); // Check if confirm password matches password and update state accordingly
  };

  return (
    <main className={`ls-main ${isLoginFormVisible ? "" : "ls-sign-up-mode"}`}>
      <div className="ls-box">
        <div className="ls-inner-box">
          <div className="ls-forms-wrap">
            <form autoComplete="off" className="ls-form ls-sign-in-form">
              <div className="ls-logo">
                <img src="/assets/logo.png" alt="Campus Eats" />
                <span className="ls-logo-title-campus">Class</span>
                <span className="ls-logo-title-eats">Connect</span>
              </div>

                        <div className="ls-heading">
                            <h2>Welcome Back</h2>
                            
                                <h6>Not registered yet?</h6>
                                <span className="ls-text-link" onClick={toggleForm} >&nbsp;Sign up</span>
                            
                        </div>

                        {loading && (
                            <div className="ls-loading">
                                <span>Loading...</span>
                            </div>
                        )}

                        {!loading && error && (
                            <div className="ls-error">
                                <span>{error}</span>
                            </div>
                        )}

                        {!loading && success && (
                            <div className="ls-success">
                                <span>{success}</span>
                            </div>
                        )}

                        <div className="ls-actual-form">
                            <div className="ls-login-input-wrap">
                                <input
                                    type="text"
                                    id="username"
                                    required
                                    className={`ls-login-input-field ${loginEmailFocus || loginEmail ? 'active' : ''}`}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                    aria-invalid={validLoginEmail ? "false" : "true"}
                                    aria-describedby="uidnote"
                                    onFocus={()=> setLoginEmailFocus(true)}
                                    onBlur={()=> setLoginEmailFocus(false)}
                                    
                                />
                                <label>Email</label>
                            </div>
                            <div className="ls-login-input-wrap">
                                <input
                                    type="password"
                                    id="login-pwd"
                                    required
                                    className={`ls-login-input-field ${loginPwdFocus || loginPwd ? 'active' : ''}`}
                                    onChange={(e) => setLoginPwd(e.target.value)}
                                    aria-invalid={validLoginPwd ? "false" : "true"}
                                    aria-describedby="uidnote"
                                    onFocus={()=> setLoginPwdFocus(true)}
                                    onBlur={()=> setLoginPwdFocus(false)}
                                />
                                <label>Password</label>
                            </div>

                            <button disabled={loading} onClick={handleLoginSubmit} className="ls-sign-btn">Sign In</button>
                            
                            <span onClick={handleForgotPass} className="ls-subtext-link">Forgot Password?</span>
                        </div>

                    </form>

                    <form autoComplete="off" className="ls-form ls-sign-up-form">
                        <div className="ls-logo">
                            <img src="/assets/logo.png" alt="Campus Eats"/>
                            <span className="ls-logo-title-campus">Class</span>
                            <span className="ls-logo-title-eats">Connect</span>
                        </div>

                        <div className="ls-heading">
                            <h2>Get Started</h2>
                            
                                <h6>Already have an account?</h6>
                                <span className="ls-text-link" onClick={toggleForm}>&nbsp;Sign in</span>
                            
                        </div>

                        {loading && (
                            <div className="ls-loading">
                                <span>Loading...</span>
                            </div>
                        )}

                        {!loading && error && (
                            <div className="ls-error">
                                <span>{error}</span>
                            </div>
                        )}

                        {!loading && success && (
                            <div className="ls-success">
                                <span>{success}</span>
                            </div>
                        )}

                        <div className="ls-regis-actual-form">
                            <div className="ls-regis-input-wrap">
                                <input
                                    type="text"
                                    id="email"
                                    required
                                    className={`ls-regis-input-field ${regisEmailFocus || regisEmail ? 'active' : ''}`}
                                    onChange={(e) => setRegisEmail(e.target.value)}
                                    aria-invalid={validRegisEmail ? "false" : "true"}
                                    aria-describedby="uidnote"
                                    onFocus={()=> setRegisEmailFocus(true)}
                                    onBlur={()=> setRegisEmailFocus(false)}
                                    
                                />
                                <label>Email</label>
                            </div>
                            <div className="ls-regis-fullname-wrap">
                                <div className="ls-regis-fullname-input-wrap">
                                    <input
                                        type="text"
                                        id="firstname"
                                        required
                                        className={`ls-regis-fullname-input-field ${regisFirstnameFocus || regisFirstname ? 'active' : ''}`}
                                        onChange={(e) => setRegisFirstname(e.target.value)}
                                        aria-invalid={validRegisFirstname ? "false" : "true"}
                                        aria-describedby="uidnote"
                                        onFocus={()=> setRegisFirstnameFocus(true)}
                                        onBlur={()=> setRegisFirstnameFocus(false)}
                                        
                                    />
                                    <label>First Name</label>
                                </div>
                                <div className="ls-regis-fullname-input-wrap">
                                    <input
                                        type="text"
                                        id="lastname"
                                        required
                                        className={`ls-regis-fullname-input-field ${regisLastnameFocus || regisLastname ? 'active' : ''}`}
                                        onChange={(e) => setRegisLastname(e.target.value)}
                                        aria-invalid={validRegisLastname ? "false" : "true"}
                                        aria-describedby="uidnote"
                                        onFocus={()=> setRegisLastnameFocus(true)}
                                        onBlur={()=> setRegisLastnameFocus(false)}
                                        
                                    />
                                    <label>Last Name</label>
                                </div>
                            </div>

                            <div className="ls-regis-input-wrap">
                                <input
                                    type="password"
                                    id="regis-pwd"
                                    required
                                    className={`ls-regis-input-field ${regisPwdFocus || regisPwd ? 'active' : ''}`}
                                    onChange={(e) => setRegisPwd(e.target.value)}
                                    aria-invalid={validRegisPwd ? "false" : "true"}
                                    aria-describedby="uidnote"
                                    onFocus={()=> setRegisPwdFocus(true)}
                                    onBlur={()=> setRegisPwdFocus(false)}
                                />
                                <label>Password</label>
                            </div>

                            <div className="ls-regis-input-wrap">
                                <input
                                    type="password"
                                    id="confirmPwd"
                                    required
                                    className={`ls-regis-input-field ${regisConfirmPwdFocus || regisConfirmPwd ? 'active' : ''}`}
                                    onChange={handleRegisConfirmPwdChange} // Use the new function to handle confirm password change
                                    aria-invalid={validRegisConfirmPwd ? "false" : "true"}
                                    aria-describedby="uidnote"
                                    onFocus={()=> setRegisConfirmPwdFocus(true)}
                                    onBlur={()=> setRegisConfirmPwdFocus(false)}
                                />
                                <label>Confirm Password</label>
                            </div>
                            <div className="ls-password-icon-wrap">
                                    {passwordsMatch ? ( // Display icon based on whether passwords match
                                        <FaCheck className="ls-password-match-icon" />
                                    ) : (
                                        <FaTimes className="ls-password-not-match-icon" />
                                    )}
                                </div>

                            <button disabled={loading} onClick={handleRegisSubmit} className="ls-sign-btn">Create Account</button>
                            
                        </div>

                    </form>
                    
                </div>
                <div className="ls-carousel">
                    <div className="ls-images-wrapper">
                        <img src="/assets/3.png" className={`ls-img ls-img1 ${activeBulletIndex === 0 ? 'ls-show' : ''}`} alt="slider 1"/>
                        <img src="/assets/2.png" className={`ls-img ls-img2 ${activeBulletIndex === 1 ? 'ls-show' : ''}`} alt="slider 2"/>
                        <img src="/assets/1.png" className={`ls-img ls-img3 ${activeBulletIndex === 2 ? 'ls-show' : ''}`} alt="slider 3"/>
                    </div>
                    <div className="ls-text-slider">
                        <div className="ls-text-wrap">
                            <div className="ls-text-group" style={{ transform: `translateY(${activeBulletIndex * -2.2}rem)` }}>
                                <h2>Ditch the app juggle</h2>
                                <h2>Don't miss out on events</h2>
                                <h2>Plan and get ahead</h2>
                            </div>
                            
                        </div>
                        <div className="ls-bullets">
                            <span
                                className={activeBulletIndex === 0 ? "ls-bullet-active" : ""}
                                onClick={() => handleBulletClick(0)}
                            ></span>
                            <span
                                className={activeBulletIndex === 1 ? "ls-bullet-active" : ""}
                                onClick={() => handleBulletClick(1)}
                            ></span>
                            <span
                                className={activeBulletIndex === 2 ? "ls-bullet-active" : ""}
                                onClick={() => handleBulletClick(2)}
                            ></span>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
  );
};

export default LoginSignUp;
