<template>
  <div class="app">
    <svg width="200" height="200" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="40" fill="#020617" />
      <path :d="path" fill="#facc15" class="light" />
    </svg>
    <p>{{ Math.round(progress) }}%</p>
  </div>
</template>

<script>
import { computed, watch } from 'vue';
import { useTransactionsStore } from '@/stores/stores.js';
import { storeToRefs } from 'pinia';

export default {
  name: 'YourComponent',

  setup() {
    const transactions = useTransactionsStore();
    const { income, progress } = storeToRefs(transactions);

    const path = computed(() => {
      const phase = (progress.value / 100) * Math.PI;
      console.log(progress.value);

      const cx = 50;
      const cy = 50;
      const r = 40;

      const k = Math.cos(phase);
      const rx = Math.max(0.001, Math.abs(k) * r);
      const sweep = k >= 0 ? 1 : 0;

      return `
        M ${cx} ${cy - r}
        A ${r} ${r} 0 0 1 ${cx} ${cy + r}
        A ${rx} ${r} 0 0 ${sweep} ${cx} ${cy - r}
      `;
    });

    watch(progress, (v) => {
      if (v > 100) progress.value = 100;
      if (v < 0) progress.value = 0;
    });

    return {
      progress,
      path,
      income,
    };
  },
};
</script>

<style scoped>
.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background: #020617;

  color: white;
}

.light {
  filter: drop-shadow(0 0 6px rgba(250, 204, 21, 0.4));
  transition: all 0.2s linear;
}

input[type='range'] {
  width: 200px;
  margin-top: 20px;
}

.number {
  margin-top: 10px;
  width: 100px;
  padding: 8px;
  border-radius: 8px;
  border: none;
  text-align: center;
}
</style>
