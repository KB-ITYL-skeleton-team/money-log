<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <RouterLink class="navbar-brand" to="/">우주를 줄게</RouterLink>

      <nav class="header-menu">
        <div class="navbar-nav ms-auto">
          <RouterLink v-if="!isLogin" class="nav-link" to="/loginPage">
            로그인
          </RouterLink>

          <template v-else>
            <RouterLink class="nav-link" to="/mypage">마이페이지</RouterLink>
            <button class="nav-link btn btn-link" @click="logout">
              로그아웃
            </button>
          </template>
          <!-- 변경: 홈 버튼 클릭시 강제로 다른 경로 거쳐서 재이동 -->
          <a class="nav-link" style="cursor: pointer" @click="refreshHome"
            >홈</a
          >
          <RouterLink class="nav-link" to="/fortune">운세</RouterLink>
          <RouterLink class="nav-link" to="/statics">통계</RouterLink>
          <RouterLink class="nav-link" to="/totalBudget">예산</RouterLink>
          <div v-if="isLogin && user">{{ user.name }} 님 환영합니다</div>
        </div>
      </nav>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useLoginStore } from '@/stores/userStore';

// 로그인 되어 있는지 확인 - 안 되어 있으면
const store = useLoginStore();
const router = useRouter();
const isLogin = computed(() => store.isLoggedIn);

const user = computed(() => {
  const savedUser = localStorage.getItem('loginUser');
  console.log('savedUser 정보  :', savedUser);
  return savedUser ? JSON.parse(savedUser) : null;
});

const logout = () => {
  store.logout();
  router.push('/loginPage');
};

// 변경: 홈 버튼 클릭시 /fortune 거쳐서 /transactionList 로 강제 재이동
const refreshHome = () => {
  router.replace('/fortune').then(() => {
    router.replace('/transactionList');
  });
};
</script>

<style scoped></style>
