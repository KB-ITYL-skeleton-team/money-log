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
    <TransactionForm />
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TransactionForm from '@/components/TransactionForm.vue';
import { useTransactionStore } from '@/stores/transactionStore';

// 상수: 허용되는 query.type 값
const validTypes = ['income', 'expense'];

const route = useRoute();
const router = useRouter();
// 스토어 인스턴스
const transactionStore = useTransactionStore();

// 메서드: query.type을 store 상태와 동기화
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
  const initialType = syncTypeFromQuery();
  await transactionStore.fetchCategories();
  await transactionStore.applyTypeFilter(initialType);
});

watch(
  () => route.query.type,
  async (nextType) => {
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
