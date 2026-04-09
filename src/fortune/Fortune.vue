<template>
  <div>
    <h1>오늘의 운세</h1>
    <p>{{ fortune }}</p>
    <button @click="getRandomFortune">뽑기</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import data from '../../db.json';

const fortune = ref('');

const getRandomFortune = () => {
  const list = data.fortunes;
  const index = Math.floor(Math.random() * list.length);
  fortune.value = list[index];
};
</script>
