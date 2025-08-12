import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ showButtons = true }) => {
  return (
    <header>
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
          <img src="../images/white_logo.png" alt="Logo" className="header-logo"/>
          <h1>Trust Circle</h1>
        </div>
      </Link>
      {showButtons && (
        <nav>
          <Link to="/login">
            <button>Log In</button>
          </Link>
          <Link to="/signup">
            <button>Sign Up</button>
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Header;