import { defineStore } from 'pinia';
import { ref, computed, watchEffect } from 'vue';
import axios from 'axios';
import { useLoginStore } from './userStore';

export const useTransactionsStore = defineStore('Transactions', () => {
  // 변수 설정
  const login = useLoginStore();
  const loading = ref(true);
  const transactions = ref([]);
  const categories = ref([]);
  const budgets = ref([]);

  // 서버 데이터 조회
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

  // 서버 데이터 재조회
  const init = async () => {
    await fetchData();
  };

  // 유저 아이디 연결
  const userID = computed(() => {
    return login.currentUser?.userId;
  });

  // 유저별 수입
  const income = computed(() => {
    if (!userID.value) {
      return [];
    }
    return transactions.value.filter(
      (transaction) =>
        transaction.type === 'income' && transaction.userId === userID.value,
    );
  });

  // 유저별 지출
  const expense = computed(() => {
    if (!userID.value) {
      return [];
    }
    return transactions.value.filter(
      (transaction) =>
        transaction.type === 'expense' && transaction.userId === userID.value,
    );
  });

  // 유저별 예산
  const budget = computed(() => {
    return budgets.value.find((budget) => budget.userId === userID.value);
  });

  // 선택한 년, 월 초기화
  const selectedMonth = ref(new Date().toISOString().slice(0, 7));
  const selectedYear = ref(new Date().toISOString().slice(0, 4));

  // 유저별 월 수입 총액
  const totalIncomeM = computed(() => {
    if (!income.value) {
      return 0;
    }
    return income.value
      .filter((income) => income.date?.slice(0, 7) === selectedMonth.value)
      .reduce((sum, income) => sum + (income.amount || 0), 0);
  });

  // 유저별 월 지출 총액
  const totalExpenseM = computed(() => {
    if (!expense.value) {
      return 0;
    }
    return expense.value
      .filter((expense) => expense.date?.slice(0, 7) === selectedMonth.value)
      .reduce((sum, expense) => sum + (expense.amount || 0), 0);
  });

  // 유저별 월 예산 총액
  const totalBudgetM = computed(() => {
    if (!budgets.value) {
      return 0;
    }
    const budgetForMonth = budgets.value.find(
      (budget) =>
        budget.userId === userID.value && budget.month === selectedMonth.value,
    );
    return budgetForMonth ? budgetForMonth.amount : 0;
  });

  // 유저별 월 예산 잔액
  const totalBalanceM = computed(() => {
    return totalBudgetM.value - totalExpenseM.value;
  });

  // 유저별 월 예산 대비 지출, 잔액 퍼센티지
  const percentageExpenseM = computed(() => {
    if (!totalBudgetM.value) {
      return 0;
    }
    return (totalExpenseM.value / totalBudgetM.value) * 100;
  });
  const percentageBalanceM = computed(() => {
    if (!totalBudgetM.value) {
      return 0;
    }
    return (
      ((totalBudgetM.value - totalExpenseM.value) / totalBudgetM.value) * 100
    );
  });

  return {
    fetchData,
    init,
    login,
    userID,
    transactions,
    categories,
    budgets,
    income,
    expense,
    budget,
    selectedMonth,
    selectedYear,
    totalIncomeM,
    totalExpenseM,
    totalBudgetM,
    totalBalanceM,
    percentageExpenseM,
    percentageBalanceM,
  };
});
