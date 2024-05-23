import React, { useState, useEffect } from 'react';
import './profilePage.css';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import { sendEmailVerification } from 'firebase/auth';
import { AppBar, Box, Button, Dialog, DialogContent, Toolbar, Typography } from '@mui/material';
import Navbar from './Navbar';
import AimsModal from './AimsModal';
import { upload } from '../config/firebase';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { FaCheck, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import ApplicationFormModal from "./ApplicationFormModal";
 
const ProfilePage = () => {
  const {
    currentUser,
    changeEmail,
    changePassword,
    changeProfileDisplayName,
    logout
  } = useAuth();
  const navigate = useNavigate();
  const BASE_URL = 'https://class-connect-server.onrender.com'
  // const BASE_URL = 'http://localhost:5000';
 
  const [email, setEmail] = useState(currentUser.email);
  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [pwd, setPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
 
  const [fileUploaded, setFileUploaded] = useState(false);
  const [previewURL, setPreviewURL] = useState(null);
  const [profilePicURL, setProfilePicURL] = useState('/assets/profile-picture.jpg');
  const [profilePic, setProfilePic] = useState(null);
 
  const [changesMade, setChangesMade] = useState(false);
 
  const [isModalOpen, setIsModalOpen] = useState(false);
 
  const [classSchedule, setClassSchedule] = useState('');
  const [course, setCourse] = useState('');
  const [dob, setDob] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [yearLevel, setYearLevel] = useState('');
 
  const [isEditing, setIsEditing] = useState(false);
 
  const [aimsSchedule, setAimsSchedule] = useState([{}]);
 
  const openAimsModal = () => {
    setIsModalOpen(true);
  };
 
  const closeAimsModal = () => {
    setIsModalOpen(false);
  };
 
  const handleSuccess = async (newSchedule) => {
    console.log('Aims Schedule:', newSchedule);
    try {
      const response = await axios.post(`${BASE_URL}/update-schedule`, {
        uid: currentUser.uid,
        newSchedule: newSchedule
      });
      console.log('response:', response.data);
      setSuccess(response.data);
      setAimsSchedule(newSchedule);  // Now updating the state here after confirming success
    } catch (error) {
      console.error("Error updating class schedule:", error);
      setError('Failed to update class schedule');
    }
  };
  useEffect(() => {
    if(currentUser.photoURL){
      setProfilePicURL(currentUser.photoURL);
    }
    console.log(currentUser.photoURL);
  }, [currentUser]);
 
  useEffect(() => {
    console.log('Aims Schedule:', aimsSchedule);
  }, [aimsSchedule]);
 
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setFullName(userData.fullname || '');
          setRole(userData.role || '');
          setYearLevel(userData.yearlvl || '');
          setClassSchedule(userData.class_schedule || '');
          setCourse(userData.course || '');
          setDob(userData.dob || '');
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
 
    fetchUserData();
  }, [currentUser.uid]);
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    if (!changesMade) {
      return setError('No changes have been made.');
    }
 
    setError('');
    setLoading(true);
 
    if (!passwordsMatch && (pwd !== '' || confirmPwd !== '')) {
      setLoading(false);
      return setError('Passwords do not match');
    }
 
    if (!email.endsWith('@cit.edu')) {
      setLoading(false);
      return setError('Please use a Microsoft account with the domain "@cit.edu"');
    }
 
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(pwd) && pwd !== '') {
      setLoading(false);
      return setError('Password must be at least 8 characters long and contain at least one uppercase letter and one digit');
    }
 
    const promises = [];
 
    if (email !== currentUser.email) {
      promises.push(changeEmail(email));
      await sendVerificationEmail(currentUser);
      setError('Please verify your new email address when logging in again.');
    }
 
    if (pwd) {
      promises.push(changePassword(pwd));
    }
 
    if (displayName !== currentUser.displayName) {
      promises.push(changeProfileDisplayName(displayName));
    }
 
    const userDocRef = doc(db, "users", currentUser.uid);
    promises.push(updateUserData(userDocRef, {
      class_schedule: classSchedule,
      course: course,
      dob: dob,
      fullname: fullName,
      role: role,
      yearlvl: yearLevel
    }));
 
    Promise.all(promises)
      .then(() => {
        setSuccess('Profile updated successfully');
        setIsEditing(false);
      })
      .catch(() => {
        setError('Failed to update profile');
      })
      .finally(() => {
        setLoading(false);
      });
 
    setPwd('');
    setConfirmPwd('');
    setChangesMade(false);
  };
 
  const updateUserData = async (docRef, newData) => {
    try {
      await updateDoc(docRef, newData);
    } catch (error) {
      console.error("Error updating user data:", error);
      throw error;
    }
  };  
 
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
 
  const handleUpload = async (e) => {
    e.preventDefault();
   
    const file = e.target.files[0];
    setFileUploaded(true);
    setPreviewURL(URL.createObjectURL(file));
    setProfilePic(file);
  }
 
  const handleSavePicture = async (e) => {
    upload(profilePic, currentUser, setLoading);
    setSuccess('Profile picture updated successfully');
    setFileUploaded(false);
    setPreviewURL(null);
    setProfilePic(null);
  }
 
  const handleInputChange = () => {
    setChangesMade(true);
 
    // Check if passwords match and update passwordsMatch state
    setPasswordsMatch(pwd === confirmPwd);
  };
 
  // Add useEffect for updating passwordsMatch
  useEffect(() => {
    setPasswordsMatch(pwd === confirmPwd);
  }, [pwd, confirmPwd]);
 
  //dob restriction
  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };
 
  const today = getTodayDate();
  const [DOB, setDOB] = useState('');
 
  //drop down menu for course and year:
  const yearLevels = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "6th Year"];
  const Courses = {
    "College of Engineering and Architecture": [
      "BSArch",
      "BSChE",
      "BSCE",
      "BSCpE",
      "BSEE",
      "BSECE",
      "BSIE",
      "BSME",
      "BSMinE"
    ],
    "College of Management, Business & Accountancy": [
      "BSAcc",
      "BSAIS",
      "BSMA",
      "BSBA",
      "BSHM",
      "BSTM",
      "BSOA",
      "AOA",
      "BPA"
    ],
    "College of Arts, Sciences, & Education": [
      "ABComm",
      "ABEnglish",
      "BEEd",
      "BSEd",
      "BMA",
      "BSBio",
      "BSMath",
      "BSPsych"
    ],
    "College of Nursing & Allied Health Sciences": [
      "BSN",
      "BSPharm"
    ],
    "College of Computer Studies": [
      "BSCS",
      "BSIT"
    ],
    "College of Criminal Justice": [
      "BSCrim"
    ]
  };
 
