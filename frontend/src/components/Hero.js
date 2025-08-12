import React from 'react';
import SpinningLogo from './SpinningLogo';

const Hero = () => {
  return (
    <div className="hero-container">
      <section className="hero">
        <SpinningLogo/>
        <h2>Save Together. Borrow Smarter.</h2>
        <p>Build trust, share resources, and access funds when you need them most with your own trusted circle of friends and family.</p>
        <button onClick={() => window.location.href = 'signup.html'}>Start Your Circle Today</button>
      </section>
    </div>
  );
};

export default Hero;