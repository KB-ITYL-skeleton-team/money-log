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

  <p>Set a Budget</p>
  <inputBudget />
</template>

<script>
import { computed, onMounted } from 'vue';
import { useTransactionsStore } from '@/stores/staticsStores.js';
import { storeToRefs } from 'pinia';
import inputBudget from './InputBudget.vue';

export default {
  name: 'Budget',
  components: { inputBudget },

  setup() {
    const transaction = useTransactionsStore();
    const { selectedMonth, userID, expense, budgets } =
      storeToRefs(transaction);

    onMounted(() => {
      transaction.init();
    });

    const totalExpense = computed(() => {
      if (!expense.value) {
        return 0;
      }
      return expense.value
        .filter((e) => e.date?.slice(0, 7) === selectedMonth.value)
        .reduce((sum, e) => sum + (e.amount || 0), 0);
    });

    const totalBudget = computed(() => {
      if (!budgets.value || !userID.value) {
        return 0;
      }
      const budgetForMonth = budgets.value.find(
        (b) => b.userId === userID.value && b.month === selectedMonth.value,
      );
      return budgetForMonth ? budgetForMonth.amount : 0;
    });

    const totalBalance = computed(() => {
      return totalBudget.value - totalExpense.value;
    });

    const percentageBalance = computed(() => {
      if (!totalBudget.value) {
        return 0;
      }
      return (
        ((totalBudget.value - totalExpense.value) / totalBudget.value) * 100
      );
    });

    const percentageExpense = computed(() => {
      if (!totalBudget.value) {
        return 0;
      }
      return (totalExpense.value / totalBudget.value) * 100;
    });

    return {
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
