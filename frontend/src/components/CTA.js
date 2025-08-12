import React from 'react';

const CTA = () => {
  return (
    <section className="cta">
      <h2>Ready to Start Your Financial Circle?</h2>
      <p>Join thousands of people already saving and borrowing together through Trust Circle.</p>
      <button onClick={() => window.location.href = 'signup.html'}>Get Started Now</button>
    </section>
  );
};

export default CTA;