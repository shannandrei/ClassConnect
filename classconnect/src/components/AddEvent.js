import React, { useState, useEffect } from "react";
import "./AddEvent.css";
import Navbar from "./Navbar";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import moment from "moment";
 
const yearLevels = ["1", "2", "3", "4", "5", "6", "All"];
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
 
const AddEvent = () => {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [targetYear, setTargetYear] = useState("");
  const [targetCourse, setTargetCourse] = useState("");
  const [selectedCollege, setSelectedCollege] = useState(Object.keys(Courses)[0]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const today = moment().format('YYYY-MM-DD');
  const BASE_URL = 'https://class-connect-server.onrender.com'
 
  useEffect(() => {
    if (currentUser.uid) {
      fetch(`${BASE_URL}/user-role/${currentUser.uid}`)
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Failed to fetch user role');
          }
        })
        .then(data => {
          if (data.role !== 'admin' && data.role !== 'organization') {
            navigate('/');
          }
        })
        .catch(error => console.error('Error fetching user role:', error));
    }
  }, [currentUser, navigate]);
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
 
    const eventDateTime = moment(`${date} ${startTime}`);
    const currentDateTime = moment();
    if (eventDateTime.isBefore(currentDateTime)) {
      setError('Event date and time must be in the future');
      setLoading(false);
      return;
    } else if (moment(`${date} ${endTime}`).isBefore(eventDateTime)) {
      setError('End time must be after start time');
      setLoading(false);
      return;
    }
 
    setError('');
 
    const eventData = {
      title,
      date,
      startTime,
      endTime,
      location,
      targetYear,
      targetCourse,
    };
 
    try {
      const docRef = await addDoc(collection(db, "events"), eventData);
      console.log("Document written with ID: ", docRef.id);
      setTitle("");
      setDate("");
      setStartTime("");
      setEndTime("");
      setLocation("");
      setTargetYear("");
      setTargetCourse("");
      setSuccess("Event added successfully");
    } catch (e) {
      console.error("Error adding document: ", e);
      setLoading(false);
    }
    setLoading(false);
  };
 
  return (
    <div>
      <Navbar />
      <div className="event-form">
        <h2 className="event-form-title">Add Event</h2>
        {error && (
          <div className="ls-error">
            <span>{error}</span>
          </div>
        )}
        {loading && (
          <div className="ls-loading">
            <span>Loading...</span>
          </div>
        )}
        {success && (
          <div className="ls-success">
            <span>{success}</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title:</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Date:</label>
            <input
              type="date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              min={today}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Start Time:</label>
            <input
              type="time"
              className="form-input"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">End Time:</label>
            <input
              type="time"
              className="form-input"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Location:</label>
            <input
              type="text"
              className="form-input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Target Participants:</label>
            <div className="dropdown-container">
              <select
                className="form-input"
                value={targetYear}
                onChange={(e) => setTargetYear(e.target.value)}
                required
              >
                <option value="">Select Year</option>
                {yearLevels.map((level, index) => (
                  <option key={index} value={level}>{level}</option>
                ))}
              </select>
              <select
                className="form-input"
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
                required
              >
                <option value="">Select College</option>
                {Object.keys(Courses).map((college, index) => (
                  <option key={index} value={college}>{college}</option>
                ))}
                <option value="All">All</option>
              </select>
              <select
                className="form-input"
                value={targetCourse}
                onChange={(e) => setTargetCourse(e.target.value)}
                required
              >
                <option value="">Select Course</option>
                {Courses[selectedCollege].map((course, index) => (
                  <option key={index} value={course}>{course}</option>
                ))}
                <option value="All">All</option>
              </select>
            </div>
          </div>
          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};
 
export default AddEvent;
 