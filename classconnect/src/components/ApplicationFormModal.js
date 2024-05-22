import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes} from '@fortawesome/free-solid-svg-icons';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import "./ApplicationFormModal.css"; // Import the CSS file
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const ApplicationFormModal = ({ showModal, onClose, onSuccess }) => {
  const { currentUser } = useAuth();
  
  const [orgName, setOrgName] = useState("");
  const [orgType, setOrgType] = useState("");
  const [orgDescription, setOrgDescription] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [number, setNumber] = useState("");

  // State variables for form fields
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = {
        orgName,
        orgType,
        orgDescription,
        link,
        number,
        userId: currentUser.uid
      };
      const response = await axios.post('http://localhost:5000/submitApplication', data);
      setLoading(false);
      onSuccess(response.data);
      onClose();
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  

  return (
    <div className="modal-overlay">
      <Modal show={showModal} onHide={onClose} className="af-modal">
        <Modal.Header className="af-modal-header">
          <Modal.Title className="af-modal-title">Organization Application</Modal.Title>
          <Button className="af-close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </Modal.Header>
        {/* {error && <p className="af-error">{error}</p>}
        {loading && <p className="af-loading">Fetching your schedule...</p>} */}
        <Modal.Body className="af-modal-body">
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="orgname">
              <Form.Label>Organization Name</Form.Label>
              <Row>
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="Enter organization name"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="af-form-control"
                    required
                  />
                </Col>
              </Row>
            </Form.Group>
            <div className="form-group">
              <label className="form-label">Organization Type: </label>
              <div className="dropdown-container">
                <select
                  className="form-input"
                  value={orgType}
                  onChange={(e) => setOrgType(e.target.value)}
                  required
                >
                  <option value="">-Select Type-</option>
                  <option value="Departmental">Departmental</option>
                  <option value="Academic">Academic</option>
                  <option value="Sports">Sports</option>
                  <option value="Student Government">Student Government</option>
                  <option value="Religious">Religious</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>

            <Form.Group controlId="orgdesc">
              <Form.Label>Organization Description</Form.Label>
              <Row>
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="Enter description"
                    value={orgDescription}
                    onChange={(e) => setOrgDescription(e.target.value)}
                    className="af-form-control"
                    required
                  />
                </Col>
              </Row>
            </Form.Group>

            <Form.Group controlId="link">
              <Form.Label>Website or Social Media Link</Form.Label>
              <Row>
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="Enter a link"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="af-form-control"
                    pattern="^(ftp|http|https)://[^ ']+$" // Regular expression to validate URL
                    title="Please enter a valid URL"
                    required
                  />
                </Col>
              </Row>
            </Form.Group>

            
            <Form.Group controlId="number">
              <Form.Label>Direct Contact Number</Form.Label>
              <Row>
                <Col>
                  <Form.Control
                    type="number"
                    placeholder="Enter contact number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className="af-form-control"
                    min="0"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    required
                  />
                </Col>
              </Row>
            </Form.Group>
            <p className="af-disclaimer">Note: Confirmation of Application will take around 24 hours.</p>
            <Button variant="primary" type="submit" className="af-button" disabled={loading}>
                {loading ? 'Loading...' : 'Submit'}
            </Button>
            
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ApplicationFormModal;