const [selectedCollege, setSelectedCollege] = useState(Object.keys(Courses)[0]);
 
 
  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
    setSuccess('');
    setError('');
  };
 
  const handleApplyClick = () => {
    setShowModal(true);
  };
 
  const handleCloseModal = () => {
    setShowModal(false);
 
  }
 
  useEffect(() => {
    if (success) {
      setError(null);
    }
  }, [success]);
 
  return (
    <div className="Background">
      <Navbar />
      <div className="profile-page">
        <div className="profile-card">
          <div className="profile-info">
            <div className="profile-photo-container">
              <img src={previewURL || profilePicURL} alt="Profile" className="profile-photo" />
              {!fileUploaded && (
                <>
                  <label htmlFor="file-upload" className="choose-file-btn">Change Profile Picture</label>
                  <input id="file-upload" type="file" accept="image/*" onChange={handleUpload} />
                </>
              )}
              {fileUploaded && (
                <button disabled={loading} onClick={handleSavePicture} className="choose-file-btn">Save</button>
              )}
            </div>
          </div>
          <div className="profile-header">
            <div className="profile-info">
              {success && (
                <div className="ls-success">
                  <span>{success}</span>
                </div>
              )}
              {error && (
                <div className="ls-error">
                  <span>{error}</span>
                </div>
              )}
              <div className="profile-field">
                <p className="profile-label">Email: </p>
                <p className="profile-value">{currentUser.email}</p>
              </div>
              <div className="profile-field">
                <p className="profile-label">Role:</p>
                <p className="profile-value">{role}</p>
              </div>
              <div className={isEditing ? "" : "profile-field"}>
                <p className="profile-label">Name:</p>
                {isEditing ? (
                  <input
                    type="text"
                    className="profile-input"
                    value={displayName}
                    onChange={(e) => {
                      setDisplayName(e.target.value);
                      handleInputChange();
                    }}
                  />
                ) : (
                  <p className="profile-value">{displayName}</p>
                )}
              </div>
             
              <div className={isEditing ? "" : "profile-field"}>
                <p className="profile-label">Full Name:</p>
                {isEditing ? (
                  <input
                    type="text"
                    className="profile-input"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      handleInputChange();
                    }}
                  />
                ) : (
                  <p className="profile-value">{fullName}</p>
                )}
              </div>
             
              <div className={isEditing ? "" : "profile-field"}>
                <p className="profile-label">Year Level:</p>
                {isEditing ? (
                  <select
                    className="profile-input"
                    value={yearLevel}
                    onChange={(e) => {
                      setYearLevel(e.target.value);
                      handleInputChange();
                    }}
                  >
                    {yearLevels.map((level, index) => (
                      <option key={index} value={level}>{level}</option>
                    ))}
                  </select>
                ) : (
                  <p className="profile-value">{yearLevel}</p>
                )}
              </div>
              {isEditing && (
                <div>
                  <div className={isEditing ? "" : "profile-field"}>
                    <p className="profile-label">College:</p>
                    <select
                      className="profile-input"
                      value={selectedCollege}
                      onChange={(e) => setSelectedCollege(e.target.value)}
                    >
                      {Object.keys(Courses).map((college, index) => (
                        <option key={index} value={college}>{college}</option>
                      ))}
                    </select>
                  </div>
                  <div className={isEditing ? "" : "profile-field"}>
                    <p className="profile-label">Course:</p>
                    <select
                      className="profile-input"
                      value={course}
                      onChange={(e) => {
                        setCourse(e.target.value);
                        handleInputChange();
                      }}
                    >
                      {Courses[selectedCollege].map((course, index) => (
                        <option key={index} value={course}>{course}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
              {!isEditing && (
                <div className={isEditing ? "" : "profile-field"}>
                  <p className="profile-label">Course:</p>
                  <p className="profile-value">{course}</p>
                </div>
              )}
            <div className={isEditing ? "" : "profile-field"}>
              <p className="profile-label">Date of Birth:</p>
              {isEditing ? (
                <input
                  type="date"
                  className="profile-input"
                  value={dob}
                  max={today}
                  onChange={(e) => {
                    setDob(e.target.value);
                    handleInputChange();
                  }}
                />
              ) : (
                <p className="profile-value">{dob}</p>
              )}
            </div>
             
              <div className={isEditing ? "" : "profile-field"}>
                <p className="profile-label">Password:</p>
                {isEditing ? (
                  <input
                    type="password"
                    className="profile-input"
                    value={pwd}
                    onChange={(e) => {
                      setPwd(e.target.value);
                      handleInputChange();
                    }}
                  />
                ) : (
                  <p className="profile-value">******</p>
                )}
              </div>
              <div className={isEditing ? "" : "profile-field"}>
                  <p className="profile-label">Confirm Password:</p>
                  {isEditing ? (
                      <div className="profile-input-wrap ls-profile-input-with-icon"> {/* Add ls-profile-input-with-icon class */}
                          <input
                              type="password"
                              className="profile-input"
                              value={confirmPwd}
                              onChange={(e) => {
                                  setConfirmPwd(e.target.value);
                                  handleInputChange();
                              }}
                          />
                          <div className="ls-password-icon-wrap">
                              {passwordsMatch ? (
                                  <FaCheck className="ls-password-match-icon" />
                              ) : (
                                  <FaTimes className="ls-password-not-match-icon" />
                              )}
                          </div>
                      </div>
                  ) : (
                      <p className="profile-value">******</p>
                  )}
              </div>
              {isEditing && (
                  <button onClick={handleSubmit} className="choose-file-btn">Save</button>
                )}
              <button onClick={openAimsModal} className="choose-file-btn" style={{ marginLeft: "20px" }}>Import Class Schedule</button>
              <button onClick={handleApplyClick} className="choose-file-btn" style={{ marginLeft: "20px" }}>Apply School Organization</button>
              <button onClick={toggleEditing} className="choose-file-btn" style={{ marginLeft: "174px" }}>
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
            {isModalOpen && (
              <AimsModal show={isModalOpen} handleClose={closeAimsModal} onSuccess={handleSuccess} setSchedule={setAimsSchedule}/>
            )}
            {showModal && (
              <ApplicationFormModal showModal={showModal} onClose={handleCloseModal} onSuccess={setSuccess} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default ProfilePage;