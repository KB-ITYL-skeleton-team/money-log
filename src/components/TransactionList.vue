<template>
  <!-- TransactionList 전체 영역 - 검정 배경 -->
  <div class="transaction-list">
    <!-- [변경] 상단 요약바
         변경 전: 수입/지출/합계 라벨만 표시 + store.transactions 전체 합산
         변경 후: "26년 4월 수입/지출/합계" 형태로 라벨 변경 + displayYear/displayMonth 기준 해당 월 합산
         이유: 전체 데이터가 아닌 현재 보고 있는 월의 수입/지출/합계만 표시하기 위함 -->
    <div class="summary-bar">
      <div class="summary-item">
        <!-- [변경] "수입" → "26년 4월 수입" 형태로 표시
                  displayYear % 100 으로 연도 2자리 표시 (2026 → 26) -->
        <span class="summary-label"
          >{{ displayYear % 100 }}년 {{ displayMonth }}월 수입</span
        >
        <span class="summary-value income">{{
          totalIncome.toLocaleString()
        }}</span>
      </div>
      <div class="summary-item">
        <!-- [변경] "지출" → "26년 4월 지출" 형태로 표시 -->
        <span class="summary-label"
          >{{ displayYear % 100 }}년 {{ displayMonth }}월 지출</span
        >
        <span class="summary-value expense">{{
          totalExpense.toLocaleString()
        }}</span>
      </div>
      <div class="summary-item">
        <!-- [변경] "합계" → "26년 4월 합계" 형태로 표시 -->
        <span class="summary-label"
          >{{ displayYear % 100 }}년 {{ displayMonth }}월 합계</span
        >
        <!-- 합계는 흰색 그대로 유지 -->
        <span class="summary-value">{{ totalBalance.toLocaleString() }}</span>
      </div>
    </div>

    <!-- 2단 레이아웃: 달력 영역 + 날짜별 내역 영역 -->
    <div class="content-area">
      <!-- 왼쪽: 달력 박스 -->
      <div class="calendar-box">
        <!-- 달력 헤더: < 년 월 > 버튼으로 월 이동 -->
        <div class="calendar-header">
          <button class="arrow-btn" @click="onPrevMonth">＜</button>
          <span class="month-label"
            >{{ displayYear }}년 {{ displayMonth }}월</span
          >
          <button class="arrow-btn" @click="onNextMonth">＞</button>
        </div>
        <div class="calendar-body">
          <!-- [변경] :selectedDate="selectedDate" props 추가
                    변경 전: <CalendarView ref="calendarRef" @selectDate="onSelectDate" />
                    변경 후: selectedDate를 CalendarView에 props로 전달
                    이유: CalendarView 내부에서 클릭한 날짜에 파란색 배경을 표시하려면
                         부모의 selectedDate를 자식이 알아야 하기 때문 -->
          <CalendarView
            ref="calendarRef"
            @selectDate="onSelectDate"
            :selectedDate="selectedDate"
          />
        </div>
      </div>

      <!-- 오른쪽: 날짜별 거래 내역 -->
      <div class="detail-box">
        <!-- 선택된 날짜 표시 -->
        <div class="selected-date">{{ selectedDateLabel }}</div>

        <!-- [추가] 선택 날짜의 수입/지출/합계 표시 (①②③)
                  이유: 사용자가 특정 날짜 클릭 시 해당 날짜의 요약 정보를 바로 확인할 수 있게 하기 위함
                  selectedIncome/selectedExpense/selectedBalance는 filteredTransactions 기반으로 계산 -->
        <div class="selected-summary">
          <span class="income">수입 {{ selectedIncome.toLocaleString() }}</span>
          <span class="expense"
            >지출 {{ selectedExpense.toLocaleString() }}</span
          >
          <span style="color: #eee"
            >합계 {{ selectedBalance.toLocaleString() }}</span
          >
        </div>

        <!-- 거래 내역 목록 -->
        <div class="transaction-items">
          <p v-if="filteredTransactions.length === 0" class="empty-msg">
            수입/지출 내역이 없어요. <br />+ 버튼을 눌러 추가해주세요.
          </p>
          <div
            v-for="transaction in filteredTransactions"
            :key="transaction.id"
            class="transaction-item"
            @click="goEdit(transaction)"
          >
            <span class="transaction-memo">{{ transaction.memo }}</span>
            <span
              class="transaction-amount"
              :class="transaction.type === 'income' ? 'income' : 'expense'"
            >
              {{ transaction.type === 'income' ? '+' : '-' }}
              {{ Number(transaction.amount).toLocaleString() }}원
            </span>
          </div>
        </div>

        <!-- + 플로팅 버튼 -->
        <button class="float-btn" @click="goCreate('expense')">＋</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { onBeforeRouteUpdate } from 'vue-router';
