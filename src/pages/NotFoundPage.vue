<template>
  <div>
    <h1>404</h1>
    <p>존재하지 않는 페이지입니다.</p>
    <button @click="goHome">홈으로</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>
