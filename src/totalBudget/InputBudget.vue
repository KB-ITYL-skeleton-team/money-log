<template>
  <div class="content">
    <p class="text">₩</p>
    <input
      type="number"
      v-model="budgetAmount"
      v-on:keydown.enter="createBudget"
      min="o"
    />
    <p class="text">으로</p>
    <button v-on:click="createBudget">설정하기</button>
  </div>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';
import { useTransactionsStore } from '@/stores/staticsStores.js';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

export default {
  setup(porps, { emit }) {
    const transactions = useTransactionsStore();
    const { userID, budget, selectedMonth } = storeToRefs(transactions);
    const budgetAmount = ref(0);
    const inputMonth = selectedMonth;

    const createBudget = async () => {
      try {
        if (!userID.value) return;

        if (budgetAmount.value <= 0) {
          alert('0 원 이상의 예산을 입력해주세요');
          return;
        }

        let response = await axios.get('http://localhost:3000/budgets', {
          params: { userId: userID.value, month: inputMonth.value },
        });

        if (response.data.length > 0 || budgetAmount.value <= 0) {
          const target = response.data[0];

          response = await axios.patch(
            `http://localhost:3000/budgets/${target.id}`,
            {
              amount: Number(budgetAmount.value),
            },
          );
        } else {
          response = await axios.post('http://localhost:3000/budgets', {
            userId: userID.value,
            month: inputMonth.value,
            amount: Number(budgetAmount.value),
          });
        }
        await transactions.init();
        emit('reloadPage', inputMonth.value);

        console.log(response.data);
        alert(
          `${inputMonth.value}월 의 예산이 ${budgetAmount.value} 로 저장되었습니다.`,
        );
      } catch (err) {
        console.error(err);
      }
    };

    onMounted(() => {
      transactions.init();
    });

    return {
      inputMonth,
      budgetAmount,
      transactions,
      budget,
      createBudget,
    };
  },
};
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
}

.text {
  display: flex;
  align-items: center;
  justify-content: center;

  margin: 10px;
}
input {
  background: #020617;
  border: 1px solid rgba(250, 204, 21, 0.45);
  color: rgba(250, 204, 21, 0.45);
  border-radius: 10px;
  cursor: pointer;
}
button {
  background: #020617;
  border: 1px solid rgba(250, 204, 21, 0.45);
  color: rgba(250, 204, 21, 0.45);
  border-radius: 10px;
}
</style>
