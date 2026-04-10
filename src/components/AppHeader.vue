<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <!--  -->
      <RouterLink class="navbar-brand" to="/">
        <div v-if="isLogin && user" style="font-size: 70%; color: lightgray">
          {{ user.name }} 님
        </div>
        우주를 줄게
        <img src="/src/assets/orbit_clean.gif" class="logo-icon" />
      </RouterLink>

      <nav class="header-menu">
        <div class="navbar-nav ms-auto">
          <RouterLink v-if="!isLogin" class="nav-link" to="/loginPage">
            로그인
          </RouterLink>
          <template v-else>
            <a class="nav-link" style="cursor: pointer" @click="refreshHome"
              >홈</a
            >
            <RouterLink class="nav-link" to="/mypage"
              >마이페이지
              <!-- <img src="/src/components/icons/user.svg" class="logo-icon" /> -->
            </RouterLink>
            <button class="nav-link btn btn-link" @click="logout">
              로그아웃
              <!-- <img src="/src/components/icons/user.svg" class="logo-icon" /> -->
            </button>
            <RouterLink class="nav-link" to="/fortune">운세</RouterLink>
            <RouterLink class="nav-link" to="/statics">통계</RouterLink>
            <RouterLink class="nav-link" to="/totalBudget">예산</RouterLink>
          </template>
        </div>
      </nav>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useLoginStore } from '@/stores/userStore';
import { watchEffect } from 'vue';

// 로그인 되어 있는지 확인 - 안 되어 있으면
const loginStore = useLoginStore();
const router = useRouter();
const isLogin = computed(() => loginStore.isLoggedIn);
const user = computed(() => loginStore.currentUser);
watchEffect(() => {
  console.log('user:', user.value);
});

const logout = () => {
  loginStore.logout();
  router.push('/loginPage');
};

// 변경: 홈 버튼 클릭시 /fortune 거쳐서 /transactionList 로 강제 재이동
const refreshHome = () => {
  router.replace('/fortune').then(() => {
    router.replace('/transactionList');
  });
};
</script>

<style scoped>
.logo-icon {
  /* width: clamp(20px, 3vw, 32px); */
  width: 80px;
  height: auto;
  object-fit: contain;

  opacity: 0.8; /* 살짝 자연스럽게 */
}
</style>
