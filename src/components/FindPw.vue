<template>
  <div class="find-pw-wrapper d-flex align-items-center justify-content-center">
    <div class="container find-pw-container">
      <div class="find-pw-card p-4 p-md-5 shadow-lg bg-white">
        <h1
          class="pc-title d-none d-md-block mb-5 text-center text-md-start title-yellow"
        >
          비밀번호 찾기
        </h1>

        <div class="row align-items-center">
          <div class="col-12 col-md-5 text-center mb-4 mb-md-0 icon-section">
            <h1 class="d-md-none mb-4 mobile-inner-title title-yellow">
              비밀번호 찾기
            </h1>

            <div class="space-area">
              <div class="ufo">
                <div class="ufo-glass"></div>
                <div class="ufo-body"></div>
                <div class="ufo-light"></div>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-7 ps-md-4 form-section">
            <div class="mb-4 text-start">
              <label class="form-label fw-bold small text-secondary mb-1"
                >아이디</label
              >
              <input
                v-model="userId"
                type="text"
                class="form-block-input"
                placeholder="아이디를 입력하세요"
                @keyup.enter="handleFindPw"
              />
            </div>

            <div class="mb-5 text-start">
              <label class="form-label fw-bold small text-secondary mb-1"
                >이메일</label
              >
              <input
                v-model="email"
                type="email"
                class="form-block-input"
                placeholder="등록된 이메일을 입력하세요"
                @keyup.enter="handleFindPw"
              />
            </div>

            <div class="d-grid gap-2 mb-4">
              <button
                @click="handleFindPw"
                class="btn btn-yellow-main py-2 fw-bold"
              >
                비밀번호 확인
              </button>
            </div>

            <div class="text-center">
              <router-link
                to="/loginPage"
                class="back-to-login small text-secondary"
              >
                취소
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useLoginStore } from '@/stores/userStore';

const userId = ref('');
const email = ref('');
const loginStore = useLoginStore();

const handleFindPw = async () => {
  if (!userId.value || !email.value) {
    alert('모든 정보를 입력해 주세요.');
    return;
  }
  await loginStore.findPw(userId.value, email.value);
};
</script>

<style scoped>
.find-pw-wrapper {
  min-height: 100vh;
  /* background: #0b0e18; */
  padding: 20px;
}

.find-pw-container {
  width: 100%;
  max-width: 650px;
}

.find-pw-card {
  border-radius: 40px !important;
  border: 1px solid #eaeaea !important;
  background-color: #ffffff;
}

/* 타이틀 노란색 */
.title-yellow {
  color: #ffd700 !important;
  font-weight: 800;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.pc-title {
  font-size: 3rem;
}

/* 🛸 우주선(UFO) 애니메이션 스타일 */
.space-area {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 150px;
  position: relative;
}

.ufo {
  position: relative;
  width: 80px;
  height: 40px;
  animation: fly 4s infinite ease-in-out;
}

.ufo-body {
  position: absolute;
  width: 80px;
  height: 30px;
  background: #95a5a6;
  border-radius: 50px;
  bottom: 0;
  z-index: 2;
}

.ufo-glass {
  position: absolute;
  width: 40px;
  height: 25px;
  background: rgba(52, 152, 219, 0.7);
  border-radius: 50% 50% 0 0;
  top: -5px;
  left: 20px;
  z-index: 1;
}

.ufo-light {
  position: absolute;
  width: 60px;
  height: 80px;
  background: linear-gradient(to bottom, rgba(255, 215, 0, 0.3), transparent);
  clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%);
  top: 25px;
  left: 10px;
  animation: glow 2s infinite alternate;
}

@keyframes fly {
  0%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(-10px, -15px) rotate(-5deg);
  }
  50% {
    transform: translate(10px, -5px) rotate(5deg);
  }
  75% {
    transform: translate(-5px, -20px) rotate(-3deg);
  }
}

@keyframes glow {
  from {
    opacity: 0.2;
  }
  to {
    opacity: 0.7;
  }
}

/* 입력창 블록형 */
.form-block-input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd !important;
  border-radius: 12px;
  background-color: #f8f9fa;
  outline: none;
  transition: all 0.3s;
}

.form-block-input:focus {
  border-color: #ffd700 !important;
  background-color: #fff;
  box-shadow: 0 0 8px rgba(255, 215, 0, 0.2);
}

/* 노란색 메인 버튼 */
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

/* 취소 링크 호버 빨간색 */
.back-to-login {
  text-decoration: none;
  transition: color 0.2s;
  cursor: pointer;
}

.back-to-login:hover {
  color: #ff4d4d !important;
  text-decoration: underline;
}

@media (max-width: 767.98px) {
  .find-pw-container {
    max-width: 390px;
  }
  .find-pw-card {
    border-radius: 30px !important;
    padding: 35px 20px !important;
  }
  .mobile-inner-title {
    font-size: 2.2rem;
  }
  .ufo {
    transform: scale(0.8);
  }
}
</style>
