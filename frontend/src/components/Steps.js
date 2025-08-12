import React, { useEffect, useRef } from 'react';

const Step = ({ number, title, description }) => {
  const stepRef = useRef(null);
  
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
    
    if (stepRef.current) {
      observer.observe(stepRef.current);
    }
    
    return () => {
      if (stepRef.current) {
        observer.unobserve(stepRef.current);
      }
    };
  }, []);

  return (
    <div className="step" ref={stepRef}>
      <div className="step-number">{number}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

const Steps = () => {
  return (
    <section className="steps">
      <Step 
        number="1"
        title="Create Your Circle"
        description="Start a trusted group with friends, family, or your community. Invite people you trust to join your financial circle."
      />
      <Step 
        number="2"
        title="Contribute Monthly"
        description="Everyone deposits a fixed amount every month into the common pool. Build your collective savings together."
      />
      <Step 
        number="3"
        title="Borrow When Needed"
        description="Request a loan from the pool anytime you face an unexpected expense. Help each other through tough times."
      />
    </section>
  );
};

export default Steps;