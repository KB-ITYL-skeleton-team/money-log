<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <!-- 로고 / 타이틀 -->
      <div v-if="isLogin && user" class="user-label">
        {{ user.name }} 님
        <img src="/src/assets/orbit_clean.gif" class="title-icon" />
      </div>
      <RouterLink class="navbar-brand" to="/">
        <!-- <span class="brand-text">우주를 줄게</span> -->
        <img
          src="/src/assets/title_logo.png"
          class="title-logo"
          style="width: 20%; height: 80%"
        />
      </RouterLink>

      <!-- 모바일 메뉴 -->
      <div class="mobile-header-menu">
        <div v-if="isLogin && user">
          <RouterLink to="/transactionList">
            <img src="/src/components/icons/calendar.svg" class="logo-icon" />
          </RouterLink>

          <RouterLink to="/statics">
            <img src="/src/components/icons/statics.svg" class="logo-icon" />
          </RouterLink>

          <RouterLink to="/fortune">
            <img src="/src/components/icons/rocket.svg" class="logo-icon" />
          </RouterLink>

          <RouterLink to="/mypage">
            <img src="/src/components/icons/user.svg" class="logo-icon" />
          </RouterLink>

          <button class="mobile-icon-btn" @click="logout">
            <img src="/src/components/icons/logout.svg" class="logo-icon" />
          </button>
        </div>

        <div v-else>
          <RouterLink class="nav-link" to="/loginPage">로그인</RouterLink>
        </div>
      </div>

      <!-- 웹 메뉴 -->
      <div class="header-menu">
        <div class="navbar-nav ms-auto">
          <RouterLink v-if="!isLogin" class="nav-link" to="/loginPage">
            로그인
          </RouterLink>

          <template v-else>
            <a class="nav-link" style="cursor: pointer" @click="refreshHome">
              홈
            </a>
            <RouterLink class="nav-link" to="/mypage">마이페이지</RouterLink>
            <button class="nav-link btn btn-link logout-btn" @click="logout">
              로그아웃
            </button>
            <RouterLink class="nav-link" to="/fortune">운세</RouterLink>
            <RouterLink class="nav-link" to="/statics">통계</RouterLink>
            <RouterLink class="nav-link" to="/totalBudget">예산</RouterLink>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed, watchEffect } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useLoginStore } from '@/stores/userStore';

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

const refreshHome = () => {
  router.replace('/fortune').then(() => {
    router.replace('/transactionList');
  });
};
</script>

<style scoped>
/* ===== navbar 전체 ===== */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: linear-gradient(90deg, #0b0e1a 0%, #1a1b3a 50%, #2e1a47 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: #f0f0f0;
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 1000;
}

/* ===== 브랜드 영역 ===== */
.navbar-brand {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0px;
  text-decoration: none;
  color: #e0e0ff;
  /* margin: 0;
  padding: 0;
  flex-shrink: 0; */
}

.brand-text {
  font-weight: 700;
  font-size: 1.1rem;
  color: #e0e0ff;
  text-shadow: 0 0 8px rgba(150, 150, 255, 0.6);
}

.user-label {
  font-size: 0.7rem;
  color: #b8b8c8;
}

.title-icon {
  width: 64px;
  height: auto;
  object-fit: contain;
  opacity: 0.85;
}

/* ===== 웹 메뉴 ===== */
.header-menu {
  display: flex;
  align-items: center;
}

.navbar-nav {
  display: flex;
  align-items: center;
  gap: 18px;
}

.nav-link {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.82);
  font-size: 0.95rem;
  white-space: nowrap;
  transition:
    color 0.25s ease,
    text-shadow 0.25s ease,
    transform 0.2s ease;
}

.nav-link:hover {
  color: #ffffff;
  text-shadow: 0 0 10px rgba(123, 97, 255, 0.8);
  transform: translateY(-1px);
}

.logout-btn {
  border: none;
  background: transparent;
  padding: 0;
}

/* ===== 모바일 메뉴 ===== */
.mobile-header-menu {
  display: none;
  align-items: center;
}

.mobile-header-menu > div {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mobile-header-menu a,
.mobile-header-menu button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  border-radius: 12px;
  padding: 0;
  cursor: pointer;
  transition:
    background-color 0.25s ease,
    transform 0.2s ease,
    box-shadow 0.25s ease;
}

.logo-icon {
  width: 22px;
  height: 22px;
  object-fit: contain;
  transition: transform 0.2s ease;
}

/* hover */
.mobile-header-menu a:hover,
.mobile-header-menu button:hover {
  background: rgba(255, 255, 255, 0.08);
  box-shadow:
    0 0 6px rgba(255, 255, 255, 0.12),
    0 0 12px rgba(120, 150, 255, 0.18);
  transform: translateY(-1px);
}

.mobile-header-menu a:hover .logo-icon,
.mobile-header-menu button:hover .logo-icon {
  transform: scale(1.12);
}

/* 클릭 */
.mobile-header-menu a:active,
.mobile-header-menu button:active {
  transform: scale(0.94);
  box-shadow: none;
}

/* 현재 활성 메뉴 */
.mobile-header-menu a.router-link-active {
  background: rgba(255, 255, 255, 0.12);
  box-shadow:
    0 0 8px rgba(120, 170, 255, 0.35),
    0 0 14px rgba(80, 120, 255, 0.2);
}

.mobile-icon-btn {
  outline: none;
}

/* ===== 반응형 ===== */
@media (max-width: 767px) {
  .header-menu {
    display: none;
  }

  .mobile-header-menu {
    display: flex;
  }

  .title-icon {
    width: 52px;
  }

  .logo-icon {
    width: 18px;
    height: 18px;
  }

  .mobile-header-menu a,
  .mobile-header-menu button {
    width: 34px;
    height: 34px;
    border-radius: 10px;
  }

  .brand-text {
    font-size: 1rem;
  }
}

.title-logo {
  margin-top: 0;
  display: block;
}

.container-fluid {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: nowrap;
}
</style>
