const EXPENSES_KEY = 'react_expenses';
const INCOME_KEY = 'react_income';

export function getExpenses() {
  const data = localStorage.getItem(EXPENSES_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveExpenses(expenses) {
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
}

export function getIncome() {
  const data = localStorage.getItem(INCOME_KEY);
  return data ? Number(data) : 0;
}

export function saveIncome(income) {
  localStorage.setItem(INCOME_KEY, income);
}
