<template>
  <!-- 수입/지출 입력 페이지(웹 폼 버전) -->
  <div class="transaction-page">
    <!-- 페이지 상단 헤더: 뒤로가기 + 현재 탭 제목 -->
    <header class="page-header">
      <button type="button" class="back-btn" @click="goBack">←</button>
      <h1>{{ transactionStore.pageTitle }}</h1>
      <div class="header-space" />
    </header>

    <!-- 입력 폼 영역(탭/날짜/금액/분류/자산/내용/저장) -->
    <!-- 거래 등록 폼 UI(입력/저장 버튼)는 TransactionForm이 담당 -->
    <TransactionForm />
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TransactionForm from '@/components/TransactionForm.vue';
import { useTransactionStore } from '@/stores/transactionStore';

// 허용되는 탭 타입(수입/지출) - query.type 검증용
const validTypes = ['income', 'expense'];

const route = useRoute();
const router = useRouter();
// 스토어 인스턴스
const transactionStore = useTransactionStore();

// 메서드: URL query.type과 store.activeType을 동기화하고, 잘못된 값이면 URL을 정정
const syncTypeFromQuery = () => {
  const requestedType = route.query.type;

  if (validTypes.includes(requestedType)) {
    return requestedType;
  }

  // 잘못된 type이면 현재 store의 type으로 URL을 정정
  router.replace({
    name: 'transactionPage',
    query: { type: transactionStore.activeType },
  });

  return transactionStore.activeType;
};

// 메서드: 뒤로가기(항상 목록으로)
const goBack = () => {
  router.replace({ name: 'transactionList' });
};

onMounted(async () => {
  // [Auth Guard] loginUser 없으면 로그인 페이지로 이동 (거래 등록은 로그인 필요)
  const savedUser = localStorage.getItem('loginUser');
  if (!savedUser) {
    alert('로그인이 필요합니다.');
    router.replace({ name: 'loginPage' }); // 또는 router.replace('/loginPage')
    return;
  }

  // 초기 진입 시: 카테고리 로드 -> (유저 기준) 거래 목록 로드 -> 화면 상태 준비

  await transactionStore.fetchCategories();

  // [Edit Mode] query.editId가 있으면 "거래 수정"으로 진입
  // - TransactionList에서 클릭한 거래의 id를 넘겨받아, store.startEditTransaction으로 form을 채움
  // - 수정 모드에서는 기존 탭/필터 로직을 타면 폼이 초기화될 수 있어 return 처리
  const editId = route.query.editId;
  if (editId) {
    await transactionStore.startEditTransaction(editId);
    return;
  }

  const initialType = syncTypeFromQuery();
  await transactionStore.applyTypeFilter(initialType);
});

watch(
  () => route.query.type,
  async (nextType) => {
    // 수정 모드에서는 type query 변경에 반응하지 않음(폼 유지 목적)
    if (route.query.editId) return;

    // 탭 변경 시(query 변경): activeType만 바꾸고 필요한 데이터 갱신
    const savedUser = localStorage.getItem('loginUser');
    if (!savedUser) {
      alert('로그인이 필요합니다.');
      router.replace({ name: 'loginPage' }); // 또는 router.replace('/loginPage')
      return;
    }

    if (!validTypes.includes(nextType)) return;
    await transactionStore.applyTypeFilter(nextType);
  },
);
</script>

<style scoped>
.transaction-page {
  /* Full-width page section (website-like) */
  max-width: none;
  margin: 0;
  padding: 0;
  background: #f4f4f4;
  min-height: 100vh;
}

.page-header {
  display: grid;
  grid-template-columns: 24px 1fr 24px;
  align-items: center;
  margin-bottom: 12px;
}

.page-header h1 {
  text-align: center;
  font-size: 16px;
  font-weight: 600;
}

.back-btn {
  border: 0;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
}

.header-space {
  width: 24px;
}
</style>