import { useTransactionStore } from '@/stores/transactionStore';
import CalendarView from '@/components/CalendarView.vue';

const router = useRouter();
const calendarRef = ref(null);
const store = useTransactionStore();

// [변경] 해당 월 전체 수입 합계
// 변경 전: store.transactions 전체를 type === 'income'으로만 필터링
// 변경 후: displayYear/displayMonth 기준으로 해당 월만 필터링 후 합산
// 이유: 현재 보고 있는 월의 수입만 표시하기 위함
const totalIncome = computed(() =>
  store.transactions
    .filter((t) => {
      const d = new Date(t.date);
      return (
        t.type === 'income' &&
        d.getFullYear() === displayYear.value &&
        d.getMonth() + 1 === displayMonth.value
      );
    })
    .reduce((sum, t) => sum + t.amount, 0),
);

// [변경] 해당 월 전체 지출 합계
// 변경 전: store.transactions 전체를 type === 'expense'으로만 필터링
// 변경 후: displayYear/displayMonth 기준으로 해당 월만 필터링 후 합산
// 이유: 현재 보고 있는 월의 지출만 표시하기 위함
const totalExpense = computed(() =>
  store.transactions
    .filter((t) => {
      const d = new Date(t.date);
      return (
        t.type === 'expense' &&
        d.getFullYear() === displayYear.value &&
        d.getMonth() + 1 === displayMonth.value
      );
    })
    .reduce((sum, t) => sum + t.amount, 0),
);

// 합계 (수입 - 지출) - 기존 유지
const totalBalance = computed(() => totalIncome.value - totalExpense.value);

// 선택된 날짜 (오늘 날짜로 초기화) - 기존 유지
const selectedDate = ref(new Date());

// 선택된 날짜 표시용 (예: 4월 7일) - 기존 유지
const selectedDateLabel = computed(() => {
  const month = selectedDate.value.getMonth() + 1;
  const day = selectedDate.value.getDate();
  return `${month}월 ${day}일`;
});

// 현재 표시할 년/월 (기본값: 오늘) - 기존 유지
const displayYear = ref(new Date().getFullYear());
const displayMonth = ref(new Date().getMonth() + 1);

// 이전 월로 이동 - 기존 유지
const onPrevMonth = () => {
  calendarRef.value.prevMonth();
  displayYear.value = calendarRef.value.year;
  displayMonth.value = calendarRef.value.month + 1;
};

// 다음 월로 이동 - 기존 유지
const onNextMonth = () => {
  calendarRef.value.nextMonth();
  displayYear.value = calendarRef.value.year;
  displayMonth.value = calendarRef.value.month + 1;
};

// 달력에서 날짜 클릭시 selectedDate 업데이트 - 기존 유지
const onSelectDate = ({ year, month, day }) => {
  selectedDate.value = new Date(year, month - 1, day);
};

// 홈 화면 refresh 문제 해결 - 기존 유지
onBeforeRouteUpdate(() => {
  displayYear.value = new Date().getFullYear();
  displayMonth.value = new Date().getMonth() + 1;
  calendarRef.value?.goToday();
});

// 선택된 날짜에 해당하는 거래 내역 필터링 - 기존 유지
const filteredTransactions = computed(() => {
  const y = selectedDate.value.getFullYear();
  const m = selectedDate.value.getMonth();
  const d = selectedDate.value.getDate();
  return store.transactions.filter((t) => {
    const date = new Date(t.date);
    return (
      date.getFullYear() === y && date.getMonth() === m && date.getDate() === d
    );
  });
});

