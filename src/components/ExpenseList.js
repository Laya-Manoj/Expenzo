import React from 'react';
import ExpenseItem from './ExpenseItem';

function ExpenseList({ expenses, onDelete }) {
  if (expenses.length === 0) {
    return <p style={{ textAlign: 'center' }}>No expenses added yet.</p>;
  }

  return (
    <div className="expense-list">
      {expenses.map((expense) => (
        <ExpenseItem key={expense.id} expense={expense} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default ExpenseList;
