import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import AboutUs from './components/AboutUs';
import AddEvent from './components/AddEvent';
import AIMS from './components/Aims';
import Dashboard from './components/Dashboard';
import ForgotPassword from './components/ForgotPassword';
import Home from './components/Home';
import LoginSignUp from './components/LoginSignUp';
import MyCalendar from './components/MyCalendar';
import PrivateRoute from './components/PrivateRoute';
import ProfilePage from './components/profilePage';
import { AuthProvider } from './context/AuthContext';
import ContactUs from './components/ContactUs';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/login" element={<LoginSignUp />} />
          <Route path="/signup" element={<LoginSignUp />} />
          <Route path="/contact" element={<PrivateRoute Component={ContactUs} />} />
          <Route path="/about" element={<PrivateRoute Component={AboutUs} />} />
          <Route path="/" element={<PrivateRoute Component={Home} />} />
          <Route path="/about" element={<PrivateRoute Component={AboutUs} />} />
          <Route path="/user-profile" element={<PrivateRoute Component={ProfilePage} />} />
              <Route path="/calendar" element={<PrivateRoute Component={MyCalendar} />} />
              <Route path="/aims" element={<PrivateRoute Component={AIMS} />} />
              <Route path="/add-event" element={<PrivateRoute Component={AddEvent} />} />
          <Route path="admin-dashboard" element={<Dashboard/>}/>
        </Routes>
      </Router>
    </AuthProvider>
  );
}


export default App;