// [추가] 선택 날짜의 수입 합계 (오른쪽 패널 ①)
// 이유: filteredTransactions(선택 날짜 거래 내역)에서 수입만 합산
const selectedIncome = computed(() =>
  filteredTransactions.value
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0),
);

// [추가] 선택 날짜의 지출 합계 (오른쪽 패널 ②)
// 이유: filteredTransactions(선택 날짜 거래 내역)에서 지출만 합산
const selectedExpense = computed(() =>
  filteredTransactions.value
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0),
);

// [추가] 선택 날짜의 합계 (오른쪽 패널 ③)
// 이유: 선택 날짜 수입 - 지출
const selectedBalance = computed(
  () => selectedIncome.value - selectedExpense.value,
);

// 마운트시 거래 내역 불러오기 - 기존 유지
onMounted(async () => {
  const userId = store.getCurrentUserId();
  if (!userId) return;
  await store.fetchTransactions({ userId });
});

// 거래 수정 페이지로 이동 - 기존 유지
const goEdit = (transaction) => {
  router.push({
    name: 'transactionPage',
    query: { type: transaction.type, editId: transaction.id },
  });
};

// + 버튼 클릭시 수정모드 해제 + 저장모드로 전환 - 기존 유지
const goCreate = (type) => {
  store.clearEditTransaction();
  const y = selectedDate.value.getFullYear();
  const m = String(selectedDate.value.getMonth() + 1).padStart(2, '0');
  const d = String(selectedDate.value.getDate()).padStart(2, '0');
  const dateStr = `${y}-${m}-${d}`;
  router.push({ name: 'transactionPage', query: { type, date: dateStr } });
};
</script>

<style scoped>
.summary-bar {
  display: flex;
  justify-content: space-around;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.summary-label {
  font-size: 12px;
  color: #eee;
}

.summary-value {
  font-size: 14px;
  font-weight: 600;
  color: #eee;
}

.income {
  color: #4caf50;
}

.expense {
  color: #f44336;
}

.content-area {
  display: flex;
  height: auto;
  align-items: stretch;
}

.calendar-box {
  flex: 1;
  border-right: 1px solid #eee;
  padding: 12px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  border: 1px solid #eee;
  padding: 8px;
  border-radius: 4px;
}

.month-label {
  font-size: 16px;
  font-weight: 600;
  color: #eee;
}

.arrow-btn {
  background: none;
  border: none;
  color: #eee;
  font-size: 16px;
  font-weight: 900;
  cursor: pointer;
}

.calendar-body {
  border: 1px solid #eee;
  height: auto;
  padding: 15px;
  border-radius: 4px;
  overflow: hidden;
}

.detail-box {
  flex: 1;
  padding: 12px;
  position: relative;
  border: 1px solid #eee;
  overflow-y: auto;
}

.selected-date {
  font-size: 14px;
  font-weight: 600;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  color: #eee;
}

/* [추가] 선택 날짜 수입/지출/합계 영역
   이유: 선택한 날짜의 요약 정보를 selected-date 바로 아래에 표시하기 위함 */
.selected-summary {
  display: flex;
  justify-content: space-around;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  font-size: 12px;
  font-weight: 600;
}

.transaction-items {
  height: auto;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  padding-top: 12px;
}

.empty-msg {
  color: #eee;
  text-align: center;
  font-size: 18px;
  width: 100%;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid #eee;
  width: 100%;
  cursor: pointer;
}

.transaction-item:hover {
  background-color: #eee;
}

.transaction-memo {
  font-size: 13px;
  color: #eee;
}

.transaction-amount {
  font-size: 13px;
  font-weight: 600;
}

.float-btn {
  position: absolute;
  bottom: 16px;
  right: 16px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #4a90e2;
  border: none;
  color: #eee;
  font-size: 24px;
  cursor: pointer;
}

@media (max-width: 430px) {
  .content-area {
    flex-direction: column;
    height: auto;
  }

  .calendar-box {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #eee;
  }

  .detail-box {
    width: 100%;
    align-self: auto;
    min-height: 300px;
    position: relative;
    padding-bottom: 70px;
  }

  .float-btn {
    position: fixed;
    bottom: 80px;
    right: 16px;
  }
}
</style>
