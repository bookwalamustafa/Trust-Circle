import React, { useEffect } from 'react';

const LoanRequestModal = ({ 
  formData, 
  handleInputChange, 
  submitRequest, 
  closeModal, 
  handleBackdropClick 
}) => {
  // Setup ripple effect for buttons
  useEffect(() => {
    const buttons = document.querySelectorAll('.submit-btn, .cancel-btn');
    
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
  }, []);

  return (
    <div className="modal" id="loan-modal" onClick={handleBackdropClick}>
      <div className="modal-content modal-animation">
        <div className="modal-header">
          <h3>Request a Loan</h3>
          <button className="close-btn" onClick={closeModal}>&times;</button>
        </div>
        <input 
          type="text" 
          id="reason" 
          placeholder="Reason" 
          required 
          value={formData.reason}
          onChange={handleInputChange}
          className="input-animation"
          style={{ animationDelay: '0.1s' }}
        />
        <input 
          type="number" 
          id="amount" 
          placeholder="Amount" 
          required 
          value={formData.amount}
          onChange={handleInputChange}
          className="input-animation"
          style={{ animationDelay: '0.2s' }}
        />
        <input 
          type="text" 
          id="date" 
          value={formData.date} 
          readOnly 
          className="input-animation"
          style={{ animationDelay: '0.3s' }}
        />
        <div className="modal-buttons">
          <button 
            className="cancel-btn" 
            onClick={closeModal}
            style={{ animationDelay: '0.4s' }}
          >
            Cancel
          </button>
          <button 
            className="submit-btn" 
            onClick={submitRequest}
            style={{ animationDelay: '0.5s' }}
          >
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoanRequestModal;