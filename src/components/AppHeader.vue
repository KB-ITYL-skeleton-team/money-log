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
          <RouterLink class="nav-link" to="/transactionList">홈</RouterLink>
          <RouterLink class="nav-link" to="/fortune">운세</RouterLink>
          <!-- <RouterLink class="nav-link" to="/transactionForm">거래등록</RouterLink> -->
          <RouterLink class="nav-link" to="/statics">통계</RouterLink>
          <RouterLink class="nav-link" to="/totalBudget">예산</RouterLink>
        </div>
      </nav>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useLoginStore } from '@/stores/userStore';

const store = useLoginStore();
const router = useRouter();

const isLogin = computed(() => store.isLoggedIn);

const logout = () => {
  store.logout();
  router.push('/loginPage');
};
</script>

<style scoped></style>
