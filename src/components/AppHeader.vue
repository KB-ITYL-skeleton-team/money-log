<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <!-- 공통 헤더 -->
      <RouterLink class="navbar-brand" to="/">
        <div v-if="isLogin && user" style="font-size: 70%; color: gray">
          {{ user.name }} 님
        </div>
        우주를 줄게
        <img src="/src/assets/orbit_clean.gif" class="title-icon" />
      </RouterLink>
      <!-- 모바일 반응형일 때는 아이콘으로  -->
      <nav class="mobile-header-menu">
        <div v-if="isLogin && user">
          <!-- 홈 -->
          <RouterLink to="/transactionList">
            <img src="/src/components/icons/calendar.svg" class="logo-icon" />
          </RouterLink>
          <!-- 통계 -->
          <RouterLink to="/statics">
            <img src="/src/components/icons/statics.svg" class="logo-icon" />
          </RouterLink>
          <!-- 운세 -->
          <RouterLink to="/fortune">
            <img src="/src/components/icons/rocket.svg" class="logo-icon" />
          </RouterLink>
          <!-- 마이페이지 -->
          <RouterLink to="/mypage">
            <img src="/src/components/icons/user.svg" class="logo-icon" />
          </RouterLink>
          <!-- 로그아웃 -->
          <button class="nav-link btn btn-link" @click="logout">
            <img src="/src/components/icons/logout.svg" class="logo-icon" />
          </button>
        </div>
        <div v-else>
          <!-- 로그인 -->
          <RouterLink v-if="!isLogin" class="nav-link" to="/loginPage">
            로그인
          </RouterLink>
        </div>
      </nav>

      <nav class="header-menu">
        <div class="navbar-nav ms-auto">
          <RouterLink v-if="!isLogin" class="nav-link" to="/loginPage">
            로그인
          </RouterLink>
          <template v-else>
            <a class="nav-link" style="cursor: pointer" @click="refreshHome"
              >홈</a
            >
            <RouterLink class="nav-link" to="/mypage">마이페이지 </RouterLink>
            <button class="nav-link btn btn-link" @click="logout">
              로그아웃
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
.title-icon {
  width: 80px;
  height: auto;
  object-fit: contain;
  opacity: 0.8;
}

.logo-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

/* 모바일 메뉴 컨테이너 */
.mobile-header-menu {
  display: none;
  align-items: center;
}

/* 실제 아이콘 묶음 */
.mobile-header-menu > div {
  display: flex;
  align-items: center;
  gap: 14px;
}

/* 각 링크 안에서 아이콘 중앙 정렬 */
.mobile-header-menu a {
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

@media (max-width: 767px) {
  .logo-icon {
    width: 18px;
    height: 18px;
  }
}
</style>
