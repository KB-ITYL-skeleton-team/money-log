<template>
  <div>
    <!-- width가 원래는 960px이었는데 700px로 수정하였다. -->
    <div style="width: 100%; margin: 0 auto">
      <div style="border: solid 1px black">
        <div>
          <!-- 2-3. 현재 날짜 보여주기  ===> TransactionList.vue로 직접 이동하여 출력
            사용자 설정에 보여주기
            년도 표기 2026 [4자리], 26[2자리]
            월 표기 1월, 01월 [1자리, 2자리]
            일 표기 8일 08일 [1자리 , 2자리]
            시간 표기 오전,오후 12시간제 , 24시간제 표기 [12시간제, 24시간제]
        -->

          <!-- <p>첫 날: {{ firstDay }}, 마지막 날 : {{ lastDate }}</p> -->
          <!-- <p>{{ calendarTable }}</p>a -->
          <div
            style="
              border: solid 2px black;
              display: grid;
              grid-template-columns: repeat(7, 1fr);
              text-align: center;
            "
          >
            <!-- 1-2. 월화수목금토일 화면에 보이기  -->
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
            <!-- 해당하는 날짜에 (작업일 기준 4월 9일) 영역전개 아니 영역 표시 (오늘을 알 수 있게) -->
            <div
              v-for="(item, index) in calendarTable"
              @click="onClickDate(item)"
              :key="index"
              :style="{
                border: '1px solid gray',
                height: '80px',
                textAlign: 'center',
                boxSizing: 'border-box',
                color: getDayColor(index),
                paddingTop: '4px',
                backgroundColor: isToday(item)
                  ? '#4a90e2'
                  : 'transparent' /* 추가: 오늘 날짜 파란색 배경 */,
              }"
            >
              {{ item }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const weekDays = ['일', '월', '화', '수', '목', '금', '토']; // 1-1. 월화수목금토일 값 주기

// 2-1 기준 날짜 가져오기
const currentDate = ref(new Date());

/* 
getFullYear()   // 연도 → 2026 
getMonth()      // 월 → 0~11 (4월이면 3)
getDate()       // 일 → 1~31
getDay()        // 요일 → 0~6 (일~토)
*/

// 2-2 연, 월, 일, 요일  가져오기
const year = computed(() => {
  return currentDate.value.getFullYear();
});
const month = computed(() => {
  return currentDate.value.getMonth();
});
const date = computed(() => {
  return currentDate.value.getDate();
});
const day = computed(() => {
  return currentDate.value.getDay();
});

// 3-1 현재 날짜의 첫 날, 마지막 날 구하기
const firstDay = computed(() => {
  return new Date(year.value, month.value, 1).getDay();
});
const lastDate = computed(() => {
  return new Date(year.value, month.value + 1, 0).getDate();
});

// 3-2 날짜 테이블 만들기 해당 월의 첫날 알아온후 앞의 날짜는 공백으로 처리

const calendarTable = computed(() => {
  const days = [];

  //   3-3 첫 날 기준으로 7일 만들기 (공백 표기하기)
  for (let i = 0; i < firstDay.value; i++) {
    days.push('');
  }

  //   3-4 1일부터 마지막 날짜까지
  for (let i = 1; i <= lastDate.value; i++) {
    days.push(i);
  }
  //     3-5 42칸 배열 만들기
  for (let i = days.length; i < 42; i++) {
    days.push('');
  }
  return days;
});

//   4-1 버튼 기능 추가 달,년 단위 전후로 표기
// JH ==> 우리 달력에는 필요 없음. 4월에서 5월 또는 3월처럼 이전 이후 월로 넘어가는 것을 구현해야함
/*
const prevYear = () => {
  currentDate.value = new Date(year.value - 1, month.value, 1);
};

const prevMonth = () => {
  currentDate.value = new Date(year.value, month.value - 1, 1);
  x``;
};

const nextMonth = () => {
  currentDate.value = new Date(year.value, month.value + 1, 1);
};

const nextYear = () => {
  currentDate.value = new Date(year.value + 1, month.value, 1);
};
*/
// 4-2 매월 1일이 아닌 현재 일자로부터 1년, 1달 계산
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
// 4-3 오늘 날짜로 돌아오기
const goToday = () => {
  currentDate.value = new Date();
};
// 4-4 공휴일 색 구분하기 - 기본색을 white로 변경
const getDayColor = (index) => {
  if (index % 7 === 0) return 'red';
  if (index % 7 === 6) return 'blue';
  return 'white'; // 변경: black → white
};

// 오늘 날짜 객체 => 파란색으로 영역 전개
const today = new Date();

// 현재 셀이 오늘 날짜인지 확인
const isToday = (item) => {
  return (
    item === today.getDate() &&
    month.value === today.getMonth() &&
    year.value === today.getFullYear()
  );
};

// 달력 날짜 클릭 하면 오른쪽에 반환해주는 이벤트 정리
// 1. 부모로 날짜 전달하는 emit 정의
const emit = defineEmits(['selectDate']);

// 2. 날짜 클릭시 부모로 날짜 전달
const onClickDate = (item) => {
  if (!item) return;
  emit('selectDate', { year: year.value, month: month.value + 1, day: item });
};

// 부모 컴포넌트에서 호출할 수 있도록 메서드 노출
defineExpose({
  prevMonth,
  nextMonth,
  year, // 추가: 연도 노출
  month, // 추가: 월 노출
  goToday, // 추가 : 홈에서 다른 월로 이동 시, 홈 버튼 누르면 다시 refresh => 부모에서 오늘 날짜로 초기화 호출 가능
});
</script>

<style scoped></style>
