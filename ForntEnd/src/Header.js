import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [showMenu, setShowMenu] = useState(false); // State to toggle the menu
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to check login status
  const navigate = useNavigate();

  // Function to toggle the menu visibility
  const toggleMenu = () => setShowMenu(!showMenu);

  // Check login status on mount and listen to changes in localStorage
  useEffect(() => {
    // Function to check login status from localStorage
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token); // If a token exists, the user is logged in
    };

    // Check login status initially
    checkLoginStatus();

    // Listen for changes to localStorage and update login state
    window.addEventListener('storage', checkLoginStatus);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // Handle logout logic
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    setIsLoggedIn(false); // Update the login state
    navigate(''); // Redirect the user to the login page
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        {/* Website Brand */}
        <Navbar.Brand href="#">MyWebsite</Navbar.Brand>
        
        {/* Hamburger Menu (Toggle button for mobile) */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={toggleMenu} />
        {isLoggedIn ? (
              <>
              <Nav.Link as={Link} to="/dashboard">MyWebsite</Nav.Link>
              </>
            ) : (
              // If the user is not logged in, show the Login button
              <>
                  <Nav.Link as={Link} to="/">MyWebsite</Nav.Link></>
            )}
        
        {/* Collapsible Menu Items */}
        <Navbar.Collapse id="basic-navbar-nav" className={showMenu ? 'show' : ''}>
          <Nav className="navbar-nav ms-auto">
            {/* If the user is logged in, show the menu with Profile, Contact Us, and Logout */}
            {isLoggedIn ? (
              <>
                <Nav.Link as={Link} to="/dashboard" className="nav-item-hover">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/viewProfile" className="nav-item-hover">Profile</Nav.Link>
                <Nav.Link as={Link} to="/OderList" className="nav-item-hover">Oder</Nav.Link>
                <Nav.Link as={Link} to="/contact-us" className="nav-item-hover">Contact Us</Nav.Link>
                <Button variant="outline-danger" className="btn-hover" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              // If the user is not logged in, show the Login button
              <>
                  
                  <Nav.Link as={Link} to="/" className="nav-item-hover">Login</Nav.Link><Nav.Link as={Link} to="/contact-us" className="nav-item-hover">Contact Us</Nav.Link></>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
