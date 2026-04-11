<template>
  <div>
    <div class="ment">
      <div class="te">
        <p class="number">{{ selectedMonth }}</p>
        <p>월의</p>
      </div>
      <div class="text">
        <div class="te">
          <p>예산은</p>
          <p class="number">100%</p>
          <p>( ₩ {{ totalBudget }} )</p>
        </div>
        <div class="te">
          <p>예산지출은</p>
          <p class="number">{{ Math.floor(percentageExpense) }}%</p>
          <p>( ₩ {{ totalExpense }} )</p>
        </div>
        <div class="te">
          <p>예산잔액은</p>
          <p class="number">{{ Math.floor(percentageBalance) }}%</p>
          <p>( ₩ {{ totalBudget - totalExpense }} )</p>
        </div>
      </div>
      <p>예요.</p>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useTransactionsStore } from '@/stores/staticsStores.js';
import { storeToRefs } from 'pinia';
import inputBudget from './InputBudget.vue';

export default {
  name: 'Result',
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
