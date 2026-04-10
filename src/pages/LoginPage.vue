<template>
  <div class="login-wrapper d-flex align-items-center justify-content-center">
    <div class="container login-container">
      <form
        @submit.prevent="handleLogin"
        class="login-card p-4 p-md-5 border rounded-5 shadow-sm bg-white"
      >
        <h1 class="pc-title d-none d-md-block mb-5 text-center text-md-start">
          Log-in
        </h1>

        <div class="row align-items-center">
          <div class="col-12 col-md-5 text-center mb-4 mb-md-0 icon-section">
            <h1 class="d-md-none mb-4 mobile-inner-title">Log-in</h1>
            <div class="user-icon-svg">
              <svg width="140" height="140" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="50" fill="#2c7a90" />
                <circle cx="50" cy="38" r="15" fill="#f8e752" />
                <path
                  d="M50 55 C30 55 20 75 20 90 L80 90 C80 75 70 55 50 55 Z"
                  fill="#f8e752"
                />
              </svg>
            </div>
          </div>

          <!-- 아이디 비번 입력창 -->

          <div class="col-12 col-md-7 ps-md-5 form-section">
            <div class="mb-4">
              <label class="form-label fw-bold small text-secondary"
                >아이디</label
              >
              <input
                v-model="userId"
                type="text"
                class="form-underline"
                placeholder="아이디"
              />
            </div>

            <div class="mb-5">
              <label class="form-label fw-bold small text-secondary"
                >비밀번호</label
              >
              <input
                v-model="userPw"
                type="password"
                class="form-underline"
                placeholder="비밀번호"
              />
            </div>

            <div class="d-grid gap-2 mb-4">
              <button type="submit" class="btn btn-login py-2 fw-bold">
                로그인
              </button>
            </div>

            <!-- 회원가입, 아이디/비번 찾기 버튼 -->

            <div
              class="find-links d-flex justify-content-center small text-secondary gap-2"
            >
              <router-link
                to="/signup"
                class="text-decoration-none text-secondary"
                >회원가입</router-link
              >
              <span>|</span>
              <router-link
                to="/find-id"
                class="text-decoration-none text-secondary"
                >아이디 찾기</router-link
              >
              <span>|</span>
              <router-link
                to="/find-pw"
                class="text-decoration-none text-secondary"
                >비밀번호 찾기</router-link
              >
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useLoginStore } from '@/stores/userStore';

const userId = ref('');
const userPw = ref('');
const loginStore = useLoginStore();

// 로그인 버튼 누르면 반응
// 입력창에 입력이 안된 상태로 로그인을 한 경우 알림창
const handleLogin = async () => {
  if (!userId.value || !userPw.value) {
    alert('정보를 입력해주세요.');
    return;
  }
  loginStore.userId = userId.value;
  loginStore.userPw = userPw.value;
  await loginStore.handleLogin();
};
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  background-color: #ffffff;
}
.login-container {
  max-width: 900px;
}
.login-card {
  border-radius: 40px !important;
  border: 1px solid #eaeaea !important;
}
.pc-title {
  font-size: 3rem;
  font-weight: 800;
  color: #333;
}
.form-underline {
  width: 100%;
  padding: 10px 0;
  border: none;
  border-bottom: 2px solid #333;
  background: transparent;
  outline: none;
}
.btn-login {
  background-color: #ffffff;
  border: 1px solid #333;
  color: #333;
  border-radius: 10px;
  transition: all 0.2s;
}
.btn-login:hover {
  background-color: #333;
  color: #fff;
}

@media (max-width: 767.98px) {
  .login-container {
    max-width: 420px;
  }
  .mobile-inner-title {
    font-size: 2.2rem;
    font-weight: 800;
  }
}
</style>
