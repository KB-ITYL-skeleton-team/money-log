<template>
  <div>
    <img :src="notFoundImg" alt="404" class="error-img" />

    <h1>404</h1>
    <p>존재하지 않는 페이지입니다.</p>
    <button @click="goHome">홈으로</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import notFoundImg from '@/assets/404.png';
const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>
