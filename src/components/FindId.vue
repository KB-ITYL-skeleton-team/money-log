<template>
  <div class="find-id-wrapper d-flex align-items-center justify-content-center">
    <div class="container find-id-container">
      <div class="find-id-card p-4 p-md-5 shadow-lg bg-white">
        <h1
          class="pc-title d-none d-md-block mb-5 text-center text-md-start title-yellow"
        >
          아이디 찾기
        </h1>

        <div class="row align-items-center">
          <div class="col-12 col-md-5 text-center mb-4 mb-md-0 icon-section">
            <h1 class="d-md-none mb-4 mobile-inner-title title-yellow">
              아이디 찾기
            </h1>
            <div class="planet-area">
              <div class="mercury">
                <div class="crater crater-1"></div>
                <div class="crater crater-2"></div>
                <div class="crater crater-3"></div>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-7 ps-md-4 form-section">
            <div class="mb-4 text-start">
              <label class="form-label fw-bold small text-secondary mb-1"
                >등록된 이메일</label
              >
              <input
                v-model="email"
                type="text"
                class="form-block-input"
                placeholder="이메일을 입력하세요"
                @keyup.enter="handleFindId"
              />
            </div>

            <div class="d-grid gap-2 mb-4">
              <button
                @click="handleFindId"
                class="btn btn-yellow-main py-2 fw-bold"
              >
                아이디 찾기
              </button>
            </div>

            <div class="text-center">
              <router-link
                to="/loginPage"
                class="back-to-login small text-secondary"
              >
                로그인으로 돌아가기
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

const email = ref('');
const loginStore = useLoginStore();

const handleFindId = async () => {
  if (!email.value) {
    alert('이메일을 입력해 주세요.');
    return;
  }
  await loginStore.findId(email.value);
};
</script>

<style scoped>
.find-id-wrapper {
  min-height: 100vh;

  padding: 20px;
}

.find-id-container {
  width: 100%;
  max-width: 650px;
}

.find-id-card {
  border-radius: 40px !important;
  border: 1px solid #eaeaea !important;
  background-color: #ffffff;
}

/* [추가] 타이틀 노란색 스타일 */
.title-yellow {
  color: #ffd700 !important;
  font-weight: 800;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.pc-title {
  font-size: 3rem;
}

/* 수성 행성 스타일 */
.planet-area {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 150px;
}
.mercury {
  position: relative;
  width: 100px;
  height: 100px;
  background: radial-gradient(
    circle at 30% 30%,
    #a5a5a5 0%,
    #7c7c7c 50%,
    #575757 100%
  );
  border-radius: 50%;
  box-shadow: inset -10px -10px 20px rgba(0, 0, 0, 0.5);
  animation: float 3s infinite ease-in-out;
}
.crater {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.15);
  border-radius: 50%;
}
.crater-1 {
  width: 18px;
  height: 18px;
  top: 20%;
  left: 25%;
}
.crater-2 {
  width: 12px;
  height: 12px;
  bottom: 30%;
  right: 20%;
}
.crater-3 {
  width: 8px;
  height: 8px;
  top: 55%;
  left: 55%;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* [수정] 이메일 입력창 블록형 스타일 */
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

/* [수정] 노란색 메인 버튼 (정보수정 스타일) */
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

/* [수정] 돌아가기 링크 호버 시 빨간색 */
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
  .find-id-container {
    max-width: 390px;
  }
  .find-id-card {
    border-radius: 30px !important;
    padding: 35px 20px !important;
  }
  .mobile-inner-title {
    font-size: 2.2rem;
  }
  .mercury {
    width: 80px;
    height: 80px;
  }
}
</style>
