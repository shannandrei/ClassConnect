import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faAngleDown, faArrowRight, faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import './Navbar.css';

function Navbar() {
    const { currentUser, logout } = useAuth();
    const location = useLocation();
    const navRef = useRef();
    const [profilePicURL, setProfilePicURL] = useState('/assets/profile-picture.jpg');
    const [dropdownActive, setDropdownActive] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isOrg, setIsOrg] = useState(false);

    const toggleDropdown = () => {
        setDropdownActive(!dropdownActive);
    };

    const closeDropdown = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownActive(false);
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
        console.log('checking');
        if (currentUser.photoURL) {
            setProfilePicURL(currentUser.photoURL);
        }
        if (currentUser.uid) {
            console.log('fetching user role with id: ', currentUser.uid);
            fetch(`/user-role/${currentUser.uid}`)
              .then(response => {
                if (response.ok) {
                  return response.json();
                } else {
                  throw new Error('Failed to fetch user role');
                }
              })
              .then(data => {
                setIsAdmin(data.role === 'admin');
                console.log('User role:', data.role);   
                setIsOrg(data.role === 'organization');
              })
              .catch(error => console.error('Error fetching user role:', error));
          }
        
          console.log('isAdmin:', isAdmin);
            console.log('isOrg:', isOrg);
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', closeDropdown);
        return () => {
            document.removeEventListener('mousedown', closeDropdown);
        };

       
        
    }, []);
    return (
        <nav className='nb' ref={navRef}>
            <Link to='/' className='nb-logo'>
                <img src="/assets/logo.png" alt="logo" className="nb-logo-small" />
                <span className="nb-logo-title-campus">Class</span>
                <span className="nb-logo-title-eats">Connect</span>
            </Link>
            <ul className='nb-list'>
                <li className={`nb-list-item ${location.pathname === '/' ? 'active' : ''}`}><Link to="/">Home</Link></li>
                <li className={`nb-list-item ${location.pathname === '/calendar' ? 'active' : ''}`}><Link to="/calendar">Calendar</Link></li>
                <li className={`nb-list-item ${location.pathname === '/about' ? 'active' : ''}`}><Link to="/about">About Us</Link></li>
                <li className={`nb-list-item ${location.pathname === '/contact' ? 'active' : ''}`}><Link to="/contact">Contact Us</Link></li>
                {(isAdmin || isOrg) && <li className={`nb-list-item ${location.pathname === '/add-event' ? 'active' : ''}`}><Link to="/add-event">Add Event</Link></li>}
                {isAdmin && <li className={`nb-list-item ${location.pathname === '/admin-dashboard' ? 'active' : ''}`}><Link to="/admin-dashboard">Requests</Link></li>}
                </ul>

            <div className='nb-profile-dropdown' ref={dropdownRef}>
                <div className='nb-profile-dropdown-btn' onClick={toggleDropdown}>
                    <div className='nb-profile-img'>
                        <div className="nb-profile-img-frame">
                            <img src={profilePicURL} alt="Profile" className="nb-profile-img-image" />
                        </div>
                        
                    </div>
                        <FontAwesomeIcon icon={faCircle} style={{ position: 'absolute', bottom: '0.2rem', left: '2.3rem', fontSize: '0.7rem', color: '#37be6b' }} />
                    <span>
                        {currentUser.displayName.split(' ')[0]}
                        <FontAwesomeIcon icon={faAngleDown} style={{ padding: '2px 0 0 4px', fontSize: '1rem', color: '#d2627e' }} />
                    </span>
                </div>

                <ul className={`nb-profile-dropdown-list ${dropdownActive ? 'active' : ''}`}>
                    <li className="nb-profile-dropdown-list-item">
                        <Link to="/user-profile">
                            <div className='nb-profile-dropdown-list-item-icon'>
                                <FontAwesomeIcon icon={faUser} style={{ fontSize: '1rem', color: 'white' }} />
                            </div>
                            Edit Profile
                        </Link>
                    </li>
                    <li className="nb-profile-dropdown-list-item">
                        <a href="#" onClick={logout}>
                            <div className='nb-profile-dropdown-list-item-icon'>
                                <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '1rem', color: 'white' }} />
                            </div>
                            Log out
                        </a>
                    </li>
                </ul>
            </div>

        </nav>
    );
}

export default Navbar;
