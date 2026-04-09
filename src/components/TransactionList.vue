<template>
  <!-- TransactionList 전체 영역 - 검정 배경 -->
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

    <!-- 2단 레이아웃: 달력 영역 + 날짜별 내역 영역 -->
    <div class="content-area">
      <!-- 왼쪽: 달력 박스 (나중에 구현) -->
      <div class="calendar-box">
        <!-- 달력 헤더 -->
        <div class="calendar-header">
          <button class="arrow-btn">＜</button>
          <span class="month-label">{{ currentMonth }}월</span>
          <button class="arrow-btn">＞</button>
        </div>
        <!-- 달력 날짜 영역 (추후 구현) -->
        <div class="calendar-body"></div>
      </div>

      <!-- 오른쪽: 날짜별 거래 내역 -->
      <div class="detail-box">
        <!-- 선택된 날짜 표시 (달력 클릭시 변경 예정) -->
        <div class="selected-date">{{ selectedDateLabel }}</div>
        <!-- 거래 내역 목록 (추후 연동 예정) -->
        <div class="transaction-items">
          <p class="empty-msg">지출 내역이 없어요.</p>
        </div>
        <!-- + 플로팅 버튼 (추후 팝업 연동 예정) -->
        <button class="float-btn">＋</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
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

// 선택된 날짜 (오늘 날짜로 초기화)
const selectedDate = ref(new Date());

// 현재 월 표시용
const currentMonth = computed(() => selectedDate.value.getMonth() + 1);

// 선택된 날짜 표시용 (예: 4월 7일)
const selectedDateLabel = computed(() => {
  const month = selectedDate.value.getMonth() + 1;
  const day = selectedDate.value.getDate();
  return `${month}월 ${day}일`;
});
</script>

<style scoped>
/* 전체 영역 - 검정 배경 */
.transaction-list {
  background-color: #000;
  min-height: 100vh;
  color: #fff;
}

/* 수입/지출/합계 요약 바 */
.summary-bar {
  display: flex;
  justify-content: space-around;
  padding: 12px 0;
  border-bottom: 1px solid #333;
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
  color: #aaa;
}

/* 금액 */
.summary-value {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}

/* 수입 색상 */
.income {
  color: #4caf50;
}

/* 지출 색상 */
.expense {
  color: #f44336;
}

/* 2단 레이아웃 */
.content-area {
  display: flex;
  height: calc(100vh - 60px);
}

/* 왼쪽: 달력 박스 */
.calendar-box {
  flex: 1;
  border-right: 1px solid #333;
  padding: 12px;
}

/* 달력 헤더 */
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  border: 1px solid #333;
  padding: 8px;
  border-radius: 4px;
}

/* 월 표시 */
.month-label {
  font-size: 16px;
  font-weight: 600;
}

/* 화살표 버튼 */
.arrow-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
}

/* 달력 날짜 영역 (추후 구현) */
.calendar-body {
  border: 1px solid #333;
  height: 300px;
  border-radius: 4px;
}

/* 오른쪽: 날짜별 내역 */
.detail-box {
  flex: 1;
  padding: 12px;
  position: relative;
  border: 1px solid #333;
}

/* 선택된 날짜 */
.selected-date {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #fff;
}

/* 거래 내역 목록 */
.transaction-items {
  height: calc(100% - 80px);
}

/* 내역 없을 때 메시지 */
.empty-msg {
  color: #666;
  text-align: center;
  margin-top: 40px;
  font-size: 13px;
}

/* + 플로팅 버튼 */
.float-btn {
  position: absolute;
  bottom: 16px;
  right: 16px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #4a90e2;
  border: none;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
}
</style>
