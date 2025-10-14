import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-3">
      <Container className="text-center">
        <p>&copy; {new Date().getFullYear()} MyWebsite | All Rights Reserved</p>
      </Container>
    </footer>
  );
};

export default Footer;
