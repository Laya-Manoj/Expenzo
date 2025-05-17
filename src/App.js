import React, { useState } from 'react';
import './App.css';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [income, setIncome] = useState('');
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [category, setCategory] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [priorities, setPriorities] = useState(['', '', '']);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [search, setSearch] = useState('');

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!expenseTitle || !expenseAmount || !category) return;
    setExpenses([
      ...expenses,
      {
        title: expenseTitle,
        amount: Number(expenseAmount),
        category
      }
    ]);
    setExpenseTitle('');
    setExpenseAmount('');
    setCategory('');
  };

  const handleDelete = (index) => {
    const newExpenses = expenses.filter((_, i) => i !== index);
    setExpenses(newExpenses);
  };

  const totalExpense = expenses.reduce((total, item) => total + item.amount, 0);
  const savingsSuggestion = income - totalExpense;

  const score = income
    ? Math.max(0, Math.round(((income - totalExpense) / income) * 100))
    : 0;

  const pieData = {
    labels: expenses.map(e => e.title),
    datasets: [
      {
        data: expenses.map(e => e.amount),
        backgroundColor: ['#ff6384', '#36a2eb', '#ffcd56', '#4bc0c0', '#9966ff'],
        borderWidth: 1,
      },
    ],
  };

  const priorityMap = {};
  priorities.forEach((p, idx) => {
    if (p.trim()) priorityMap[p.trim().toLowerCase()] = idx + 1;
  });

  const expenseReductions = expenses.map((exp) => {
    const priorityRank = priorityMap[exp.title.trim().toLowerCase()];
    let reductionPercent = 0.2;
    if (priorityRank === 1) reductionPercent = 0.1;
    else if (priorityRank === 2) reductionPercent = 0.15;

    const amountToReduce = exp.amount * reductionPercent;
    return {
      title: exp.title,
      original: exp.amount,
      reductionPercent,
      amountToReduce,
      suggestedAmount: exp.amount - amountToReduce
    };
  });

  const handleExportCSV = () => {
    const header = 'Title,Amount,Category\n';
    const rows = expenses.map(e => `${e.title},${e.amount},${e.category}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const link = document.createElement('a');
    link.download = 'expenses.csv';
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  const filteredExpenses = expenses.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <header className="app-header">
        <h2>Expenzo💸</h2>
        <h4 className="subtitle">Your Personalised Expense Tracker</h4>
      </header>

      <div className="container">
        <form className="income-form" onSubmit={(e) => e.preventDefault()}>
          <label>Monthly Income:</label><br />
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder="e.g., 3000"
          />
        </form>

        <form onSubmit={handleAddExpense} className="expense-form">
          <input
            type="text"
            value={expenseTitle}
            onChange={(e) => setExpenseTitle(e.target.value)}
            placeholder="Expense Title"
          /><br />
          <input
            type="number"
            value={expenseAmount}
            onChange={(e) => setExpenseAmount(e.target.value)}
            placeholder="Amount"
          /><br />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select Category</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Shopping">Shopping</option>
            <option value="Rent">Rent</option>
            <option value="Bills">Bills</option>
            <option value="Others">Others</option>
          </select><br />
          <button className="expB1" type="submit">Add Expense</button>
        </form>

        <input
          type="text"
          className="search-box"
          placeholder="Search by title or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="survey">
          <h3>🎯 Your Priority Expenses</h3>
          {priorities.map((item, i) => (
            <input
              key={i}
              type="text"
              value={item}
              placeholder={`Priority ${i + 1}`}
              onChange={(e) => {
                const newP = [...priorities];
                newP[i] = e.target.value;
                setPriorities(newP);
              }}
            />
          ))}<br />
          <button onClick={() => setShowSuggestions(true)}>Get Suggestions</button>
        </div>

        <div className="expense-list">
          <h3>🧾 Expenses</h3>
          {filteredExpenses.length === 0 && <p>No expenses found.</p>}
          {filteredExpenses.map((expense, index) => (
            <div key={index} className="expense-item">
              <span>{expense.title} ({expense.category})</span>
              <span>${expense.amount.toFixed(2)}</span>
              <button onClick={() => handleDelete(index)}>❌</button>
            </div>
          ))}
        </div>

        <div className="summary">
          <p><strong>Total Expense:</strong> ${totalExpense.toFixed(2)}</p>
          <p><strong>Income:</strong> ${income || 0}</p>
          <p><strong>Balance:</strong> ${(income - totalExpense).toFixed(2)}</p>
          <button onClick={handleExportCSV}>📁 Export CSV</button>

          {income && totalExpense > income && (
            <div className="alert danger">⚠️ Warning: Expenses exceed income!</div>
          )}
          {income && totalExpense > income * 0.8 && totalExpense <= income && (
            <div className="alert warning">⚠️ Caution: You're nearing your limit.</div>
          )}
        </div>

        {showSuggestions && (
          <div className="suggestions">
            <h3>💡 Suggestions Based on Your Priorities</h3>
            <p>
              You should aim to save at least <strong>20%</strong> of your income.
              Here's a suggested reduction plan:
            </p>
            <ul>
              {expenseReductions.map((item, index) => (
                <li key={index}>
                  <strong>{item.title}</strong>: Reduce by ${item.amountToReduce.toFixed(2)} ({(item.reductionPercent * 100).toFixed(0)}%), 
                  suggested new amount: ${item.suggestedAmount.toFixed(2)}
                </li>
              ))}
            </ul>
            <p>
              Recommended total monthly savings: <strong>${(income * 0.2).toFixed(2)}</strong>
            </p>
            <p>
              You currently have <strong>${savingsSuggestion.toFixed(2)}</strong> left after expenses.
            </p>

            {expenses.length > 0 && (
              <div className="chart-toggle-container">
                <button onClick={() => setShowChart(!showChart)}>
                  {showChart ? 'Hide Pie Chart' : 'Show Pie Chart'}
                </button>
              </div>
            )}
          </div>
        )}

        {showChart && expenses.length > 0 && (
          <div className="chart-section">
            <h3>📊 Expense Distribution</h3>
            <div className="chart-wrapper">
              <Pie data={pieData} width={250} height={250} />
            </div>
            <p className="score">🧠 Budget Management Score: <strong>{score}%</strong></p>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
