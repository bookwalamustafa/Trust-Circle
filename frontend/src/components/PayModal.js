import React, { useState } from 'react';
import '../css/PayModal.css';

const PayModal = ({ closeModal, groupName, handlePayment }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const submitPayment = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    handlePayment(numAmount);
    setAmount('');
    setError('');
    closeModal();
  };

  return (
    <div
      id="pay-modal"
      className="modal-backdrop"
      onClick={(e) => e.target.id === 'pay-modal' && closeModal()}
    >
      <div className="modal-content">
        <h2>Pay Towards Loan – {groupName}</h2>
        <label>Amount</label>
        <input
          type="number"
          step="0.01"
          placeholder="e.g. 50.00"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setError('');
          }}
        />
        {error && <p className="error-text">{error}</p>}
        <div className="modal-buttons">
          <button onClick={submitPayment}>Submit</button>
          <button onClick={closeModal} className="cancel">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default PayModal;
