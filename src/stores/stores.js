import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import data from '../../db.json';

export const useTransactionsStore = defineStore('Transactions', () => {
  const transactions = ref(data.transactions);
  const categories = ref(data.categories);
  const userID = ref('usr_e0ifd0tv');

  // income
  const income = computed(() => {
    return transactions.value.filter(
      (transaction) =>
        transaction.type === 'income' && transaction.userId === userID.value,
    );
  });

  // expense
  const expense = computed(() => {
    return transactions.value.filter(
      (transaction) =>
        transaction.type === 'expense' && transaction.userId === userID.value,
    );
  });

  // budget
  const budgets = ref(data.budgets);
  const budget = computed(() => {
    return budgets.value.find((budget) => budget.userId === userID.value);
  });

  const selectedMonth = ref(new Date().toISOString().slice(0, 7));

  return {
    userID,
    transactions,
    categories,
    income,
    expense,
    budgets,
    budget,
    selectedMonth,
  };
});
