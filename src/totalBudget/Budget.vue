<template>
  <p>Budget</p>
  <input type="month" v-model="selectedMonth" />
  <p>Total Budget : {{ totalBudget }} (100%)</p>
  <p>
    Total Expense : {{ totalExpense }} ({{ Math.floor(percentageExpense) }}%)
  </p>
  <p>
    Total Balance : {{ totalBalance }} ({{ Math.floor(percentageBalance) }}%)
  </p>
</template>

<script>
import { computed } from 'vue';
import { useTransactionsStore } from '@/stores/stores.js';
import { storeToRefs } from 'pinia';

export default {
  name: 'Budget',
  setup() {
    const transactions = useTransactionsStore();
    const { selectedMonth, userID } = storeToRefs(transactions);

    // expense by year
    const totalExpense = computed(() =>
      transactions.expense
        .filter((e) => e.date.slice(0, 7) === selectedMonth.value)
        .reduce((sum, e) => sum + e.amount, 0),
    );

    // budget by month
    const totalBudget = computed(() => {
      const budgetForMonth = transactions.budgets.find(
        (b) =>
          b.userId === userID.value &&
          b.month === selectedMonth.value.slice(0, 7),
      );
      return budgetForMonth ? budgetForMonth.amount : 0;
    });

    // balance by month
    const totalBalance = computed(() => totalBudget.value - totalExpense.value);

    const percentageBalance = computed(() => {
      return (
        ((totalBudget.value - totalExpense.value) / totalBudget.value) * 100
      );
    });

    const percentageExpense = computed(() => {
      return (totalExpense.value / totalBudget.value) * 100;
    });

    return {
      transactions,
      selectedMonth,
      totalExpense,
      totalBudget,
      totalBalance,
      percentageBalance,
      percentageExpense,
    };
  },
};
</script>

<style scoped lang="scss"></style>
