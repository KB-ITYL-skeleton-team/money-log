import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import data from '../../dummy_db2.json';

export const useTransactionsStore = defineStore('Transactions', () => {
  const transactions = ref(data.transactions);
  const userID = ref(2);

  // 수입 필터링
  const income = computed(() => {
    return transactions.value.filter(
      (transaction) =>
        transaction.type === 'income' && transaction.userId === userID.value,
    );
  });

  const totalIncome = computed(() => {
    return income.value.reduce(
      (sum, transaction) => sum + transaction.amount,
      0,
    );
  });

  // 지출 필터링
  const expense = computed(() => {
    return transactions.value.filter(
      (transaction) =>
        transaction.type === 'expense' && transaction.userId === userID.value,
    );
  });

  const totalExpense = computed(() => {
    return expense.value.reduce(
      (sum, transaction) => sum + transaction.amount,
      0,
    );
  });

  // 예산
  const budgets = ref(data.budgets);
  const budget = computed(() => {
    return budgets.value.find((budget) => budget.userId === userID.value);
  });

  const totalBudget = computed(() => {
    return budget.value?.amount ?? 0; // 안전하게 0 반환
  });

  // 잔액
  const totalBalance = computed(() => {
    return totalBudget.value - totalExpense.value;
  });

  // 진행률
  const progress = computed(() =>
    totalBudget.value
      ? Math.min(
          100,
          Math.max(0, (totalExpense.value / totalBudget.value) * 100),
        )
      : 0,
  );

  return {
    transactions,
    income,
    totalIncome,
    expense,
    totalExpense,
    budgets,
    budget,
    totalBudget,
    totalBalance,
    progress,
  };
});
