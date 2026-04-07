<template>
  <section class="transaction-form">
    <div class="type-tabs">
      <button
        v-for="item in typeTabs"
        :key="item.value"
        type="button"
        class="type-btn"
        :class="{ active: transactionStore.activeType === item.value }"
        @click="changeType(item.value)"
      >
        {{ item.label }}
      </button>
    </div>

    <div class="field-list">
      <button
        type="button"
        class="field-row"
        @click="transactionStore.setActiveField('date')"
      >
        <span class="field-label">날짜</span>
        <span
          class="field-value"
          :class="{ active: transactionStore.activeField === 'date' }"
        >
          {{ transactionStore.form.date }}
        </span>
      </button>

      <div
        class="field-row amount-row"
        role="button"
        tabindex="0"
        @click="transactionStore.setActiveField('amount')"
      >
        <span class="field-label">금액</span>
        <span
          class="field-value"
          :class="{ active: transactionStore.activeField === 'amount' }"
        >
          {{ transactionStore.displayAmount }}
        </span>
        <button
          type="button"
          class="calc-btn"
          @click.stop="transactionStore.openCalculator"
        >
          계산기
        </button>
      </div>

      <button
        type="button"
        class="field-row"
        @click="transactionStore.setActiveField('category')"
      >
        <span class="field-label">분류</span>
        <span
          class="field-value"
          :class="{ active: transactionStore.activeField === 'category' }"
        >
          {{ transactionStore.form.category || '선택' }}
        </span>
      </button>

      <button
        type="button"
        class="field-row"
        @click="transactionStore.setActiveField('asset')"
      >
        <span class="field-label">자산</span>
        <span
          class="field-value"
          :class="{ active: transactionStore.activeField === 'asset' }"
        >
          {{ transactionStore.form.asset || '선택' }}
        </span>
      </button>

      <button
        type="button"
        class="field-row"
        @click="transactionStore.setActiveField('content')"
      >
        <span class="field-label">내용</span>
        <span
          class="field-value"
          :class="{ active: transactionStore.activeField === 'content' }"
        >
          {{ transactionStore.form.content || '입력' }}
        </span>
      </button>
    </div>

    <div class="action-row">
      <button
        type="button"
        class="save-btn"
        @click="transactionStore.saveTransaction"
      >
        저장하기
      </button>
      <button type="button" class="next-btn" @click="goNext">계속</button>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useTransactionStore } from '@/stores/transactionStore';

// 상단 탭 렌더링용 고정 목록
const typeTabs = [
  { label: '수입', value: 'income' },
  { label: '지출', value: 'expense' },
  { label: '이체', value: 'transfer' },
];

const router = useRouter();
// 폼 상태/액션을 직접 사용하는 Pinia 스토어
const transactionStore = useTransactionStore();

// 탭 타입을 받아 스토어 상태 변경 + URL 쿼리 동기화
const changeType = (type) => {
  transactionStore.setActiveType(type);
  router.push({ name: 'transaction', query: { type } });
};

// 다음 화면(마이페이지) 이동
const goNext = () => {
  router.push({ name: 'mypage' });
};
</script>

<style scoped>
.transaction-form {
  background: #fff;
  border-radius: 16px;
  padding: 14px;
}

.type-tabs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}

.type-btn {
  border: 1px solid #dadada;
  background: #f7f7f7;
  border-radius: 10px;
  padding: 10px 0;
  font-size: 14px;
}

.type-btn.active {
  border-color: #ff5f46;
  color: #ff5f46;
  background: #fff5f3;
}

.field-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.field-row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 0;
  border-bottom: 1px solid #ececec;
  background: transparent;
  min-height: 52px;
  text-align: left;
  padding: 0;
}

.field-label {
  color: #8a8a8a;
  font-size: 14px;
}

.field-value {
  color: #404040;
  font-size: 15px;
}

.field-value.active {
  color: #ff5f46;
}

.amount-row {
  gap: 8px;
}

.calc-btn {
  border: 1px solid #d9d9d9;
  background: #fff;
  border-radius: 8px;
  font-size: 12px;
  padding: 6px 8px;
}

.action-row {
  display: grid;
  grid-template-columns: 1fr 92px;
  gap: 10px;
  margin-top: 20px;
}

.save-btn {
  border: 0;
  border-radius: 10px;
  background: #ff5f46;
  color: #fff;
  min-height: 44px;
}

.next-btn {
  border: 1px solid #dbdbdb;
  border-radius: 10px;
  background: #fff;
  min-height: 44px;
}
</style>
