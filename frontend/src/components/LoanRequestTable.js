import React, { useEffect } from 'react';

const LoanRequestTable = ({ loanRequests, animationsLoaded }) => {
  // Setup ripple effect for buttons
  useEffect(() => {
    const buttons = document.querySelectorAll('.approve-btn, .decline-btn');
    
    const handleRipple = (e) => {
      const button = e.currentTarget;
      
      const circle = document.createElement('span');
      const diameter = Math.max(button.clientWidth, button.clientHeight);
      const radius = diameter / 2;
      
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - button.getBoundingClientRect().left - radius}px`;
      circle.style.top = `${e.clientY - button.getBoundingClientRect().top - radius}px`;
      circle.classList.add('ripple');
      
      const ripple = button.getElementsByClassName('ripple')[0];
      if (ripple) {
        ripple.remove();
      }
      
      button.appendChild(circle);
      
      setTimeout(() => {
        circle.remove();
      }, 600);
    };

    buttons.forEach(button => {
      button.addEventListener('click', handleRipple);
    });

    return () => {
      buttons.forEach(button => {
        button.removeEventListener('click', handleRipple);
      });
    };
  }, [loanRequests]);

  return (
    <div className={`table ${animationsLoaded ? 'animate-table' : ''}`}>
      <table id="loan-table">
        <thead>
          <tr>
            {['Name', 'Amount', 'Reason', 'Requested Date', 'Approved', 'Action'].map((header, i) => (
              <th 
                key={i} 
                className={animationsLoaded ? 'animate-th' : ''}
                style={{ animationDelay: `${0.1 + (i * 0.1)}s` }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody id="loan-body">
          {loanRequests.map((request, index) => (
            <tr 
              key={index} 
              className={animationsLoaded ? 'animate-tr' : ''}
              style={{ animationDelay: `${0.5 + (index * 0.1)}s` }}
            >
              <td>{request.name}</td>
              <td>{request.amount}</td>
              <td>{request.reason}</td>
              <td>{request.date}</td>
              <td>{request.status}</td>
              <td>
                {request.requiresAction ? (
                  <div className="action-buttons" style={{ display: 'flex', gap: '10px' }}>
                    <button className="approve-btn">Approve</button>
                    <button className="decline-btn">Decline</button>
                  </div>
                ) : (
                  "No Action Required"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoanRequestTable;