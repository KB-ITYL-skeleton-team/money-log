<template>
  <div class="transaction-page">
    <header class="page-header">
      <button type="button" class="back-btn" @click="goBack">←</button>
      <h1>{{ transactionStore.pageTitle }}</h1>
      <div class="header-space" />
    </header>

    <TransactionForm />

    <section class="panel-wrap">
      <div v-if="transactionStore.panelType === 'number'" class="number-panel">
        <div class="number-grid">
          <button
            v-for="digit in transactionStore.keypadDigits"
            :key="digit"
            type="button"
            @click="transactionStore.appendAmount(digit)"
          >
            {{ digit }}
          </button>
          <button
            type="button"
            class="clear-btn"
            @click="transactionStore.deleteAmount"
          >
            ⌫
          </button>
          <button
            type="button"
            class="done-btn"
            @click="transactionStore.doneInput"
          >
            완료
          </button>
        </div>
      </div>

      <div v-else-if="transactionStore.panelType === 'date'" class="date-panel">
        <input
          type="date"
          :value="transactionStore.form.date"
          @input="updateDate"
        />
      </div>

      <div
        v-else-if="transactionStore.panelType === 'category'"
        class="option-panel"
      >
        <button
          v-for="category in transactionStore.categoryOptions"
          :key="category.id"
          type="button"
          class="option-btn"
          @click="transactionStore.selectCategory(category)"
        >
          {{ category.name }}
        </button>
      </div>

      <div
        v-else-if="transactionStore.panelType === 'asset'"
        class="option-panel"
      >
        <button
          v-for="asset in transactionStore.assetOptions"
          :key="asset"
          type="button"
          class="option-btn"
          @click="transactionStore.selectAsset(asset)"
        >
          {{ asset }}
        </button>
      </div>

      <div v-else class="text-panel">
        <textarea
          placeholder="내용을 입력하세요"
          :value="transactionStore.form.content"
          @input="updateContent"
        />
      </div>
    </section>

    <div
      v-if="transactionStore.isCalculatorOpen"
      class="calculator-layer"
      @click.self="transactionStore.closeCalculator"
    >
      <div class="calculator-box">
        <p>계산기 화면(임시)</p>
        <input
          v-model="transactionStore.calculatorValue"
          type="number"
          placeholder="계산 결과 금액"
        />
        <button type="button" @click="transactionStore.applyCalculatorValue">
          금액 적용
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TransactionForm from '@/components/TransactionForm.vue';
import { useTransactionStore } from '@/stores/transactionStore';

const validTypes = ['income', 'expense', 'transfer'];

const route = useRoute();
const router = useRouter();
const transactionStore = useTransactionStore();

const syncTypeFromQuery = () => {
  const requestedType = route.query.type;

  if (validTypes.includes(requestedType)) {
    transactionStore.setActiveType(requestedType);
    return;
  }

  router.replace({
    name: 'transaction',
    query: { type: transactionStore.activeType },
  });
};

const updateDate = (event) => {
  transactionStore.updateDate(event.target.value);
};

const updateContent = (event) => {
  transactionStore.updateContent(event.target.value);
};

const goBack = () => {
  router.back();
};

onMounted(async () => {
  syncTypeFromQuery();
  await transactionStore.fetchCategories();
  await transactionStore.fetchTransactions({
    type: transactionStore.activeType,
  });
});

watch(
  () => route.query.type,
  async (nextType) => {
    if (!validTypes.includes(nextType)) return;

    transactionStore.setActiveType(nextType);
    await transactionStore.fetchTransactions({ type: nextType });
  },
);
</script>

<style scoped>
.transaction-page {
  max-width: 430px;
  margin: 0 auto;
  padding: 12px;
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

.panel-wrap {
  margin-top: 12px;
  background: #111;
  border-radius: 12px;
  padding: 8px;
}

.number-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.number-grid button {
  min-height: 54px;
  border: 0;
  border-radius: 8px;
  background: #2b2b2b;
  color: #fff;
}

.number-grid .clear-btn {
  background: #444;
}

.number-grid .done-btn {
  background: #ff5f46;
}

.date-panel,
.option-panel,
.text-panel {
  background: #fff;
  border-radius: 10px;
  padding: 12px;
}

.date-panel input {
  width: 100%;
  min-height: 44px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0 10px;
}

.option-panel {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.option-btn {
  border: 1px solid #d6d6d6;
  border-radius: 8px;
  background: #fff;
  min-height: 42px;
}

.text-panel textarea {
  width: 100%;
  min-height: 96px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  resize: none;
}

.calculator-layer {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.calculator-box {
  width: min(320px, 100%);
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.calculator-box input {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  min-height: 42px;
  padding: 0 10px;
}

.calculator-box button {
  border: 0;
  border-radius: 8px;
  min-height: 40px;
  background: #ff5f46;
  color: #fff;
}
</style>
