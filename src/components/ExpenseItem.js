import React from 'react';

function ExpenseItem({ expense, onDelete }) {
  return (
    <div className="expense-item">
      <div>
        <strong>{expense.title}</strong>
        <div>${expense.amount.toFixed(2)}</div>
      </div>
      <button onClick={() => onDelete(expense.id)}>Delete</button>
    </div>
  );
}

export default ExpenseItem;
