import React from 'react';

const SpinningLogo = () => {
  return (
    <div className="logo-container">
        <h1 className = "display-title">Trust</h1>
        <img src="../images/blue_logo.png" alt="Logo" className="spinning-logo" />
        <h1 className = "display-title">Circle</h1>
    </div>
  );
};

export default SpinningLogo;