import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
// import data from '../../dummy_db.json';
import axios from 'axios';
import { useLoginStore } from './userStore';
import { watchEffect } from 'vue';

export const useTransactionsStore = defineStore('Transactions', () => {
  // const login = useLoginStore();
  // const transactions = ref(data.transactions);
  // const categories = ref(data.categories);

  const login = useLoginStore();
  const transactions = ref([]);
  const categories = ref([]);
  const budgets = ref([]);

  const loading = ref(true);

  const fetchData = async () => {
    loading.value = true;
    try {
      const [tRes, cRes, bRes] = await Promise.all([
        axios.get('http://localhost:3000/transactions'),
        axios.get('http://localhost:3000/categories'),
        axios.get('http://localhost:3000/budgets'),
      ]);

      transactions.value = tRes.data;
      categories.value = cRes.data;
      budgets.value = bRes.data;
    } finally {
      loading.value = false;
    }
  };

  const init = async () => {
    await fetchData();
  };

  const userID = computed(() => {
    return login.currentUser?.userId;
  });
  watchEffect(() => {
    console.log('user:', userID.value);
  });

  // income
  const income = computed(() => {
    return transactions.value.filter(
      (transaction) =>
        transaction.type === 'income' && transaction.userId === userID.value,
    );
  });

  // expense
  const expense = computed(() => {
    return transactions.value.filter(
      (transaction) =>
        transaction.type === 'expense' && transaction.userId === userID.value,
    );
  });

  // budget
  const budget = computed(() => {
    return budgets.value.find((budget) => budget.userId === userID.value);
  });

  const selectedMonth = ref(new Date().toISOString().slice(0, 7));

  return {
    fetchData,
    init,
    login,
    userID,
    transactions,
    categories,
    income,
    expense,
    budgets,
    budget,
    selectedMonth,
  };
});
