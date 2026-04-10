<template>
  <section class="transaction-form container-fluid">
    <div class="form-shell">
      <header class="form-header">
        <h2 class="title">
          {{ transactionStore.isEditing ? '거래 수정' : '거래 등록' }}
        </h2>

        <!-- 수입/지출 탭: store.activeType 변경 + URL query.type 변경 -->
        <div class="btn-group" role="group" aria-label="거래 타입">
          <!-- 수정 모드에서는 탭 변경을 막아 폼 리셋/상태 꼬임을 방지 -->
          <button
            v-for="item in typeTabs"
            :key="item.value"
            type="button"
            class="btn"
            :class="
              transactionStore.activeType === item.value
                ? 'btn-danger'
                : 'btn-outline-secondary'
            "
            @click="changeType(item.value)"
            :disabled="transactionStore.isEditing"
          >
            {{ item.label }}
          </button>
        </div>
      </header>

      <div class="card form-card">
        <div class="card-body">
          <!-- 입력값은 transactionStore.form에 v-model로 바인딩(스토어가 폼 상태를 소유) -->
          <div class="row g-3 align-items-center">
            <div class="col-12 col-md-6">
              <label class="form-label mb-1">날짜</label>
              <input
                v-model="transactionStore.form.date"
                type="date"
                class="form-control"
              />
            </div>

            <div class="col-12 col-md-6">
              <label class="form-label mb-1">금액</label>
              <input
                v-model="transactionStore.form.amount"
                type="number"
                inputmode="numeric"
                class="form-control"
                placeholder="0"
                step="100"
              />
            </div>

            <div class="col-12 col-md-6">
              <label class="form-label mb-1">분류</label>
              <select
                v-model.number="transactionStore.form.categoryId"
                class="form-select"
              >
                <option :value="null" disabled>선택</option>
                <option
                  v-for="category in transactionStore.categoryOptions"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>

            <div class="col-12 col-md-6">
              <label class="form-label mb-1">자산</label>
              <select v-model="transactionStore.form.asset" class="form-select">
                <option value="" disabled>선택</option>
                <option
                  v-for="asset in transactionStore.assetOptions"
                  :key="asset"
                  :value="asset"
                >
                  {{ asset }}
                </option>
              </select>
            </div>

            <div class="col-12">
              <label class="form-label mb-1">내용</label>
              <textarea
                v-model="transactionStore.form.memo"
                class="form-control"
                rows="4"
                placeholder="메모를 입력하세요"
              />
            </div>
          </div>

          <div class="d-flex justify-content-end mt-3">
            <button
              type="button"
              class="btn btn-danger px-4"
              :disabled="transactionStore.isSaving"
              @click="transaction_handler"
            >
              {{
                transactionStore.isSaving
                  ? '저장 중...'
                  : transactionStore.isEditing
                    ? '수정하기'
                    : '저장하기'
              }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useTransactionStore } from '@/stores/transactionStore';

// UI 탭 버튼 표시용 상수(라벨/값)
const typeTabs = [
  { label: '수입', value: 'income' },
  { label: '지출', value: 'expense' },
];

// 라우터 인스턴스
const router = useRouter();
// 스토어 인스턴스
const transactionStore = useTransactionStore();

// 탭 변경 시 라우트 query를 바꿔서 TransactionPage의 로직과 동기화
// - 수정 모드(isEditing)에서는 탭 변경을 막아, 불필요한 form 초기화를 방지
const changeType = (type) => {
  if (transactionStore.isEditing) return;
  router.push({ name: 'transactionPage', query: { type } });
};

// [Save Click] 로그인 여부 확인 -> 저장 확인(confirm) -> store.saveTransaction() 호출 -> 목록으로 이동
// - saveTransaction 내부에서 (등록/수정)을 자동 분기(POST/PATCH)
const transaction_handler = async () => {
  const savedUser = localStorage.getItem('loginUser');
  if (!savedUser) {
    alert('로그인이 필요합니다.');
    router.push({ name: 'loginPage' }); // 또는 router.push('/loginPage')
    return;
  }

  const ok = confirm('저장하시겠습니까?');
  if (!ok) return;
  try {
    const saved = await transactionStore.saveTransaction();
    if (!saved) {
      alert('저장에 실패했습니다. 입력값을 확인해주세요.');
    } else {
      alert('저장되었습니다.');
      // 저장 완료 후 홈(목록)으로 이동
      router.push({ name: 'transactionList' });
    }
  } catch (e) {
    console.error('저장 중 오류:', e);
    alert('저장 중 오류가 발생했습니다. 다시 시도해주세요.');
  }
};
</script>

<style scoped>
.transaction-form {
  background: #f4f4f4;
  padding: 16px 0;
  width: 100%;
  margin: 0;
}

.form-shell {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.title {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
}

.form-card {
  border-radius: 14px;
  border-color: #eee;
}
</style>
