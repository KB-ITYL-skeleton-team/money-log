<template>
  <div class="budget">
    <input class="month" type="month" v-model="selectedMonth" />
    <div class="text"><p>의 예산을</p></div>
    <inputBudget class="input" v-on:reloadPage="reload" />
  </div>
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
    const reload = (month) => {
      selectedMonth.value = month;
    };

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
      reload,
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

<style scoped lang="scss">
.budget {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: clamp(10px, 4vw, 15px);
  color: rgba(250, 204, 21, 0.45);
  background: #020617;
  border-radius: 5%;
  flex-wrap: wrap;
  margin-top: -100px;
}

.month {
  cursor: pointer;
}
.text {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 15px;
  margin: 10px;
}

input {
  background: #020617;
  border: 1px solid rgba(250, 204, 21, 0.45);
  color: rgba(250, 204, 21, 0.45);
  border-radius: 10px;
  margin: 10px;
}
</style>
