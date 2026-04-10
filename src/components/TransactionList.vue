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
        <!-- 달력 헤더 변경: < 년 월 > 버튼에 CalendarView의 월 이동 기능 연결 -->
        <!-- 변경: displayYear/displayMonth 사용 + onPrevMonth/onNextMonth 연결 -->
        <div class="calendar-header">
          <button class="arrow-btn" @click="onPrevMonth">＜</button>
          <span class="month-label"
            >{{ displayYear }}년 {{ displayMonth }}월</span
          >
          <button class="arrow-btn" @click="onNextMonth">＞</button>
        </div>
        <!-- 달력 날짜 영역 (추후 구현) -->
        <!-- 달력 컴포넌트 삽입 => 다른 팀에서 구현한 달력 사용 -->
        <div class="calendar-body">
          <!-- ref 추가: 부모에서 자식 메서드 호출하기 위해 -->
          <!-- 추가 : @selectDate="onSelectDate" List.vue와 View 태그에 이벤트 연결-->
          <CalendarView ref="calendarRef" @selectDate="onSelectDate" />
        </div>
      </div>

      <!-- 오른쪽: 날짜별 거래 내역 -->
      <div class="detail-box">
        <!-- 선택된 날짜 표시 (달력 클릭시 변경 예정) -->
        <div class="selected-date">{{ selectedDateLabel }}</div>
        <!-- 거래 내역 목록 (날짜별 필터링) -->
        <div class="transaction-items">
          <!-- 내역이 없을 때 -->
          <p v-if="filteredTransactions.length === 0" class="empty-msg">
            지출 내역이 없어요.
          </p>
          <!-- 내역이 있을 때 -->
          <!-- 거래 내역(오른쪽 리스트) 한 줄을 클릭하면 수정 화면으로 이동 -->
          <!-- goEdit(transaction)이 transaction.id/type을 query로 넘겨 TransactionPage가 수정 모드로 폼을 채우게 함 -->
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
        <!-- + 플로팅 버튼 (추후 팝업 연동 예정) -->
        <!-- 변경: 클릭시 모달 열기 오후 3시 51분 경 = 대기정 형님이 요청하신 변동사항 수행
        <button class="float-btn" @click="showModal = true">＋</button>-->

        <!-- 변경: 모달 대신 transactionPage로 이동  ==> TransactionForm에서 탭 변경 시 라우트 query를 바꿔서 TransactionPage의 로직과 동기화-->
        <button
          class="float-btn"
          @click="
            router.push({ name: 'transactionPage', query: { type: 'expense' } })
          "
        >
          ＋
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// 변경: onMounted 추가
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
// 변경: onBeforeRouteUpdate import 추가
import { onBeforeRouteUpdate } from 'vue-router';
import { useTransactionStore } from '@/stores/transactionStore';
// CalendarView 컴포넌트 import => 추가자 jh
import CalendarView from '@/components/CalendarView.vue';

const router = useRouter();

// CalendarView 컴포넌트 참조
const calendarRef = ref(null);

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

// 현재 표시할 년/월 (기본값: 오늘)
const displayYear = ref(new Date().getFullYear());
const displayMonth = ref(new Date().getMonth() + 1);

// 이전 월로 이동 후 년/월 업데이트
const onPrevMonth = () => {
  calendarRef.value.prevMonth();
  // 변경된 년/월을 calendarRef에서 읽어서 업데이트
  displayYear.value = calendarRef.value.year;
  displayMonth.value = calendarRef.value.month + 1;
};

// 다음 월로 이동 후 년/월 업데이트
const onNextMonth = () => {
  calendarRef.value.nextMonth();
  // 변경된 년/월을 calendarRef에서 읽어서 업데이트
  displayYear.value = calendarRef.value.year;
  displayMonth.value = calendarRef.value.month + 1;
};

// 달력에서 날짜 클릭시 selectedDate 업데이트
const onSelectDate = ({ year, month, day }) => {
  selectedDate.value = new Date(year, month - 1, day);
};

// 홈 화면에서 홈 화면으로 refresh가 되지 않는 문제 해결 법 => import {onBeforeRouteUpdate} 와 함께 보기
onBeforeRouteUpdate(() => {
  displayYear.value = new Date().getFullYear();
  displayMonth.value = new Date().getMonth() + 1;
  calendarRef.value?.goToday();
});

// 추가: 선택된 날짜에 해당하는 거래 내역만 필터링
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
// 오른쪽 거래 목록(날짜별 내역)에서 항목을 클릭했을 때 호출되는 함수
// - 클릭한 거래의 id를 query(editId)로 넘겨 TransactionPage를 "수정 모드"로 진입시킴
// - type도 같이 넘겨서(TransactionPage에서) 수입/지출 탭 표시를 거래 타입과 맞춤
const goEdit = (transaction) => {
  router.push({
    name: 'transactionPage',
    query: { type: transaction.type, editId: transaction.id },
  });
};

// 추가: 마운트시 userId:1 거래 내역 불러오기
// 마운트 시 로그인 유저 거래 내역 불러오기(gj)
onMounted(async () => {
  const userId = store.getCurrentUserId(); // "usr_d4e5f6" 같은 값
  if (!userId) return; // 또는 alert/로그인 이동 처리
  await store.fetchTransactions({ userId });
});

// +버튼 클릭이벤트 관련
// 모달 표시 여부 상태 (대기정 님이 하셨던 것이 아닌 홈화면에서 + 버튼으로 투사하는 이벤트 관련 const입니다)
// const showModal = ref(false); ==> 모달 이벤트 필요 없어져서 숨김.
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

/* 달력 날짜 영역 - 높이를 auto로 변경해서 달력 크기에 맞게 조정 */
.calendar-body {
  border: 1px solid #333;
  height: auto; /* 변경: 300px → auto */
  border-radius: 4px;
  overflow: hidden; /* 추가: 달력이 박스 밖으로 넘치지 않게 */
}

/* 오른쪽: 날짜별 내역 */
.detail-box {
  flex: 1;
  padding: 12px;
  position: relative;
  border: 1px solid #333;
}

/* 선택된 날짜 - 패딩 추가로 공간 확보 */
.selected-date {
  font-size: 14px;
  font-weight: 600;
  padding: 12px 16px; /* 변경: 공간 추가 */
  border-bottom: 1px solid #333; /* 변경: 구분선 추가 */
  color: #fff;
}

/* 거래 내역 목록 - 높이 조정 */
.transaction-items {
  height: calc(100% - 80px);
  display: flex; /* 변경: 가운데 정렬 위해 추가 */
  align-items: center; /* 변경: 세로 가운데 정렬 */
  justify-content: center; /* 변경: 가로 가운데 정렬 */
  flex-direction: column; /* 추가: 내역 세로로 나열 */
}

/* 내역 없을 때 메시지 - margin 제거 */
.empty-msg {
  color: #666;
  text-align: center;
  font-size: 20px;
}

/* 거래 내역 아이템 */
.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid #333;
  width: 100%;
}

/* 메모 */
.transaction-memo {
  font-size: 13px;
  color: #fff;
}

/* 금액 */
.transaction-amount {
  font-size: 13px;
  font-weight: 600;
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
