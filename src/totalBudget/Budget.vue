<template>
  <p>예산</p>
  <p>Total Budget : {{ totalBudget }}</p>
  <br />
  <p>Total Expense : {{ totalExpense }}</p>
  <br />
  <p>Total Balance : {{ totalBalance }}</p>
  <br />
  <p>Total Income : {{ totalIncome }}</p>
</template>

<script>
import { useTransactionsStore } from '@/stores/stores.js';
import { storeToRefs } from 'pinia';
export default {
  name: 'Budget',
  setup() {
    const transactions = useTransactionsStore();
    const { totalBudget, totalIncome, totalExpense, totalBalance } =
      storeToRefs(transactions);

    return {
      transactions,
      totalBudget,
      totalIncome,
      totalExpense,
      totalBalance,
    };
  },
};
</script>

<style lang="scss" scoped></style>
