<template>
  <div></div>
  <input type="month" v-model="inputMonth" />
  <input type="number" v-model="budgetAmount" />
  <button v-on:click="createBudget">저장하기</button>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';
import { useTransactionsStore } from '@/stores/stores.js';
import { storeToRefs } from 'pinia';

export default {
  setup() {
    const transactions = useTransactionsStore();
    const { userID, budget } = storeToRefs(transactions);
    const budgetAmount = ref(0);
    const inputMonth = ref(new Date().toISOString().slice(0, 7));
    const createBudget = async () => {
      try {
        if (!userID.value) return;

        let response = await axios.get('http://localhost:3000/budgets', {
          params: { userId: userID.value, month: inputMonth.value },
        });

        if (response.data.length > 0) {
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

        console.log(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    return { inputMonth, budgetAmount, transactions, budget, createBudget };
  },
};
</script>

<style lang="scss" scoped></style>
