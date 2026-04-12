<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <!-- 왼쪽 영역 -->
      <div class="left-area">
        <div v-if="isLogin && user" class="user-row">
          <span class="user-label">{{ user.name }}님</span>
          <img
            src="/src/assets/orbit_clean.gif"
            alt="지구 아이콘"
            class="user-orbit-icon"
          />
        </div>

        <RouterLink class="navbar-brand" to="/">
          <img
            src="/src/assets/title_logo.png"
            alt="우주를 줄게"
            class="title-logo"
          />
        </RouterLink>
      </div>

      <!-- 모바일 메뉴 -->
      <div class="mobile-header-menu">
        <div v-if="isLogin && user" class="mobile-menu-group">
          <RouterLink to="/transactionList" class="mobile-menu-link">
            <img
              src="/src/components/icons/calendar.svg"
              class="logo-icon"
              alt="홈"
            />
          </RouterLink>

          <RouterLink to="/statics" class="mobile-menu-link">
            <img
              src="/src/components/icons/statics.svg"
              class="logo-icon"
              alt="통계"
            />
          </RouterLink>

          <RouterLink to="/fortune" class="mobile-menu-link">
            <img
              src="/src/components/icons/rocket.svg"
              class="logo-icon"
              alt="운세"
            />
          </RouterLink>

          <RouterLink to="/mypage" class="mobile-menu-link">
            <img
              src="/src/components/icons/user.svg"
              class="logo-icon"
              alt="마이페이지"
            />
          </RouterLink>

          <button
            class="mobile-icon-btn mobile-menu-link"
            @click="logout"
            type="button"
          >
            <img
              src="/src/components/icons/logout.svg"
              class="logo-icon"
              alt="로그아웃"
            />
          </button>
        </div>

        <div v-else class="mobile-menu-group">
          <RouterLink class="nav-link mobile-login-link" to="/loginPage">
            로그인
          </RouterLink>
        </div>
      </div>

      <!-- 웹 메뉴 -->
      <div class="header-menu">
        <div class="navbar-nav ms-auto">
          <RouterLink v-if="!isLogin" class="nav-link" to="/loginPage">
            로그인
          </RouterLink>

          <template v-else>
            <button
              class="nav-link text-btn"
              type="button"
              @click="refreshHome"
            >
              홈
            </button>
            <RouterLink class="nav-link" to="/mypage">마이페이지</RouterLink>
            <button
              class="nav-link text-btn logout-btn"
              type="button"
              @click="logout"
            >
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
import { computed } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useLoginStore } from '@/stores/userStore';

const loginStore = useLoginStore();
const router = useRouter();

const isLogin = computed(() => loginStore.isLoggedIn);
const user = computed(() => loginStore.currentUser);

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

<!-- <style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  min-height: 88px;
  padding: 0 24px;
  overflow: hidden;

  display: flex;
  align-items: center;

  background:
    linear-gradient(rgba(7, 10, 22, 0.2), rgba(7, 10, 22, 0.2)),
    url('/src/assets/galaxy.png') center / cover no-repeat;

  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(3px);
}

/* 상단바 전체 스타일 */

.container-fluid {
  width: 100%;
  display: flex;
  align-items: center; /* 메뉴도 수직 중앙 정렬 */
  justify-content: space-between;
  gap: 24px;
  padding: 0;
  margin: 0;
}

/* 왼쪽 영역 */
.left-area {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex-shrink: 0;
  min-width: 190px;
  margin-top: 2px;
}

/* 송혜교님 + 지구 */
.user-row {
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  margin: 0;
  line-height: 1;
  margin-bottom: -10px; /* 아래 로고와 더 붙게 */
  position: relative;
  z-index: 2;
}

.user-label {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.96);
  line-height: 1;
  margin: 0;
  text-shadow: 0 0 8px rgba(120, 180, 255, 0.8);
}

