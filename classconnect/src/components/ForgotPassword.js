import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import {useAuth} from "../context/AuthContext";

const ForgotPassword = () => {
    const navigate = useNavigate();

    const { currentUser, resetPassword } = useAuth();
    useEffect(() => {
        if (currentUser) {
            navigate('/');
        }
    }, []);

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [emailFocus, setEmailFocus] = useState(false);
    const [validEmail, setValidEmail] = useState(true);

    const [code, setCode] = useState('');
    const [codeFocus, setCodeFocus] = useState(false);
    const [validCode, setValidCode] = useState(true);
    const [codeSent, setCodeSent] = useState(false);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        

        if(!email) {
            setSuccess('');
            return setError('Please enter your email');
        }
        
        if (!email.endsWith('@cit.edu')) {
            setSuccess('');
            return setError('Please use a Microsoft account with the domain "@cit.edu"');
        }

        try{
            setError('');
            setLoading(true);
            
            await resetPassword(email);
            setSuccess('Check your inbox for further instructions');
        
        }catch (error) {
            setSuccess('');
            setError(error.message);
        }

    }

    return (
        <main className="fp-main">
            <div className="fp-box" style={{ height: success || error ? '320px' : '280px' }}>
                <div className="fp-inner-box">
                    <div className="fp-forms-wrap">
                        <form className="fp-form">
                            <div className="fp-header">
                               <h1>Forgot Password</h1>
                            </div>
                            <div className="fp-actual-form">
                                {error && (
                                    <div className="ls-error">
                                        <span>{error}</span>
                                    </div>
                                )}

                                {success && (
                                    <div className="ls-success">
                                        <span>{success}</span>
                                    </div>
                                )}
                                <div className="fp-input-wrap" style={{ marginTop: success || error ? '20px' : '30px' }}>
                                    <input
                                        type="text"
                                        id="email"
                                        required
                                        readOnly={codeSent}
                                        className={`fp-input-field ${emailFocus || email ? 'active' : ''}`}
                                        onChange={(e) => setEmail(e.target.value)}
                                        aria-invalid={validEmail ? "false" : "true"}
                                        aria-describedby="uidnote"
                                        onFocus={()=> setEmailFocus(true)}
                                        onBlur={()=> setEmailFocus(false)}
                                        
                                    />
                                    <label>Email</label>
                                </div>
                                {codeSent && (
                                    <div className="fp-input-wrap">
                                        <input
                                            type="text"
                                            id="code"
                                            required
                                            className={`fp-input-field ${codeFocus || code ? 'active' : ''}`}
                                            onChange={(e) => setCode(e.target.value)}
                                            aria-invalid={validEmail ? "false" : "true"}
                                            aria-describedby="uidnote"
                                            onFocus={()=> setCodeFocus(true)}
                                            onBlur={()=> setCodeFocus(false)}
                                            
                                        />
                                        <label>Code</label>
                                    </div>
                                )}
                                
                                <button onClick={handleForgotPassword} className="fp-btn">
                                    Reset Password
                                </button>
                            </div>
                            
                        
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default ForgotPassword;