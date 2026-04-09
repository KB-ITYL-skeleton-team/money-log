// 거래 스토어(Pinia): 상태(state) + 계산값(getter) + 액션(action)
import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

// API 기본 주소(json-server)
const API_BASE_URL = 'http://localhost:3000';

// 로컬스토리지 사용 userId 값을 스토리지에 저장
const LOGIN_USER_KEY = 'loginUser';

const getCurrentUserId = () => {
  const raw = localStorage.getItem(LOGIN_USER_KEY);
  if (!raw) return null;

  try {
    const parsedUser = JSON.parse(raw);
    const userId = parsedUser?.userId; // db.json의 users.userId ("usr_...")
    if (typeof userId !== 'string') return null;

    const trimmed = userId.trim();
    if (!trimmed) return null;

    return trimmed;
  } catch {
    return null;
  }
};

// 공통 HTTP 함수(axios): 응답의 `data`만 반환
const requestJson = async (url, config = {}) => {
  try {
    const response = await axios.request({ url, ...config });
    return response.data;
  } catch (error) {
    const status = error?.response?.status;
    if (status) {
      throw new Error(`요청에 실패했습니다. (${status})`);
    }
    throw new Error('요청에 실패했습니다.');
  }
};

// 상수
const VALID_TYPES = ['income', 'expense'];

// 분류(카테고리) 목록(UI 표시용)
const CATEGORY_MAP = {
  income: [
    { id: 1, name: '월급' },
    { id: 2, name: '용돈' },
    { id: 5, name: '기타수입' },
  ],
  expense: [
    { id: 3, name: '식비' },
    { id: 4, name: '교통' },
    { id: 6, name: '문화' },
    { id: 7, name: '술' },
    { id: 8, name: '기타' },
  ],
};

// 폼 초기값 생성 함수
const createInitialForm = () => ({
  date: new Date().toISOString().slice(0, 10),
  amount: '',
  categoryId: null,
  asset: '',
  memo: '',
});

export const useTransactionStore = defineStore('transaction', () => {
  // 상태(state)
  const transactions = ref([]);
  const categories = ref([]);
  const isLoading = ref(false);
  const errorMessage = ref('');

  // UI 상태(state)
  const activeType = ref('expense');
  const lastSelectedType = ref('income');
  const typeClickCount = ref({
    income: 0,
    expense: 0,
  });
  const form = ref(createInitialForm());
  const isSaving = ref(false);

  // 옵션(선택지)
  const assetOptions = ['현금', '은행', '카드'];

  // 계산값(getter = computed)
  const categoriesByType = computed(() => {
    return categories.value.reduce((acc, category) => {
      if (!acc[category.type]) acc[category.type] = [];
      acc[category.type].push(category);
      return acc;
    }, {});
  });

  const pageTitle = computed(() => {
    if (activeType.value === 'expense') return '지출';

    return '수입';
  });

  const categoryOptions = computed(() => {
    return CATEGORY_MAP[activeType.value] || [];
  });

  const displayAmount = computed(() => {
    if (!form.value.amount) return '0원';
    return `${Number(form.value.amount).toLocaleString('ko-KR')}원`;
  });

  const selectedCategoryName = computed(() => {
    if (!form.value.categoryId) return '';
    const selected = categoryOptions.value.find(
      (item) => item.id === form.value.categoryId,
    );
    return selected?.name || '';
  });

  const incomeTransactions = computed(() =>
    transactions.value.filter((item) => item.type === 'income'),
  );

  const expenseTransactions = computed(() =>
    transactions.value.filter((item) => item.type === 'expense'),
  );

  const totalIncome = computed(() =>
    incomeTransactions.value.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0,
    ),
  );

  const totalExpense = computed(() =>
    expenseTransactions.value.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0,
    ),
  );

  const currentBalance = computed(() => totalIncome.value - totalExpense.value);

  // 액션(action = 메서드)
  const resetForm = () => {
    form.value = createInitialForm();
  };

  const setActiveType = (type) => {
    if (!VALID_TYPES.includes(type)) return;
    typeClickCount.value[type] += 1;
    lastSelectedType.value = type;
    activeType.value = type;
    resetForm();
  };

  const applyTypeFilter = async (type) => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) {
      transactions.value = [];
      errorMessage.value = '로그인이 필요합니다.';
      return;
    }

    setActiveType(type);
    await fetchTransactions({ userId: currentUserId }); // ✅ type 제거
  };

  const fetchTransactions = async (params = {}) => {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return;
        searchParams.append(key, value);
      });
      const query = searchParams.toString();
      const url = `${API_BASE_URL}/transactions${query ? `?${query}` : ''}`;
      const data = await requestJson(url);
      transactions.value = data;
    } catch (error) {
      errorMessage.value = error.message || '거래 내역을 불러오지 못했습니다.';
    } finally {
      isLoading.value = false;
    }
  };

  const fetchCategories = async () => {
    categories.value = Object.values(CATEGORY_MAP).flat();
  };

  const createTransaction = async (payload) => {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      const data = await requestJson(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        data: payload,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      transactions.value.unshift(data);
      return data;
    } catch (error) {
      errorMessage.value = error.message || '거래 저장에 실패했습니다.';
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const saveTransaction = async () => {
    if (
      !form.value.date ||
      Number(form.value.amount) <= 0 ||
      !form.value.categoryId ||
      !form.value.asset ||
      !form.value.memo
    ) {
      return false;
    }

    isSaving.value = true;
    //스토리지 확인 코드
    const currentUserId = getCurrentUserId();
    if (!currentUserId) {
      errorMessage.value = '로그인이 필요합니다.';
      return false;
    }

    try {
      const payload = {
        userId: currentUserId,
        type: activeType.value,
        categoryId: form.value.categoryId,
        amount: Number(form.value.amount),
        memo: form.value.memo,
        date: form.value.date,
        asset: form.value.asset || null,
      };

      console.log('[SAVE] payload:', payload);

      const saved = await createTransaction(payload);
      console.log('[SAVE] saved response:', saved);

      resetForm();
      return true;
    } finally {
      isSaving.value = false;
    }
  };

  return {
    transactions,
    categories,
    isLoading,
    errorMessage,
    activeType,
    lastSelectedType,
    typeClickCount,
    form,
    isSaving,
    assetOptions,
    categoriesByType,
    pageTitle,
    categoryOptions,
    displayAmount,
    selectedCategoryName,
    incomeTransactions,
    expenseTransactions,
    totalIncome,
    totalExpense,
    currentBalance,
    setActiveType,
    applyTypeFilter,
    fetchTransactions,
    fetchCategories,
    createTransaction,
    saveTransaction,
    resetForm,
    getCurrentUserId,
  };
});
