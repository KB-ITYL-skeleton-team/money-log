<template>
  <div class="app">
    <svg class="moon" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="40" fill="#020617" />
      <path :d="path" fill="#facc15" class="light" />
    </svg>
    <div>
      <p class="ment1">
        예산의 잔액이 줄어들수록 보름달에서 삭으로 변해갑니다!
      </p>
    </div>
    <div class="warn">
      <div v-if="budgetValue" class="star"></div>
      <p v-if="budgetValue" class="ment2">예산에 비해 지출이 많아요..</p>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useTransactionsStore } from '@/stores/staticsStores.js';
import { storeToRefs } from 'pinia';

export default {
  name: 'Moon',
  setup() {
    const transactions = useTransactionsStore();
    const {
      userID,
      budget,
      selectedMonth,
      totalIncomeM,
      totalExpenseM,
      totalBudgetM,
      totalBalanceM,
      percentageExpenseM,
      percentageBalanceM,
    } = storeToRefs(transactions);
    // 새로고침
    onMounted(() => {
      transactions.init();
    });

    // 에산 경고 변수
    const budgetValue = computed(() => {
      if (percentageBalanceM.value < 0) {
        return true;
      } else {
        return false;
      }
    });

    // 진행도
    const progress = computed(() => {
      if (!totalBudgetM.value) return 0;
      return Math.min(100, (totalExpenseM.value / totalBudgetM.value) * 100);
    });

    // 달 궤도
    const path = computed(() => {
      const phase = (progress.value / 100) * Math.PI;

      const cx = 50;
      const cy = 50;
      const r = 40;

      const k = Math.cos(phase);
      const rx = Math.max(0.001, Math.abs(k) * r);
      const sweep = k >= 0 ? 0 : 1;

      return `
        M ${cx} ${cy - r}
        A ${r} ${r} 0 0 0 ${cx} ${cy + r}
        A ${rx} ${r} 0 0 ${sweep} ${cx} ${cy - r}
      `;
    });

    return {
      userID,
      budget,
      budgetValue,
      selectedMonth,
      totalIncomeM,
      totalExpenseM,
      totalBudgetM,
      totalBalanceM,
      percentageExpenseM,
      percentageBalanceM,
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

.ment1 {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  display: flex;
  font-size: clamp(5px, 4vw, 10px);
  color: rgba(250, 204, 21, 0.45);
}

/* 예산 초과 경고 */
.warn {
  display: flex;
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
</style>
