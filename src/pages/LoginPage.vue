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

            <div class="earth-orbit-wrapper mx-auto">
              <div class="moon"></div>

              <div class="earth">
                <div class="land land-1"></div>
                <div class="land land-2"></div>
                <div class="land land-3"></div>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-7 ps-md-5 form-section">
            <div class="mb-4 text-start">
              <label class="form-label fw-bold small text-secondary"
                >아이디</label
              >
              <input
                v-model="userId"
                type="text"
                class="form-block-input"
                placeholder="아이디를 입력하세요"
                @keyup.enter="handleLogin"
              />
            </div>

            <div class="mb-5 text-start">
              <label
                class="form-label fw-bold small text-secondary d-flex align-items-center"
              >
                비밀번호
                <span
                  @click="showPassword = !showPassword"
                  style="cursor: pointer; margin-left: 8px; font-size: 1.2rem"
                  title="비밀번호 보기/숨기기"
                >
                  {{ showPassword ? '🐵' : '🙈' }}
                </span>
              </label>

              <input
                v-model="userPw"
                :type="showPassword ? 'text' : 'password'"
                class="form-block-input"
                placeholder="비밀번호를 입력하세요"
                @keyup.enter="handleLogin"
              />
            </div>

            <div class="d-grid gap-2 mb-4">
              <button type="submit" class="btn btn-yellow-main py-2 fw-bold">
                로그인
              </button>
            </div>

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
  await loginStore.handleLogin(userId.value, userPw.value);
};

const showPassword = ref(false); // 비밀번호 보이기 상태
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
}
.login-container {
  max-width: 900px;
}
.login-card {
  border-radius: 40px !important;
  border: 1px solid #eaeaea !important;
}

/* 진한 노란색 타이틀 */
.pc-title,
.mobile-inner-title {
  font-size: 3rem;
  font-weight: 800;
  color: #ffd700 !important;
}

/* 지구 */
.earth-orbit-wrapper {
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.earth {
  width: 100px;
  height: 100px;
  background-color: #5596e6;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  box-shadow: inset 10px 0 0 rgba(0, 0, 0, 0.1);
  z-index: 2;
}

/* 육지 스타일 */
.land {
  background-color: #9edb67;
  position: absolute;
  border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
}

.land-1 {
  width: 60px;
  height: 80px;
  top: 10px;
  right: -5px;
  transform: rotate(-10deg);
}

.land-2 {
  width: 35px;
  height: 25px;
  bottom: 8px;
  left: 15px;
}

.land-3 {
  width: 25px;
  height: 45px;
  top: 15px;
  left: -5px;
  opacity: 0.8;
}

/* 달 스타일 */
.moon {
  position: absolute;
  width: 25px;
  height: 25px;
  background: radial-gradient(circle at 30% 30%, #707070 0%, #404040 100%);
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
  z-index: 3;
  animation: orbit 6s linear infinite;
}

@keyframes orbit {
  from {
    transform: rotate(0deg) translateX(85px) rotate(0deg);
  }
  to {
    transform: rotate(360deg) translateX(85px) rotate(-360deg);
  }
}

/* 블록형 입력 필드 스타일 */
.form-block-input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #dddddd;
  border-radius: 8px;
  background-color: #f5f5f5;
  color: #333333;
  outline: none;
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
}

/* 입력 필드 효과 */
.form-block-input:focus {
  border-color: #ffd700;
  box-shadow: 0 0 5px rgba(255, 215, 0, 0.3);
}

/* 로그인 버튼 */
.btn-yellow-main {
  background-color: #ffd700;
  border: 1px solid #ffd700;
  color: #333;
  border-radius: 12px;
  transition: all 0.2s;
}
.btn-yellow-main:hover {
  background-color: #333;
  color: #ffd700;
  border-color: #333;
}

@media (max-width: 767.98px) {
  .login-container {
    max-width: 420px;
  }
  .mobile-inner-title {
    font-size: 2.2rem;
  }
  .earth-orbit-wrapper {
    transform: scale(0.8);
  }
}
</style>
