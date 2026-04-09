import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const buildUrl = (path, params = {}) => {
  const url = new URL(path, API_BASE_URL);
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    searchParams.append(key, value);
  });

  const query = searchParams.toString();
  if (query) {
    url.search = query;
  }

  return url.toString();
};

const requestJson = async (path, options = {}) => {
  const response = await fetch(path, options);

  if (!response.ok) {
    let message = `요청에 실패했습니다. (${response.status})`;
    try {
      const errorBody = await response.json();
      message = errorBody?.message || message;
    } catch {
      // JSON 본문이 아니면 기본 에러 메시지 사용
    }
    throw new Error(message);
  }

  return response.json();
};

// 허용하는 거래 타입(수입/지출/이체)
const VALID_TYPES = ['income', 'expense', 'transfer'];

// 거래 입력 폼의 초기 상태를 생성
const createInitialForm = () => ({
  date: new Date().toISOString().slice(0, 10),
  amount: '',
  category: '',
  asset: '',
  content: '',
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
  // 현재 사용자가 선택한 입력 필드
  const activeField = ref('amount');
  // 하단 입력 패널 종류(number/date/category/asset/text)
  const panelType = ref('number');
  // 화면 입력값(날짜, 금액, 분류, 자산, 내용)
  const form = ref(createInitialForm());
  // 저장 요청 전용 로딩 상태
  const isSaving = ref(false);
  // 계산기 모달 노출 여부
  const isCalculatorOpen = ref(false);
  // 계산기에서 입력 중인 값
  const calculatorValue = ref('');

  // 자산 선택 고정 옵션
  const assetOptions = ['현금', '은행', '카드'];
  // 숫자 키패드 버튼 값
  const keypadDigits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

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
    if (activeType.value === 'income') return '수입';
    if (activeType.value === 'transfer') return '이체';
    return '지출';
  });

  // 현재 탭에 맞는 카테고리 목록만 필터링해서 반환
  const categoryOptions = computed(() => {
    return categoriesByType.value[activeType.value] || [];
  });

  // 금액 표시용 포맷("1,000원"), 비어있으면 "0원"
  const displayAmount = computed(() => {
    if (!form.value.amount) return '0원';
    return `${Number(form.value.amount).toLocaleString('ko-KR')}원`;
  });

  // 폼/필드/패널을 초기 상태로 재설정
  const resetForm = () => {
    form.value = createInitialForm();
    activeField.value = 'amount';
    panelType.value = 'number';
  };

  // type(income/expense/transfer)을 받아 탭 변경 + 폼 초기화
  const setActiveType = (type) => {
    if (!VALID_TYPES.includes(type)) return;
    activeType.value = type;
    resetForm();
  };

  // field(date/amount/category/asset/content)를 받아 활성 필드 및 하단 패널 전환
  const setActiveField = (field) => {
    activeField.value = field;
    if (field === 'date') panelType.value = 'date';
    if (field === 'amount') panelType.value = 'number';
    if (field === 'category') panelType.value = 'category';
    if (field === 'asset') panelType.value = 'asset';
    if (field === 'content') panelType.value = 'text';
  };

  // 숫자 키패드 digit(문자)를 받아 금액 문자열 뒤에 추가
  const appendAmount = (digit) => {
    if (activeField.value !== 'amount') return;
    form.value.amount = `${form.value.amount}${digit}`;
  };

  // 금액 문자열 마지막 한 글자 삭제
  const deleteAmount = () => {
    form.value.amount = form.value.amount.slice(0, -1);
  };

  // 입력 완료 처리(활성 필드 해제)
  const doneInput = () => {
    activeField.value = '';
  };

  // date input 값(YYYY-MM-DD)을 받아 form.date 갱신
  const updateDate = (value) => {
    form.value.date = value;
  };

  // 내용 textarea 문자열을 받아 form.content 갱신
  const updateContent = (value) => {
    form.value.content = value;
  };

  // 선택된 category 객체를 받아 카테고리명 반영 + 필드 선택 해제
  const selectCategory = (category) => {
    form.value.category = category.name;
    activeField.value = '';
  };

  // 선택된 자산 문자열(현금/은행/카드)을 반영 + 필드 선택 해제
  const selectAsset = (asset) => {
    form.value.asset = asset;
    activeField.value = '';
  };

  // 계산기 모달 열기 + 현재 금액을 계산기 입력값으로 복사
  const openCalculator = () => {
    isCalculatorOpen.value = true;
    calculatorValue.value = form.value.amount;
  };

  // 계산기 모달 닫기
  const closeCalculator = () => {
    isCalculatorOpen.value = false;
  };

  // 계산기 결과값을 금액에 반영하고 모달 닫기
  const applyCalculatorValue = () => {
    form.value.amount = calculatorValue.value;
    closeCalculator();
  };

  // 거래 목록 조회: params(type 등)를 받아 /transactions GET 호출
  const fetchTransactions = async (params = {}) => {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      const data = await requestJson(buildUrl('/transactions', params));
      transactions.value = data;
    } catch (error) {
      errorMessage.value = error.message || '거래 내역을 불러오지 못했습니다.';
    } finally {
      isLoading.value = false;
    }
  };

  // 카테고리 목록 조회: /categories GET 호출
  const fetchCategories = async () => {
    try {
      const data = await requestJson(buildUrl('/categories'));
      categories.value = data;
    } catch (error) {
      errorMessage.value = error.message || '분류를 불러오지 못했습니다.';
    }
  };

  // 거래 저장: payload를 받아 /transactions POST 호출 후 목록 앞에 추가
  const createTransaction = async (payload) => {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      const data = await requestJson(buildUrl('/transactions'), {
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
    if (!form.value.amount || !form.value.category) return false;

    const selectedCategory = categoryOptions.value.find(
      (item) => item.name === form.value.category,
    );

    isSaving.value = true;
    try {
      await createTransaction({
        userId: 1,
        type: activeType.value,
        categoryId: selectedCategory?.id || null,
        amount: Number(form.value.amount),
        memo: form.value.content,
        date: form.value.date,
        asset: form.value.asset || null,
      });
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
    activeField,
    panelType,
    form,
    isSaving,
    isCalculatorOpen,
    calculatorValue,
    assetOptions,
    keypadDigits,
    categoriesByType,
    pageTitle,
    categoryOptions,
    displayAmount,
    setActiveType,
    setActiveField,
    appendAmount,
    deleteAmount,
    doneInput,
    updateDate,
    updateContent,
    selectCategory,
    selectAsset,
    openCalculator,
    closeCalculator,
    applyCalculatorValue,
    fetchTransactions,
    fetchCategories,
    createTransaction,
    saveTransaction,
    resetForm,
  };
});
