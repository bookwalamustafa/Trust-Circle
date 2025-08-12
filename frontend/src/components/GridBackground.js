import React from 'react';

const GridBackground = () => {
  return (
    <>
      <div className="grid-overlay"></div>
      <div className="grid-background">
        <div className="grid-line horizontal" style={{ top: '20%', animationDelay: '0s' }}></div>
        <div className="grid-line horizontal" style={{ top: '40%', animationDelay: '2s' }}></div>
        <div className="grid-line horizontal" style={{ top: '60%', animationDelay: '4s' }}></div>
        <div className="grid-line horizontal" style={{ top: '80%', animationDelay: '6s' }}></div>
        
        <div className="grid-line vertical" style={{ left: '15%', animationDelay: '1s' }}></div>
        <div className="grid-line vertical" style={{ left: '35%', animationDelay: '3s' }}></div>
        <div className="grid-line vertical" style={{ left: '55%', animationDelay: '5s' }}></div>
        <div className="grid-line vertical" style={{ left: '75%', animationDelay: '7s' }}></div>
      </div>
    </>
  );
};

export default GridBackground;