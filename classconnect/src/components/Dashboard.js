// Dashboard.js
import { AppBar, Box, Button, Grid, Toolbar, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./Dashboard.css";
import Navbar from './Navbar';
import ConfirmationModal from './ConfirmationModal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [idHolder, setIdHolder] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const navigate = useNavigate();
  const BASE_URL = 'https://class-connect-server.onrender.com'

  useEffect(() => {
      // Fetch requests from your API here
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
            console.log('User role: adminn', data.role);
            console.log(data);
            if(data.role !== 'admin') {
              console.log('User role: admisfenn', data.role);
              navigate('/');
            }
          })
          .catch(error => console.error('Error fetching user role:', error));
      }
      fetchRequests();
  }, []);

  const handleCloseModal = (id) => {
      setShowModal(false);
      setConfirmation(null);
      setIdHolder(null);
  };

  const handleOpenModalDecline = (id) => { 
    setShowModal(true);
    setIdHolder(id);
  };

  const fetchRequests = async () => {
      try {
          // Make a fetch request to your API endpoint
          const response = await fetch(`${BASE_URL}/fetch-requests`);
          if (!response.ok) {
              throw new Error('Failed to fetch requests');
          }
          const data = await response.json();
          setRequests(data);
          console.log('Fetched requests:', data);
      } catch (error) {
          console.error('Error fetching requests:', error);
      }
  };
  
  

  const handleAccept = async (id) => {
    setError(null);
    setLoading(true);
    setSuccess(null);
    try {
      console.log('Accepting request with id:', id);
      
      // Send request to update request status to 'accepted' and user role to 'organization'
      await fetch(`${BASE_URL}/requests/${id}/accept`, { method: 'PUT' });
      
      // Remove accepted request from state
      const updatedRequests = requests.filter(request => request.id !== id);
      setRequests(updatedRequests);
      
      console.log('Request accepted successfully.');
      setSuccess('Request accepted successfully.');
      setLoading(false);
    } catch (error) {
      console.error('Error accepting request:', error);
      setError('Failed to accept request.');
      setLoading(false);
    }
  };

  const handleDecline = async (id) => {
    
  };

  return (
      <div className="backgroundcolorpage">
          <Navbar />
          <div className="dashb-header-title">
              <h1>Requests</h1>
              {success && (
                <div className="d-success">
                  <span>{success}</span>
                </div>
              )}

              {loading && (
                <div className="d-loading">
                  <span>Loading...</span>
                </div>
              )}
          </div>
              
          <div className="table-request-container">
              <TableContainer component={Paper}>
                  
                  <Table>
                      <TableHead>
                          <TableRow>
                              <TableCell>Requester's Name</TableCell>
                              <TableCell>Organization Name</TableCell>
                              <TableCell>Organization Type</TableCell>
                              <TableCell>Description</TableCell>
                              <TableCell>Organization Link</TableCell>
                              <TableCell>Contact Number</TableCell>
                              <TableCell>Date Created</TableCell>
                              <TableCell>Action</TableCell>
                          </TableRow>
                      </TableHead>
                      <TableBody>
                        {requests.length === 0 && (
                          <span>There are no pending requests...</span>
                        )}
                          {requests.map((request) => (
                            
                              <TableRow key={request.userId}>
                                  <TableCell>{request.displayName}</TableCell>
                                  <TableCell>{request.orgName}</TableCell>
                                  <TableCell>{request.orgType}</TableCell>
                                  <TableCell>{request.orgDescription}</TableCell>
                                  <TableCell>{request.link}</TableCell>
                                  <TableCell>{request.number}</TableCell>
                                  <TableCell>{request.createdAt}</TableCell>
                                 <TableCell>
                                      <Button variant="contained" color="primary" onClick={() => handleAccept(request.id)}>Accept</Button>
                                      <Button variant="contained" color="error" onClick={() => handleOpenModalDecline(request.id)}>Decline</Button>
                                  </TableCell>
                              </TableRow>
                          ))}
                      </TableBody>
                  </Table>
              </TableContainer>
          </div>
          {showModal && (
              <ConfirmationModal showModal={showModal} onClose={handleCloseModal} onSuccess={setSuccess} id={idHolder} setRequests={setRequests} requests={requests}/>
          )}
      </div>
  );
};

export default Dashboard;