import React, { useState } from 'react';

function ExpenseForm({ onAddExpense }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !amount) return alert('Please fill all fields');

    if (isNaN(amount) || Number(amount) <= 0) return alert('Enter a valid amount');

    const newExpense = {
      id: Date.now(),
      title: title.trim(),
      amount: parseFloat(amount),
    };

    onAddExpense(newExpense);
    setTitle('');
    setAmount('');
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <input
        type="text"
        placeholder="Expense Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        step="0.01"
        min="0"
      />
      <button type="submit">Add Expense</button>
    </form>
  );
}

export default ExpenseForm;
