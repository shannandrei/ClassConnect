import { Box, Grid, Paper, Typography } from '@mui/material';
import React from 'react';
import Navbar from './Navbar';
 
 
export default function AboutUs() {
  return (
    <div className="backgroundcolorpage">
      <Navbar />
 
      <Grid container justifyContent="center" alignItems="center" spacing={2}>
            <Grid item xs={12} md={8}>
                    <Paper sx={{
                        bgcolor: '#f1e1cc',
                        height: 480,
                        width: { sm: 500, md: 700, lg: 700, xl: 1000 },
                        marginTop: 10,
                        marginRight: { xs: 2, md: 3 },    
                        marginLeft: { xs: 8, md: 10 },
                        borderRadius: 5,
                        opacity: 0.8,
                    }}>
                        <Typography sx={{ fontSize: { sm: 35, md: 55, lg: 59, xl: 86 }, fontWeight: 'bold', marginLeft: 3, marginRight: 2, marginTop: 2, paddingTop: 1.5 }}>
                            About ClassConnect
                        </Typography>
                        <Typography sx={{ fontSize: { sm: 28, md: 30, lg: 31, xl: 36 }, marginLeft: 4, marginTop: 5, marginRight: 2 }}>
                            ClassConnect is designed to seamlessly integrate class schedules, event planning, and academic resources into a single, easy-to-use platform. Our goal is to simplify the student experience, enhancing productivity and reducing stress.
                        </Typography>
                    </Paper>
            </Grid>
 
 
            {/* Image */}
        <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'left', marginTop: '100px', marginLeft: 0 }}>
            <img src="/assets/student.png" alt="ClassConnect" style={{ width: { sm: 500, md: 700, lg: 700, xl: 1000 }, maxWidth: '400px', height: 'auto', borderRadius: '5px', marginRight: 50 }} />
            </Box>
        </Grid>
 
            {/* Image */}
        <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'left', marginTop: '100px', marginLeft: 0, marginBottom: '200px' }}>
            <img src="/assets/another.webp"
                 alt="ClassConnect"
                 style={{ width: { sm: 500, md: 700, lg: 700, xl: 1000 },
                 maxWidth: '400px',
                 height: 'auto',
                 borderRadius: '30px',
                 marginLeft: 200}} />
            </Box>
        </Grid>
 
        <Grid item xs={12} md={8} sx={{marginBottom: '200px'}}>
            <Paper sx={{
            bgcolor: '#f1e1cc',
            height: 400,
            width: { sm: 500, md: 700, lg: 700, xl: 1000 },
            marginTop: 12,
            borderRadius: 5,
            opacity: 0.8,
            marginLeft: 15,
            padding: 3,
            paddingTop: 0.5
            }}>
                <Typography sx={{ fontSize: { sm: 28, md: 28, lg: 31, xl: 36 }, mt: 6 }}>
                    From integrating academic calendars to providing timely reminders and resources, ClassConnect is here to support every student's journey.
                </Typography>
                <Typography sx={{ fontSize: { sm: 28, md: 30, lg: 31, xl: 36 }, mt: 2 }}>
                    Learn more about our mission to help students manage their academic life more effectively.
                </Typography>
            </Paper>
        </Grid>
      </Grid>
    </div>
  );
}