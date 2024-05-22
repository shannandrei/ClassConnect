import { Box, Button, Grid, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import "./Home.css";
import Modal from './Modal';
import Navbar from './Navbar';

export default function HomePage() {
  const { currentUser, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    setShowModal(true);
  };

  return (
    <div className="backgroundcolorpage">
      <Navbar />

      <Grid container justify='center' alignItems='center' direction='column'>
        <Grid item sx={{ width: 1400 }}>
          <Box sx={{ bgcolor: '#f1e1cc', height: 580, width: {sm: 500, md: 700, lg: 700, xl: 1000}, marginTop: 20, marginRight: 90, marginLeft: {sm: 3.5, md: 3.5, lg: 3.5, xl: -5}, borderRadius: 5, opacity: '80%' }}>
            <Typography sx={{ fontSize: {sm: 35, md: 55, lg: 59, xl: 86}, fontWeight: 'bold', marginLeft: 3, marginRight: 2 }}>
              {currentUser ? `Welcome, ${currentUser.displayName.split(' ')[0]}!` : 'Welcome to ClassConnect!'}
            </Typography>

            <Typography sx={{ fontSize: {sm: 28, md: 30, lg: 31, xl: 36}, marginLeft: 4, marginRight: 2 }}>
              Designed to aid students in managing their class schedules.
            </Typography>

            <Typography sx={{ fontSize: {sm: 28, md: 30, lg: 31, xl: 36}, marginLeft: 4, marginTop: 5, marginRight: 2 }}>
              ClassConnect aims to address these two problems and act as a bridge. It will integrate 
              the calendar feature from the AIMS website with an existing event calendar
            </Typography>

            {!currentUser && (
              <Link to='/login'><Button variant='contained' size='large' sx={{ bgcolor: '#C21E56', marginLeft: 4, marginTop: 5 }}>
                Get Started
              </Button></Link>
            )}
          </Box>
        </Grid>

        <Grid item sx={{ display: {sm: 'none', lg: 'flex'}, marginTop: -60, marginRight: {lg: -65, xl: -130} }}>
          <Link to="/" onClick={handleClick}>
            <img src='./assets/logo.png' alt='CC Logo' style={{height: '390px', width: '390px'}}/>
          </Link>
          {/* Render the modal if showModal state is true */}
          {showModal && (
            <Modal onClose={() => setShowModal(false)}>
              {/* Populate the modal with dates and events data */}
              {/* For example, render a calendar component or a list of dates and events */}
              {/* Make sure to style the modal to display it as a pop-up overlay */}
            </Modal>
          )}
        </Grid>
      </Grid>
    </div>
  );
}
