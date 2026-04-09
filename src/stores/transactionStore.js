import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

// API 요청의 기본 서버 주소
const API_BASE_URL = 'http://localhost:3000';

/**
 * fetch 요청을 보내고 JSON 응답을 반환합니다.
 * @param {string} url - 요청 URL
 * @param {RequestInit} options - fetch 옵션(method, headers, body 등)
 * @returns {Promise<any>}
 */
const requestJson = async (url, options = {}) => {
  // 전달받은 URL/옵션으로 HTTP 요청
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`요청에 실패했습니다. (${response.status})`);
  }

  return response.json();
};

// 허용하는 거래 타입(수입/지출)
const VALID_TYPES = ['income', 'expense'];

// 타입별 고정 분류 버튼 목록
const CATEGORY_MAP = {
  income: [
    // db.json categories 기준(id: 1,2)
    { id: 1, name: '월급' },
    { id: 2, name: '용돈' },
    // db.json에는 아직 없는 분류(필요하면 categories에 추가)
    { id: 5, name: '기타수입' },
  ],
  expense: [
    // db.json categories 기준(id: 3,4)
    { id: 3, name: '식비' },
    { id: 4, name: '교통' },
    // db.json에는 아직 없는 분류(필요하면 categories에 추가)
    { id: 6, name: '문화' },
    { id: 7, name: '술' },
    { id: 8, name: '기타' },
  ],
};

// 거래 입력 폼의 초기 상태를 생성
const createInitialForm = () => ({
  date: new Date().toISOString().slice(0, 10),
  amount: '',
  categoryId: null,
  asset: '',
  memo: '',
});

export const useTransactionStore = defineStore('transaction', () => {
  // 서버에서 불러온 거래 목록
  const transactions = ref([]);
  // 서버에서 불러온 카테고리 목록
  const categories = ref([]);
  // 조회/저장 같은 비동기 처리 공통 로딩 상태
  const isLoading = ref(false);
  // API 호출 실패 메시지
  const errorMessage = ref('');

  // 현재 선택된 탭 타입
  const activeType = ref('expense');
  // 마지막으로 선택한 타입(수입/지출/이체)
  const lastSelectedType = ref('income');
  // 타입 버튼 클릭 횟수(향후 통계/분석에 사용)
  const typeClickCount = ref({
    income: 0,
    expense: 0,
  });
  // 화면 입력값(날짜, 금액, 분류, 자산, 내용)
  const form = ref(createInitialForm());
  // 저장 요청 전용 로딩 상태
  const isSaving = ref(false);

  // 자산 선택 고정 옵션
  const assetOptions = ['현금', '은행', '카드'];

  // categories를 type 기준으로 묶어서 { income: [], expense: [] } 형태로 제공
  const categoriesByType = computed(() => {
    return categories.value.reduce((acc, category) => {
      if (!acc[category.type]) acc[category.type] = [];
      acc[category.type].push(category);
      return acc;
    }, {});
  });

  // 상단 제목(선택 탭에 따라 수입/지출/이체 반환)
  const pageTitle = computed(() => {
    if (activeType.value === 'expense') return '지출';

    return '수입';
  });

  // 현재 탭에 맞는 카테고리 목록만 필터링해서 반환
  const categoryOptions = computed(() => {
    return CATEGORY_MAP[activeType.value] || [];
  });

  // 금액 표시용 포맷("1,000원"), 비어있으면 "0원"
  const displayAmount = computed(() => {
    if (!form.value.amount) return '0원';
    return `${Number(form.value.amount).toLocaleString('ko-KR')}원`;
  });

  // 선택된 분류명(화면 표시용). form은 categoryId를 들고, name은 여기서 계산
  const selectedCategoryName = computed(() => {
    if (!form.value.categoryId) return '';
    const selected = categoryOptions.value.find(
      (item) => item.id === form.value.categoryId,
    );
    return selected?.name || '';
  });

  // 수입 거래 목록(전체 transactions에서 income만 필터)
  const incomeTransactions = computed(() =>
    transactions.value.filter((item) => item.type === 'income'),
  );

  // 지출 거래 목록(전체 transactions에서 expense만 필터)
  const expenseTransactions = computed(() =>
    transactions.value.filter((item) => item.type === 'expense'),
  );

  // 총 수입(수입 거래 amount 합계)
  const totalIncome = computed(() =>
    incomeTransactions.value.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0,
    ),
  );

  // 총 지출(지출 거래 amount 합계)
  const totalExpense = computed(() =>
    expenseTransactions.value.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0,
    ),
  );

  // 현재 잔고(총 수입 - 총 지출). 이체는 잔고 계산에 포함하지 않는 정책
  const currentBalance = computed(() => totalIncome.value - totalExpense.value);

  // 폼/필드/패널을 초기 상태로 재설정
  const resetForm = () => {
    form.value = createInitialForm();
  };

  // type(income/expense/transfer)을 받아 탭 변경 + 폼 초기화
  const setActiveType = (type) => {
    if (!VALID_TYPES.includes(type)) return;
    typeClickCount.value[type] += 1;
    lastSelectedType.value = type;
    activeType.value = type;
    resetForm();
  };

  // 탭 타입 변경 후 해당 타입 거래 목록을 자동 조회
  const applyTypeFilter = async (type) => {
    setActiveType(type);
    await fetchTransactions({ type: activeType.value });
  };

  // 거래 목록 조회: params(type 등)를 받아 /transactions GET 호출
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

  // 카테고리 목록 조회: /categories GET 호출
  const fetchCategories = async () => {
    categories.value = Object.values(CATEGORY_MAP).flat();
  };

  // 거래 저장: payload를 받아 /transactions POST 호출 후 목록 앞에 추가
  const createTransaction = async (payload) => {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      const data = await requestJson(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
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

  // 현재 form 상태를 검증 후 저장 payload를 만들어 createTransaction 호출
  const saveTransaction = async () => {
    if (!form.value.amount || !form.value.categoryId) return false;

    isSaving.value = true;
    try {
      // 서버로 보낼 저장 payload (나중에 통계/필터링에 그대로 사용 가능)
      const payload = {
        userId: 1,
        type: activeType.value,
        categoryId: form.value.categoryId,
        amount: Number(form.value.amount),
        memo: form.value.memo,
        date: form.value.date,
        // NOTE: db.json의 transactions에는 asset 필드가 없음(필요하면 스키마에 추가해야 함)
        asset: form.value.asset || null,
      };

      // 저장 요청 직전 payload 확인용 로그
      console.log('[SAVE] payload:', payload);

      // 실제 저장(POST)
      const saved = await createTransaction(payload);
      console.log('[SAVE] saved response:', saved);

      resetForm();
      return true;
    } finally {
      isSaving.value = false;
    }
  };

  // 컴포넌트에서 사용할 상태값/계산값/액션을 외부로 노출
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
  };
});
