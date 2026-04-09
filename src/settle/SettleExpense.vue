<template>
  <div>
    <h3>정산 계산기</h3>
    <div v-for="(settlePrice, index) in settlePrices" :key="index">
      <div style="border: 2px solid black">
        <p>정산액 {{ index + 1 }}</p>
        <input type="number" v-model="settlePrice.price" placeholder="금액" />
        <input type="number" v-model="settlePrice.person" placeholder="인원" />
        <button @click="addSettelPrice">+ 금액 추가</button>
        <button
          @click="removeSettlePrice(index)"
          v-if="settlePrices.length > 1"
        >
          삭제
        </button>
        <p>totalSettlePrcie : {{ settlePrice.price * settlePrice.person }}</p>
      </div>
      <br />
    </div>

    <div>
      <p>totalSettlePrices : {{ totalSettlePrices }}</p>
      <p>총정산잔액 : {{ SettleBalance }}</p>
      <p>나의 지출 : : {{ SettleBalance }}</p>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  setup() {
    const expense = ref(0);
    const settlePrices = ref([{ price: 0, person: 1 }]);
    const addSettelPrice = () => {
      settlePrices.value.push({ price: 0, person: 1 });
    };
    const removeSettlePrice = (index) => {
      settlePrices.value.splice(index, 1);
    };
    const totalSettlePrices = computed(() => {
      return settlePrices.value.reduce((totalSettlePrice, settlePrice) => {
        return totalSettlePrice + settlePrice.price * settlePrice.person;
      }, 0);
    });

    const SettleBalance = computed(() => {
      return expense.value - totalSettlePrices.value;
    });

    return {
      settlePrices,
      addSettelPrice,
      removeSettlePrice,
      totalSettlePrices,
      SettleBalance,
    };
  },
};
</script>
