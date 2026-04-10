<template>
  <div>
    <div style="width: 100%; margin: 0 auto">
      <div style="border: solid 1px black; width: 100%">
        <div>
          <div
            style="
              border: solid 2px black;
              display: grid;
              grid-template-columns: repeat(7, 1fr);
              text-align: center;
            "
          >
            <!-- 1-2. 월화수목금토일 화면에 보이기 -->
            <div v-for="day in weekDays" :key="day">
              {{ day }}
            </div>
          </div>
        </div>

        <div>
          <div
            style="
              display: grid;
              grid-template-columns: repeat(7, 1fr);
              border: solid 1px black;
            "
          >
            <!-- [변경] backgroundColor: isToday → isSelected로 교체
                      변경 전: 오늘 날짜만 파란색 배경
                      변경 후: 클릭한 날짜가 파란색으로 이동, 오늘은 "오 늘" 텍스트로 표시
                      position: relative 추가 - dot 표시를 절대위치로 배치하기 위함 -->
            <div
              v-for="(item, index) in calendarTable"
              @click="onClickDate(item)"
              :key="index"
              :style="{
                border: '1px solid gray',
                height: '60px',
                textAlign: 'center',
                boxSizing: 'border-box',
                color: getDayColor(index),
                paddingTop: '4px',
                backgroundColor: isSelected(item) ? '#4a90e2' : 'transparent',
                position: 'relative',
              }"
            >
              <!-- [변경] 오늘 날짜면 "오 일 늘" 형태로 노란색 텍스트 표시
                        변경 전: 오늘 날짜 파란색 배경만 표시
                        변경 후: 파란색 배경 제거 + "오"/"늘" 노란색 텍스트로 오늘임을 표시 -->
              <template v-if="isToday(item)">
                <span style="color: yellow; font-size: 10px">오</span>
                {{ item }}
                <span style="color: yellow; font-size: 10px">늘</span>
              </template>
              <!-- 오늘이 아니면 숫자만 표시 -->
              <template v-else>
                {{ item }}
              </template>

              <!-- [추가] 수입/지출 dot 표시
                        이유: 해당 날짜에 수입/지출 내역이 있는지 한눈에 파악하기 위함
                        hasIncome(item) → 초록색 점 (수입 있음)
                        hasExpense(item) → 빨간색 점 (지출 있음)
                        날짜 숫자 아래 왼쪽(수입)/오른쪽(지출)에 배치
                        position: absolute로 셀 하단에 고정 -->
              <div
                v-if="item"
                style="
                  position: absolute;
                  bottom: 4px;
                  left: 0;
                  right: 0;
                  display: flex;
                  justify-content: center;
                  gap: 4px;
                "
              >
                <!-- 수입 dot: 해당 날짜에 수입 내역이 1개 이상일 때 표시 -->
                <span
                  v-if="hasIncome(item)"
                  style="
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background-color: #4caf50;
                    display: inline-block;
                  "
                ></span>
                <!-- 지출 dot: 해당 날짜에 지출 내역이 1개 이상일 때 표시 -->
                <span
                  v-if="hasExpense(item)"
                  style="
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background-color: #f44336;
                    display: inline-block;
                  "
                ></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
// [추가] transactionStore import
// 이유: 날짜별 수입/지출 dot 표시를 위해 거래 데이터가 필요하기 때문
// TransactionList에서 props로 받는 대신 직접 store를 호출하는 방식 선택
// 이유: props로 받으면 TransactionList에서 추가 코드가 필요하고
//      CalendarView가 독립적으로 데이터를 관리하는 것이 더 간결하기 때문
import { useTransactionStore } from '@/stores/transactionStore';

const store = useTransactionStore();

const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

const currentDate = ref(new Date());

const year = computed(() => currentDate.value.getFullYear());
const month = computed(() => currentDate.value.getMonth());
const date = computed(() => currentDate.value.getDate());
const day = computed(() => currentDate.value.getDay());

const firstDay = computed(() => new Date(year.value, month.value, 1).getDay());
const lastDate = computed(() =>
  new Date(year.value, month.value + 1, 0).getDate(),
);

const calendarTable = computed(() => {
  const days = [];
  for (let i = 0; i < firstDay.value; i++) days.push('');
  for (let i = 1; i <= lastDate.value; i++) days.push(i);
  for (let i = days.length; i < 42; i++) days.push('');
  return days;
});

const prevYear = () => {
  currentDate.value = new Date(year.value - 1, month.value, date.value);
};
const prevMonth = () => {
  currentDate.value = new Date(year.value, month.value - 1, date.value);
};
const nextMonth = () => {
  currentDate.value = new Date(year.value, month.value + 1, date.value);
};
const nextYear = () => {
  currentDate.value = new Date(year.value + 1, month.value, date.value);
};
const goToday = () => {
  currentDate.value = new Date();
};

const getDayColor = (index) => {
  if (index % 7 === 0) return 'red';
  if (index % 7 === 6) return 'blue';
  return 'white';
};

const today = new Date();

// 기존 유지: 오늘 날짜 확인 ("오 늘" 노란색 텍스트용)
const isToday = (item) => {
  return (
    item === today.getDate() &&
    month.value === today.getMonth() &&
    year.value === today.getFullYear()
  );
};

// [추가] 부모(TransactionList)에서 선택된 날짜를 props로 받음
// 이유: 클릭한 날짜에 파란색 배경을 표시하려면
//      부모의 selectedDate를 자식이 알아야 하기 때문
const props = defineProps({
  selectedDate: Date,
});

// [추가] 클릭한 날짜가 선택된 날짜인지 확인 (파란색 배경용)
// 이유: isToday 대신 사용자가 클릭한 날짜를 기준으로 파란색 배경 표시
const isSelected = (item) => {
  if (!item || !props.selectedDate) return false;
  return (
    item === props.selectedDate.getDate() &&
    month.value === props.selectedDate.getMonth() &&
    year.value === props.selectedDate.getFullYear()
  );
};

// [추가] 해당 날짜에 수입 내역이 있는지 확인 (초록 dot용)
// 이유: store.transactions에서 해당 날짜 + type === 'income' 필터링
// item: 날짜 숫자 (1~31), year/month는 현재 달력 기준
const hasIncome = (item) => {
  if (!item) return false;
  return store.transactions.some((t) => {
    const d = new Date(t.date);
    return (
      t.type === 'income' &&
      d.getFullYear() === year.value &&
      d.getMonth() === month.value &&
      d.getDate() === item
    );
  });
};

// [추가] 해당 날짜에 지출 내역이 있는지 확인 (빨간 dot용)
// 이유: store.transactions에서 해당 날짜 + type === 'expense' 필터링
// item: 날짜 숫자 (1~31), year/month는 현재 달력 기준
const hasExpense = (item) => {
  if (!item) return false;
  return store.transactions.some((t) => {
    const d = new Date(t.date);
    return (
      t.type === 'expense' &&
      d.getFullYear() === year.value &&
      d.getMonth() === month.value &&
      d.getDate() === item
    );
  });
};

const emit = defineEmits(['selectDate']);
const onClickDate = (item) => {
  if (!item) return;
  emit('selectDate', { year: year.value, month: month.value + 1, day: item });
};

defineExpose({
  prevMonth,
  nextMonth,
  year,
  month,
  goToday,
});
</script>

<style scoped></style>
