import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes} from '@fortawesome/free-solid-svg-icons';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import "./ConfirmationModal.css";

const ConfirmationModal = ({ showModal, onClose, onSuccess, id, setRequests, requests}) => {
  
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
    setError(null);
    onSuccess(null);
    setLoading(true);
    try {
        console.log('Declining request with id:', id);
        await fetch(`/requests/${id}/decline`, { method: 'PUT' });
        const updatedRequests = requests.filter(request => request.id !== id);
        setRequests(updatedRequests);
        console.log('Request declined successfully.');
        setLoading(false);
        onSuccess('Request declined successfully.');
      } catch (error) {
        console.error('Error declining request:', error);
        setError('Failed to decline request.');
      }
    onClose();
  };
  

  return (
    <div className="modal-overlay">
      <Modal show={showModal} onHide={onClose} className="cm-modal">
        <Modal.Header className="cm-modal-header">
          <Modal.Title className="cm-modal-title">Are you sure you want to decline this request?</Modal.Title>
          <Button className="cm-close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </Modal.Header>
        {/* {error && <p className="cm-error">{error}</p>}
        {loading && <p className="cm-loading">Fetching your schedule...</p>} */}
        <Modal.Body className="cm-modal-body">
            <Form onSubmit={handleSubmit}>
                <div className="cm-btn">
                <Button onClick={onClose} className="cm-button" disabled={loading}>
                    Cancel
                </Button>
                <Button variant="primary" type="submit" className="cm-button-1" disabled={loading}>
                    {loading ? 'Loading...' : 'Decline'}
                </Button>
                </div>
            
            </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ConfirmationModal;
