import React, { useState } from 'react';

function IncomeForm({ income, onIncomeChange }) {
  const [tempIncome, setTempIncome] = useState(income);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tempIncome === '' || tempIncome < 0) {
      alert('Please enter a valid income (0 or more)');
      return;
    }
    onIncomeChange(Number(tempIncome));
  };

  return (
    <form onSubmit={handleSubmit} className="income-form">
      <label>Enter your monthly Income:</label>
      <input
        type="number"
        value={tempIncome}
        onChange={(e) => setTempIncome(e.target.value)}
        step="0.01"
        min="0"
        placeholder="Income"
      />
      <button type="submit">Set Income</button>
    </form>
  );
}

export default IncomeForm;