.user-orbit-icon {
  width: 18px;
  height: 18px;
  object-fit: contain;
  display: block;
  margin-top: 1px;
}

/* 타이틀 */
.navbar-brand {
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  text-decoration: none;
  line-height: 1;
}

.title-logo {
  display: block;
  width: 132px;
  height: auto;
  margin-top: -6px; /* user-row와 더 붙이기 */
  margin-left: 0;
}

/* 웹 메뉴 */
.header-menu {
  display: flex;
  align-items: center;
  margin-left: auto;
  height: 100%;
}

.navbar-nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 28px;
  margin: 0;
  padding: 0;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  border: none;
  background: transparent;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;

  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: 500;
  line-height: 1;

  transition:
    color 0.25s ease,
    text-shadow 0.25s ease,
    transform 0.2s ease;
}

.nav-link:hover {
  color: #ffffff;
  text-shadow:
    0 0 6px rgba(180, 220, 255, 0.6),
    0 0 14px rgba(120, 160, 255, 0.35);
  transform: translateY(-1px);
}

.text-btn,
.logout-btn {
  border: none;
  background: transparent;
  box-shadow: none;
}

/* 모바일 메뉴 */
.mobile-header-menu {
  display: none;
}

.mobile-menu-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mobile-menu-link {
  width: 38px;
  height: 38px;
  padding: 0;
  border: none;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);

  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.05),
    0 0 0 rgba(0, 0, 0, 0);

  transition:
    background-color 0.25s ease,
    transform 0.2s ease,
    box-shadow 0.25s ease;
}

.logo-icon {
  width: 20px;
  height: 20px;
  display: block;
  object-fit: contain;
  filter: brightness(0) invert(1);
  opacity: 0.96;

  transition:
    transform 0.22s ease,
    filter 0.22s ease,
    opacity 0.22s ease;
}

.mobile-menu-link:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-1px);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.08),
    0 0 8px rgba(140, 180, 255, 0.18),
    0 0 18px rgba(112, 76, 255, 0.16),
    0 0 28px rgba(0, 180, 255, 0.12);
}

.mobile-menu-link:hover .logo-icon {
  transform: scale(1.12);
  filter: brightness(0) invert(1) drop-shadow(0 0 4px rgba(255, 255, 255, 0.7))
    drop-shadow(0 0 10px rgba(133, 180, 255, 0.55));
  opacity: 1;
}

.mobile-menu-link:active {
  transform: scale(0.96);
}

.mobile-menu-link.router-link-active {
  background: rgba(255, 255, 255, 0.1);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.08),
    0 0 10px rgba(120, 180, 255, 0.18),
    0 0 18px rgba(98, 70, 255, 0.18);
}

.mobile-icon-btn {
  outline: none;
}

.mobile-login-link {
  min-width: 54px;
  height: 34px;
  padding: 0 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
}

/* 반응형 */
@media (max-width: 767px) {
  .navbar {
    min-height: 70px;
    padding: 0 16px;
  }

  .container-fluid {
    gap: 12px;
  }

  .left-area {
    min-width: auto;
  }

  .user-row {
    gap: 3px;
    margin-bottom: -8px;
  }

  .user-label {
    font-size: 11px;
  }

  .user-orbit-icon {
    width: 14px;
    height: 14px;
  }

  .title-logo {
    width: 106px;
    margin-top: -4px;
  }

  .header-menu {
    display: none !important;
  }

  .mobile-header-menu {
    display: flex !important;
    align-items: center;
    margin-left: auto;
  }

  .mobile-menu-group {
    gap: 8px;
  }

  .mobile-menu-link {
    width: 34px;
    height: 34px;
    border-radius: 10px;
  }

  .logo-icon {
    width: 18px;
    height: 18px;
  }
}
</style> -->

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+KR:wght@400;500;700&family=Orbitron:wght@500;700&display=swap');

