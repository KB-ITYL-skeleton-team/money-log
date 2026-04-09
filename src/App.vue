<script setup>
import { RouterView } from 'vue-router';
import { ref, onMounted, onUnmounted } from 'vue';
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';

// 웹 기본 , 앱 반응형 추가
// isMobile = default false(웹)
const isMobile = ref(false);

const checkScreen = () => {
  isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
  checkScreen();
  window.addEventListener('resize', checkScreen);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkScreen);
});
</script>

<template>
  <AppHeader />
  <main>
    <RouterView />
  </main>
  <AppFooter v-if="isMobile" />
</template>
