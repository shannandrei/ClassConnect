import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes} from '@fortawesome/free-solid-svg-icons';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import "./ConfirmationModal.css";
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Navigate } from "react-router-dom";

const AimsPasswordModal = ({ showModal, onClose, onSuccess, aimsData}) => {
  
  const { currentUser } = useAuth();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State variables for form fields
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    onSuccess(null);
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/fetch-schedule', {
        username: aimsData.username,
        password,
        schoolYear: aimsData.schoolYear,
        semester: aimsData.semester,
      });
      // Directly pass the schedule to onSuccess
      const response1 = await axios.post('/update-schedule', {
        uid: currentUser.uid,
        newSchedule: response.data,
      });
      onClose();
    } catch (error) {
      console.error('Error fetching schedule:', error.response.data);
      setError("Invalid password. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="modal-overlay">
      <Modal show={showModal} onHide={onClose} className="cm-modal">
        <Modal.Header className="cm-modal-header">
          <Modal.Title className="cm-modal-title">Aims Authentication Expired</Modal.Title>
          <Button className="cm-close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </Modal.Header>
        
        {/* {error && <p className="cm-error">{error}</p>}
        {loading && <p className="cm-loading">Fetching your schedule...</p>} */}
        <Modal.Body className="cm-modal-body">
        
        <p className="am-disclaimer">Disclaimer: We will not be storing your credentials. They will only be used for importing your class schedule.</p>
              {error && (
                <div className="ls-error">
                  <span>{error}</span>
                </div>
              )}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
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
                <div className="cm-btn">
                <Button onClick={onClose} className="cm-button" disabled={loading}>
                    Cancel
                </Button>
                <Button variant="primary" type="submit" className="cm-button-1" disabled={loading}>
                    {loading ? 'Loading...' : 'Submit'}
                </Button>
                </div>
            
            </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AimsPasswordModal;
