<template>
  <div class="app">
    <svg class="moon" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="40" fill="#020617" />
      <path v-if="progress > 0" :d="path" fill="#facc15" class="light" />
    </svg>
    <br />
    <div>
      <p class="ment1">
        예산의 잔액이 줄어들수록 보름달에서 삭으로 변해갑니다!
      </p>
    </div>
    <div class="warn">
      <div v-if="budgetValue" class="star"></div>
      <p v-if="budgetValue" class="ment2">예산에 비해 예산지출이 많아요..</p>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useTransactionsStore } from '@/stores/staticsStores.js';
import { storeToRefs } from 'pinia';

export default {
  name: 'YourComponent',

  setup() {
    const transactions = useTransactionsStore();
    const { selectedMonth, userID } = storeToRefs(transactions);
    const budgetValue = computed(() => {
      if (percentageBalance.value === 0 || percentageBalance.value < 0) {
        return true;
      } else {
        return false;
      }
    });

    onMounted(() => {
      transactions.init();
    });

    // budget by month
    const totalBudget = computed(() => {
      const budgetForMonth = transactions.budgets.find(
        (budget) =>
          budget.userId === userID.value &&
          budget.month === selectedMonth.value.slice(0, 7),
      );
      return budgetForMonth ? budgetForMonth.amount : 0;
    });

    // expense by month
    const totalExpense = computed(() =>
      transactions.expense
        .filter((expense) => expense.date.slice(0, 7) === selectedMonth.value)
        .reduce((sum, expense) => sum + (expense.amount || 0), 0),
    );

    // percentage of expense
    const percentageExpense = computed(() => {
      if (!totalBudget.value) {
        return 0;
      }
      return (totalExpense.value / totalBudget.value) * 100;
    });

    // percentage of balance
    const percentageBalance = computed(() => {
      if (!totalBudget.value) {
        return 0;
      }
      return (
        ((totalBudget.value - totalExpense.value) / totalBudget.value) * 100
      );
    });

    // progress
    const progress = computed(() => {
      if (!totalBudget.value) {
        return 0;
      }

      let ratio = (totalBudget.value - totalExpense.value) / totalBudget.value;
      ratio = 1 - ratio;
      return Math.min(100, Math.max(0, ratio * 100));
    });

    const path = computed(() => {
      const phase = (progress.value / 100) * Math.PI;
      console.log(progress.value);

      const cx = 50;
      const cy = 50;
      const r = 40;

      const k = Math.cos(phase);
      const rx = Math.max(0.001, Math.abs(k) * r);
      const sweep = k >= 0 ? 1 : 0;

      return `
        M ${cx} ${cy - r}
        A ${r} ${r} 0 0 1 ${cx} ${cy + r}
        A ${rx} ${r} 0 0 ${sweep} ${cx} ${cy - r}
      `;
    });

    return {
      totalBudget,
      totalExpense,
      budgetValue,
      percentageBalance,
      percentageExpense,
      selectedMonth,
      progress,
      path,
    };
  },
};
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background: #020617;
  color: white;
}
.moon {
  width: min(60vw, 220px);
  height: auto;
}

.light {
  filter: drop-shadow(0 0 6px rgba(250, 204, 21, 0.4));
  transition: all 0.2s linear;
}

input[type='range'] {
  width: 200px;
  margin-top: 20px;
}

.number {
  margin-top: 10px;
  width: 100px;
  padding: 8px;
  border-radius: 8px;
  border: none;
  text-align: center;
}

.star {
  width: clamp(14px, 4vw, 20px);
  height: clamp(14px, 4vw, 20px);
  filter: drop-shadow(0 0 6px rgba(250, 204, 21, 0.4));
  background: rgba(238, 100, 8, 0.822);
  clip-path: polygon(
    50% 0%,
    61% 35%,
    98% 35%,
    68% 57%,
    79% 91%,
    50% 70%,
    21% 91%,
    32% 57%,
    2% 35%,
    39% 35%
  );
}

.ment1 {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  display: flex;
  font-size: clamp(5px, 4vw, 10px);
  color: rgba(250, 204, 21, 0.45);
}
.ment2 {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  display: flex;
  font-size: clamp(10px, 4vw, 15px);
  color: rgba(238, 100, 8, 0.822);
  margin-left: 10px;
}

.warn {
  display: flex;
}
</style>
