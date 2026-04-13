<template>
  <div>
    <div class="ment">
      <div class="te">
        <p class="number">{{ date.year }}</p>
        <p>년</p>
        <p class="number">{{ date.month }}</p>
        <p>월의</p>
      </div>
      <div class="text">
        <div class="te">
          <p>예산은</p>
          <p class="number">{{ totalBudgetM === 0 ? '0%' : '100%' }}</p>
          <p>( ₩ {{ totalBudgetM.toLocaleString() }} )</p>
        </div>
        <div class="te">
          <p>지출은</p>
          <p class="number">{{ Math.floor(percentageExpenseM * 10) / 10 }}%</p>
          <p>( ₩ {{ totalExpenseM.toLocaleString() }} )</p>
        </div>
        <div class="te">
          <p>잔액은</p>
          <p class="number">{{ Math.floor(percentageBalanceM * 10) / 10 }}%</p>
          <p>( ₩ {{ (totalBudgetM - totalExpenseM).toLocaleString() }} )</p>
        </div>
      </div>
      <p>이에요.</p>
    </div>
  </div>
</template>

<script>
import { useTransactionsStore } from '@/stores/staticsStores.js';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

export default {
  name: 'Result',

  setup() {
    // 새로고침
    const reload = (month) => {
      selectedMonth.value = month;
    };

    // 스토어 사용
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

    const date = computed(() => {
      const [year, month] = selectedMonth.value.split('-');
      return { year, month };
    });

    return {
      reload,
      date,
      userID,
      budget,
      selectedMonth,
      totalIncomeM,
      totalExpenseM,
      totalBudgetM,
      totalBalanceM,
      percentageExpenseM,
      percentageBalanceM,
    };
  },
};
</script>

<style lang="scss" scoped>
.ment {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: -20vh;
  color: rgba(250, 204, 21, 0.45);
}
.text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  margin-left: 10px;
  color: rgba(250, 204, 21, 0.45);
}
.te {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-right: 5px;
  margin-left: 5px;
  font-size: 15px;
}
.number {
  margin-left: 5px;
  margin-right: 5px;
  font-size: 25px;
  color: rgba(250, 204, 21, 0.7);
}
</style>