/* =========================
   Navbar (웹 기준)
========================= */
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;

  min-height: 88px;
  padding: 0 24px;

  display: flex;
  align-items: center;

  font-family: 'Inter', 'Noto Sans KR', sans-serif;

  background:
    linear-gradient(rgba(7, 10, 22, 0.3), rgba(7, 10, 22, 0.3)),
    url('/src/assets/galaxy.png') center / cover no-repeat;

  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(4px);
}

/* =========================
   Layout
========================= */
.container-fluid {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 0;
  margin: 0;
}

.left-area {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 190px;
}

/* =========================
   사용자 영역
========================= */
.user-row {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: -10px;
}

.user-label {
  font-size: 13px;
  font-weight: 600;

  font-family: 'Inter', 'Noto Sans KR', sans-serif;

  color: rgba(255, 255, 255, 0.96);
  text-shadow: 0 0 8px rgba(120, 180, 255, 0.8);
}

.user-orbit-icon {
  width: 18px;
  height: 18px;
}

/* =========================
   로고 (우주 느낌)
========================= */
.navbar-brand {
  display: flex;
  align-items: center;

  font-family: 'Orbitron', 'Inter', 'Noto Sans KR', sans-serif;
  letter-spacing: 0.05em;
}

.title-logo {
  width: 132px;
  margin-top: -6px;
}

/* =========================
   웹 메뉴
========================= */
.header-menu {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.navbar-nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 28px;
}

/* 메뉴 텍스트 */
.nav-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  font-family: 'Inter', 'Noto Sans KR', sans-serif;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.01em;

  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  cursor: pointer;

  transition:
    color 0.25s ease,
    text-shadow 0.25s ease,
    transform 0.2s ease,
    letter-spacing 0.2s ease;
}

.nav-link:hover {
  color: #ffffff;

  text-shadow:
    0 0 6px rgba(180, 220, 255, 0.6),
    0 0 14px rgba(120, 160, 255, 0.35);

  transform: translateY(-1px);
  letter-spacing: 0.02em;
}

.text-btn,
.logout-btn {
  border: none;
  background: transparent;
}

/* =========================
   모바일 메뉴
========================= */
.mobile-header-menu {
  display: none;
}

.mobile-menu-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mobile-menu-link {
  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);

  transition:
    background-color 0.25s ease,
    transform 0.2s ease,
    box-shadow 0.25s ease;
}

.logo-icon {
  width: 20px;
  height: 20px;

  filter: brightness(0) invert(1);
  opacity: 0.95;

  transition: transform 0.22s ease;
}

.mobile-menu-link:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-1px);

  box-shadow:
    0 0 10px rgba(120, 180, 255, 0.2),
    0 0 20px rgba(112, 76, 255, 0.2);
}

.mobile-menu-link:hover .logo-icon {
  transform: scale(1.1);
}

.mobile-login-link {
  font-family: 'Inter', 'Noto Sans KR', sans-serif;
  font-weight: 500;

  height: 34px;
  padding: 0 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
}

/* =========================
   반응형 (모바일 전환)
========================= */
@media (max-width: 767px) {
  .navbar {
    min-height: 70px;
    padding: 0 16px;
  }

  .container-fluid {
    gap: 12px;
  }

  .left-area {
    min-width: auto;
  }

  .user-label {
    font-size: 11px;
  }

  .user-orbit-icon {
    width: 14px;
    height: 14px;
  }

  .title-logo {
    width: 106px;
  }

  /* 웹 메뉴 숨김 */
  .header-menu {
    display: none !important;
  }

  /* 모바일 메뉴 활성화 */
  .mobile-header-menu {
    display: flex !important;
    margin-left: auto;
  }

  .mobile-menu-group {
    gap: 8px;
  }

  .mobile-menu-link {
    width: 34px;
    height: 34px;
  }

  .logo-icon {
    width: 18px;
    height: 18px;
  }
}
</style>
