// 거래 스토어(Pinia): 상태(state) + 계산값(getter) + 액션(action)
import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

// API 기본 주소(json-server)
const API_BASE_URL = 'http://localhost:3000';

// [Auth] localStorage에 저장된 로그인 유저(loginUser)에서 userId("usr_...")를 꺼내는 용도
// - 거래 저장/조회 시 "누구의 데이터인지"를 구분하는 기준값으로 사용
// - 로그인 상태가 아니면 null을 반환하도록 만들어, 화면/저장 로직에서 가드 처리 가능
const LOGIN_USER_KEY = 'loginUser';

// localStorage(loginUser) -> JSON 파싱 -> userId 문자열 반환
// - 반환 예: "usr_d4e5f6"
// - loginUser가 없거나 JSON이 깨졌거나 userId가 비어있으면 null
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
  // [State] 서버에서 불러온 "내 전체 거래 목록"(수입+지출). 합계/목록 UI의 원본 데이터
  const transactions = ref([]);
  const categories = ref([]);
  const isLoading = ref(false);
  const errorMessage = ref('');

  // UI 상태(state)
  // [UI State] 현재 입력/탭 상태 (income | expense) - 조회조건이 아니라 화면/폼 기준
  const activeType = ref('expense');
  const lastSelectedType = ref('income');
  const typeClickCount = ref({
    income: 0,
    expense: 0,
  });
  const form = ref(createInitialForm());
  const isSaving = ref(false);
  // [Edit State] 수정 모드인지 여부와 대상 거래 id
  // - editingTransactionId가 null이면 "새 거래 등록"
  // - 값이 있으면 "해당 id 거래를 수정" (폼 값 유지 + PATCH 저장)
  const editingTransactionId = ref(null);
  const isEditing = computed(() => Boolean(editingTransactionId.value));

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

  // [Computed] transactions(전체)에서 타입별로 합계 계산 -> 총수입/총지출/잔액
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
      // [API] 거래 목록 조회(GET). userId/type 등 query param으로 필터링 가능(json-server)
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

  // 거래 1건 조회(GET /transactions/:id)
  // - 수정 화면 진입 시, DB에서 최신 데이터를 가져와 form에 채우기 위해 사용
  const fetchTransactionById = async (transactionId) => {
    return await requestJson(`${API_BASE_URL}/transactions/${transactionId}`);
  };

  // 수정 모드 시작: 특정 거래를 불러와서 form에 그대로 채우고, editingTransactionId를 세팅
  // - transactionId: 클릭한 거래의 id(route query.editId로 전달)
  // - 본인(userId) 거래인지 확인해서, 타인 데이터 수정이 발생하지 않게 가드
  const startEditTransaction = async (transactionId) => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) throw new Error('로그인이 필요합니다.');

    const tx = await fetchTransactionById(transactionId);

    // 내 거래인지 확인(중요)
    if (String(tx.userId) !== String(currentUserId)) {
      throw new Error('본인 거래만 수정할 수 있습니다.');
    }

    editingTransactionId.value = tx.id;

    // 수정 모드에서는 resetForm()이 끼어들면 안 되므로 activeType은 직접 세팅
    activeType.value = tx.type;

    // 서버 데이터 -> 폼 상태로 매핑
    form.value = {
      date: tx.date ?? new Date().toISOString().slice(0, 10),
      amount: String(tx.amount ?? ''),
      categoryId: tx.categoryId ?? null,
      asset: tx.asset ?? tx.assets ?? '', // db.json에 assets로 들어간 데이터도 대응
      memo: tx.memo ?? '',
    };
  };

  // 수정 모드 종료: editingTransactionId 해제 + 폼 초기화(새 등록 상태로 복귀)
  // - '+' 버튼으로 새 거래 등록을 시작할 때도 이 함수를 호출해 상태 충돌을 방지
  const clearEditTransaction = () => {
    editingTransactionId.value = null;
    resetForm();
  };

  const createTransaction = async (payload) => {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      // [API] 거래 저장(POST). payload에 userId를 포함해서 DB에 저장
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

  // 거래 수정(PATCH /transactions/:id)
  // - 수정 모드에서 저장 버튼을 눌렀을 때 실행됨
  const updateTransaction = async (transactionId, payload) => {
    return await requestJson(`${API_BASE_URL}/transactions/${transactionId}`, {
      method: 'PATCH',
      data: payload,
      headers: { 'Content-Type': 'application/json' },
    });
  };
  // 삭제 버튼 실행 함수
  const deleteTransaction = async (transactionId) => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) throw new Error('로그인이 필요합니다.');

    // 본인 거래인지 확인
    const tx = await fetchTransactionById(transactionId);
    if (String(tx.userId) !== String(currentUserId)) {
      throw new Error('본인 거래만 삭제할 수 있습니다.');
    }

    await requestJson(`${API_BASE_URL}/transactions/${transactionId}`, {
      method: 'DELETE',
    });

    // 화면 상태에서도 제거
    transactions.value = transactions.value.filter(
      (t) => String(t.id) !== String(transactionId),
    );

    // 삭제한 게 현재 수정 중이면 수정모드 종료
    if (String(editingTransactionId.value) === String(transactionId)) {
      clearEditTransaction();
    }

    return true;
  };

  const saveTransaction = async () => {
    // [Action] 폼 검증 -> userId 확인 -> payload 생성 -> (등록/수정) 저장 처리
    // - editingTransactionId가 있으면 PATCH(수정), 없으면 POST(등록)
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

      // 수정 모드: PATCH로 업데이트 + store.transactions에 반영 후 수정 모드 종료
      if (editingTransactionId.value) {
        const updated = await updateTransaction(
          editingTransactionId.value,
          payload,
        );

        // store.transactions 배열에서도 해당 항목을 최신으로 교체
        const idx = transactions.value.findIndex(
          (t) => String(t.id) === String(updated.id),
        );
        if (idx !== -1) transactions.value[idx] = updated;

        clearEditTransaction();
        return true;
      }

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
    editingTransactionId,
    isEditing,
    startEditTransaction,
    clearEditTransaction,
    deleteTransaction,
  };
});
