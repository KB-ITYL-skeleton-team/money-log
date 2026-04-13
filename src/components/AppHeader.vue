<template>
  <nav class="navbar navbar-expand-lg">
    <!-- 🌌 우주 로그아웃 모달 -->
    <div v-if="showLogoutModal" class="space-modal" @click="cancelLogout">
      <div class="space-modal-content" @click.stop>
        <h2>🚀 로그아웃</h2>
        <p>정말 로그아웃 하시겠습니까?</p>

        <div class="modal-btn-group">
          <button class="confirm-btn" type="button" @click="confirmLogout">
            확인
          </button>
          <button class="cancel-btn" type="button" @click="cancelLogout">
            취소
          </button>
        </div>
      </div>
    </div>

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
            class="mobile-icon-btn mobile-menu-link nav-link text-btn logout-btn"
            type="button"
            @click="logout"
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
import { computed, ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useLoginStore } from '@/stores/userStore';

const loginStore = useLoginStore();
const router = useRouter();

const isLogin = computed(() => loginStore.isLoggedIn);
const user = computed(() => loginStore.currentUser);

const showLogoutModal = ref(false);

const logout = () => {
  showLogoutModal.value = true;
};

const confirmLogout = () => {
  showLogoutModal.value = false;
  loginStore.logout();
  router.push('/loginPage');
};

const cancelLogout = () => {
  showLogoutModal.value = false;
};

const refreshHome = () => {
  router.replace('/fortune').then(() => {
    router.replace('/transactionList');
  });
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+KR:wght@400;500;700&family=Orbitron:wght@500;700&display=swap');

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
.logout-btn,
.mobile-icon-btn {
  border: none;
  background: transparent;
  box-shadow: none;
  padding: 0;
}

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

.mobile-login-link {
  min-width: 54px;
  height: 34px;
  padding: 0 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
}

/* 우주 로그아웃 모달 */
.space-modal {
  position: fixed;
  inset: 0;

  background: rgba(2, 6, 23, 0.8);
  backdrop-filter: blur(6px);

  display: flex;
  justify-content: center;
  align-items: bottom;

  z-index: 2000;
}

.space-modal-content {
  width: 300px;
  padding: 24px;
  border-radius: 16px;
  text-align: center;
  background: linear-gradient(145deg, #0b1120, #020617);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 0 20px rgba(59, 130, 246, 0.3),
    0 0 40px rgba(139, 92, 246, 0.2);
  color: white;
}

.space-modal-content h2 {
  margin: 0 0 10px;
  font-size: 18px;
}

.space-modal-content p {
  margin: 0;
  font-size: 14px;
  color: #dbe7ff;
}

.modal-btn-group {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  width: 100%;
}

.confirm-btn {
  flex: 1;
  min-width: 0;
  padding: 10px 0;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.confirm-btn:hover {
  box-shadow:
    0 0 10px #3b82f6,
    0 0 20px #8b5cf6;
  transform: translateY(-2px);
}

.cancel-btn {
  flex: 1;
  min-width: 0;
  padding: 10px 0;
  border-radius: 10px;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: #cbd5f5;
  cursor: pointer;
  transition: all 0.3s;
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

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

  .space-modal-content {
    width: calc(100% - 32px);
    max-width: 320px;
    padding: 22px 18px;
  }
}
</style>
