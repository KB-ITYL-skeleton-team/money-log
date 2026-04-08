<template>
  <!-- TransactionList 전체 영역 -->
  <div class="transaction-list">
    <!-- 수입/지출/합계 요약 바 -->
    <div class="summary-bar">
      <div class="summary-item">
        <span class="summary-label">수입</span>
        <span class="summary-value income">{{
          totalIncome.toLocaleString()
        }}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">지출</span>
        <span class="summary-value expense">{{
          totalExpense.toLocaleString()
        }}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">합계</span>
        <span class="summary-value">{{ totalBalance.toLocaleString() }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';

// 거래 내역 store 가져오기
const store = useTransactionStore();

// 수입 합계
const totalIncome = computed(() =>
  store.transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0),
);

// 지출 합계
const totalExpense = computed(() =>
  store.transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0),
);

// 합계 (수입 - 지출)
const totalBalance = computed(() => totalIncome.value - totalExpense.value);
</script>

<style scoped>
/* 수입/지출/합계 요약 바 */
.summary-bar {
  display: flex;
  justify-content: space-around;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  background-color: #fff;
}

/* 요약 항목 */
.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

/* 라벨 */
.summary-label {
  font-size: 12px;
  color: #888;
}

/* 금액 */
.summary-value {
  font-size: 14px;
  font-weight: 600;
  color: #000;
}

/* 수입 색상 */
.income {
  color: #4caf50;
}

/* 지출 색상 */
.expense {
  color: #f44336;
}
</style>
