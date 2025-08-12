import React, { useEffect, useRef } from 'react';


const Feature = ({ icon, title, description }) => {
  const featureRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );
    
    if (featureRef.current) {
      observer.observe(featureRef.current);
    }
    
    return () => {
      if (featureRef.current) {
        observer.unobserve(featureRef.current);
      }
    };
  }, []);

  return (
    <div className="feature" ref={featureRef}>
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

const Features = () => {
  return (
    <section className="features">
      <h2>Why Choose Trust Circle?</h2>
      <div className="feature-grid">
        <Feature 
          icon="🔒"
          title="Secure & Trusted"
          description="Bank-level security with your trusted circle members"
        />
        <Feature 
          icon="💰"
          title="Interest Free Loans"
          description="Borrow without worrying about accruing fees."
        />
        <Feature 
          icon="⚡"
          title="Quick Access"
          description="Get funds when you need them most, no lengthy approvals"
        />
        <Feature 
          icon="🤝"
          title="Community Support"
          description="Build stronger relationships while achieving financial goals"
        />
      </div>
    </section>
  );
};

export default Features;