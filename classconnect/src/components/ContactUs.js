import { Paper, Typography } from '@mui/material';
import React from 'react';
import Navbar from './Navbar';
import './ContactUs.css';
import member1Img from '../assets/profile1.jpg';
import member2Img from '../assets/profile2.jpg';
import member3Img from '../assets/profile3.jpg';
import member4Img from '../assets/profile4.jpg';
import member5Img from '../assets/profile5.jpg';
 
function ContactUs() {
  return (
    <><Navbar />
    <div className="contact-us-container">
      
      <div className="contact-info">
        <Paper style={{ backgroundColor: '#f3e6d5', padding: '30px'}}>
        <Typography sx={{ fontSize: { sm: 30, md: 40, lg: 45, xl: 60 }, fontWeight: 'bold', marginLeft: 3, marginRight: 2 }}>
          Contact Us
        </Typography>
 
        <Typography sx={{ fontSize: { sm: 22, md: 24, lg: 25, xl: 30 }, marginLeft: 4, marginRight: 2 }}>
          If you have any questions or inquiries, please feel free to contact us using the information below:
        </Typography>
 
        <Typography sx={{ fontSize: { sm: 22, md: 24, lg: 25, xl: 30 }, marginLeft: 4, marginRight: 2 }}>
          Email: classconnect@cit.edu
        </Typography>
 
        <Typography sx={{ fontSize: { sm: 22, md: 24, lg: 25, xl: 30 }, marginLeft: 4, marginRight: 2 }}>
          Phone: (032) 261 7741
        </Typography>
 
        <Typography sx={{ fontSize: { sm: 22, md: 24, lg: 25, xl: 30 }, marginLeft: 4, marginRight: 2 }}>
          Address: Natalio B. Bacalso Ave, Cebu City, Cebu, Philippines
        </Typography>
        </Paper>
      </div>
      <div className="members-profile">
        <h2>Meet The Team</h2>
        <div className="profile">
          <img src={member1Img} alt="profile1" />
          <div>
            <p><strong>Aldrich Alex Arisgar</strong></p>
            <p>Frontend Developer</p>
          </div>
        </div>
        <div className="profile">
          <img src={member2Img} alt="profile2" />
          <div>
            <p><strong>Rise Jade Benavente</strong></p>
            <p>Project Manager</p>
          </div>
        </div>
        <div className="profile">
          <img src={member3Img} alt="profile3" />
          <div>
            <p><strong>Xianna Andrei Cabaña</strong></p>
            <p>Backend Developer</p>
          </div>
        </div>
        <div className="profile">
          <img src={member4Img} alt="profile4" />
          <div>
            <p><strong>Don Querbin Migriño</strong></p>
            <p>Frontend Developer</p>
          </div>
        </div>
        <div className="profile">
          <img src={member5Img} alt="profile5" />
          <div>
            <p><strong>John Gabriel Rago</strong></p>
            <p>Backend Developer</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
 
export default ContactUs;