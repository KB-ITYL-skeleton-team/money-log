<template>
  <div class="box">
    <h1>오늘의 운세</h1>
    <p>{{ fortune }}</p>
    <button @click="getRandomFortune">뽑기</button>
    <moon></moon>
  </div>
</template>

<script>
import { ref } from 'vue';
import data from '../../fortune.json';
import moon from '../totalBudget/Moon.vue';
export default {
  name: 'fortune',
  components: { moon },
  setup() {
    const fortune = ref('');

    const getRandomFortune = () => {
      const list = data.fortunes;
      const index = Math.floor(Math.random() * list.length);
      fortune.value = list[index];
    };
    return { fortune, getRandomFortune };
  },
};
</script>

<style lang="scss" scoped>
.box {
  background: #020617;
  color: rgba(250, 204, 21, 0.401);
}
</style>
(250, 204, 21, 0.4)rgba
