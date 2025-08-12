import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-brand">
          <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <img src="../images/white_logo.png" alt="Logo" className="header-logo"/>
            <h3>Trust Circle</h3>
          </div>
          <p>Building community through trusted lending circles.</p>
        </div>
        
        <div className="footer-links">
          <a href="#">About</a>
          <a href="#">How It Works</a>
          <a href="#">FAQ</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Support</a>
        </div>
        
        <div className="footer-social">
          <a href="#" className="social-icon">📘</a>
          <a href="#" className="social-icon">🐦</a>
          <a href="#" className="social-icon">📸</a>
          <a href="#" className="social-icon">📱</a>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2025 Trust Circle. All rights reserved. This is not real.</p>
      </div>
    </footer>
  );
};

export default Footer;