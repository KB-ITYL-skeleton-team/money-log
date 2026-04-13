<template>
  <div class="budget">
    <div class="c">
      <input type="month" v-model="selectedMonth" />
      <div class="text"><p>의 예산을</p></div>
    </div>
    <div class="c">
      <p class="text t">₩</p>
      <input
        type="number"
        v-model="budgetAmount"
        v-on:keydown.enter="createBudget"
        step="100"
      />
      <p class="text t">으로</p>
      <button v-on:click="createBudget">설정하기</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { storeToRefs } from 'pinia';
import { useTransactionsStore } from '@/stores/staticsStores.js';

export default {
  name: 'Budget',
  setup() {
    // store 사용
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
    const isLoading = ref(false);

    // 변수 변화시 창 새로고침
    const reload = (month) => {
      selectedMonth.value = month;
    };
    onMounted(() => {
      transactions.init();
    });
    // 입력 예산 저장 변수
    const budgetAmount = ref(0);
    watch(totalBudgetM, (val) => {
      budgetAmount.value = val;
    });

    // 서버에 예산 입력
    const createBudget = async () => {
      try {
        if (!userID.value) return;
        if (budgetAmount.value < 0) {
          alert('0 원 이상의 예산을 입력해주세요');
          return;
        }
        if (isLoading.value) return;
        isLoading.value = true;

        let response = await axios.get('http://localhost:3000/budgets', {
          params: { userId: userID.value, month: selectedMonth.value },
        });

        if (response.data.length > 0) {
          const target = response.data[0];
          response = await axios.patch(
            `http://localhost:3000/budgets/${target.id}`,
            { amount: Number(budgetAmount.value) },
          );
        } else {
          response = await axios.post('http://localhost:3000/budgets', {
            userId: userID.value,
            month: selectedMonth.value,
            amount: Number(budgetAmount.value),
          });
        }
        await transactions.init();
        const [year, month] = selectedMonth.value.split('-');
        alert(
          `${year}년 ${month}월 예산이 ${budgetAmount.value}원으로 저장되었습니다.`,
        );
      } catch (err) {
        console.error(err);
      } finally {
        isLoading.value = false;
      }
    };

    return {
      reload,
      createBudget,
      userID,
      budget,
      budgetAmount,
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

<style scoped lang="scss">
.budget {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: clamp(10px, 4vw, 15px);
  color: rgba(250, 204, 21, 0.45);
  background: #020617;
  border-radius: 5%;
  flex-wrap: wrap;
  margin-top: -75px;
}
.c {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: clamp(10px, 4vw, 15px);
}

input {
  background: #020617;
  border: 1px solid rgba(250, 204, 21, 0.7);
  color: rgba(250, 204, 21, 0.7);
  border-radius: 10px;
  margin: 10px;
  cursor: pointer;
}
button {
  background: #020617;
  border: 1px solid rgba(250, 204, 21, 0.7);
  color: rgba(250, 204, 21, 0.7);
  border-radius: 10px;
}
.text {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 15px;
  margin: 10px;
}

.t {
  margin-top: -7px;
}
</style>
