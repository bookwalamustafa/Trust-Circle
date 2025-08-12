import React from 'react';

const TransactionHistory = ({ groupData, animationsLoaded }) => {
  return (
    <div className={`table ${animationsLoaded ? 'animate-table' : ''}`}>
      <table id="transaction-table">
        <thead>
          <tr>
            {['Name', 'Amount', 'Date'].map((header, i) => (
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
        <tbody id="transaction-body">
          {groupData.transactions.map((transaction, index) => (
            <tr 
              key={index} 
              className={animationsLoaded ? 'animate-tr' : ''}
              style={{ animationDelay: `${0.5 + (index * 0.1)}s` }}
            >
              <td>{transaction.name}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;