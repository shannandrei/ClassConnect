import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import './AimsModal.css';
import { useAuth } from '../context/AuthContext';



const AimsModal = ({ show, handleClose, onSuccess, setSchedule }) => {
  const BASE_URL = 'https://class-connect-server.onrender.com';
  // const BASE_URL = 'https://class-connect-server.vercel.app';
  // const BASE_URL = 'http://localhost:5000';
  const { currentUser } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [schoolYear, setSchoolYear] = useState('2324');
  const [semester, setSemester] = useState('A');

  const handleAuthentication = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const response = await axios.post(`${BASE_URL}/fetch-schedule`, {
        username,
        password,
        schoolYear,
        semester,
      });
      
      await axios.post(`${BASE_URL}/save-aims-data`, {
        uid: currentUser.uid,
        username,
        password,
        schoolYear,
        semester,
      });
      // Directly pass the schedule to onSuccess
      onSuccess(response.data);
      handleClose(); // Close the modal immediately after handling success

    } catch (error) {
      console.error('Error fetching/saving schedule:', error.response.data);
      if (error.response && error.response.status === 500 && error.response.data.error === 'Invalid credentials. Please try again.') {
        setError('Invalid credentials. Please try again.'); // Set error message for invalid credentials
      } else {
        setError('Failed to fetch schedule');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <Modal show={show} onHide={handleClose} className="am-modal">
        <Modal.Header className="am-modal-header">
          <Modal.Title className="am-modal-title">Aims Authentication</Modal.Title>
          <Button className="am-close-button" onClick={handleClose}>
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </Modal.Header>
        {error && <p className="am-error">{error}</p>}
        {loading && <p className="am-loading">Fetching your schedule...</p>}
        <Modal.Body className="am-modal-body">
          <Form onSubmit={handleAuthentication}>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label> <FontAwesomeIcon icon={faUser} className="am-icon" />
              <Row>

                
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="am-form-control"
                  />
                </Col>
                
              </Row>
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label> <FontAwesomeIcon icon={faLock} className="am-icon" />
              <Row>
                <Col>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="am-form-control"
                  />
                </Col>
              </Row>
            </Form.Group>
            <Form.Group controlId="schoolYear">
              <Form.Label>School Year</Form.Label>
              <Row>
                <Col>
                  <Form.Control
                    as="select"
                    value={schoolYear}
                    onChange={(e) => setSchoolYear(e.target.value)}
                    className="am-form-control"
                  >
                    <option value="2324">2324</option>
                    <option value="2223">2223</option>
                    <option value="2122">2122</option>
                    <option value="2021">2021</option>
                  </Form.Control>
                </Col>
              </Row>
            </Form.Group>
            <Form.Group controlId="semester">
              <Form.Label>Semester</Form.Label>
              <Row>
                <Col>
                  <Form.Control
                    as="select"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="am-form-control"
                  >
                    <option value="A">First</option>
                    <option value="B">Second</option>
                    <option value="D">Third</option>
                    <option value="C">Summer</option>
                  </Form.Control>
                </Col>
              </Row>
            </Form.Group>
            <p className="am-disclaimer">Disclaimer: We will not be storing your credentials. They will only be used for importing your class schedule.</p>
            <Button variant="primary" type="submit" className="am-button" disabled={loading}>
                {loading ? 'Loading...' : 'Authenticate'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AimsModal;
