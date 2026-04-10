<template>
  <div class="find-pw-wrapper d-flex align-items-center justify-content-center">
    <div class="container find-pw-container">
      <div class="find-pw-card p-4 p-md-5 shadow-lg bg-white">
        <h1 class="pc-title d-none d-md-block mb-5 text-center text-md-start">
          비밀번호 찾기
        </h1>

        <div class="row align-items-center">
          <div class="col-12 col-md-5 text-center mb-4 mb-md-0 icon-section">
            <h1 class="d-md-none mb-4 mobile-inner-title">
              비밀번호 찾기 <span style="font-size: 1.5rem">🔑</span>
            </h1>
            <div class="user-icon-area">
              <div class="user-icon">
                <span style="font-size: 3.5rem">🔑</span>
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
                class="form-underline"
                placeholder="아이디를 입력하세요"
              />
            </div>

            <div class="mb-5 text-start">
              <label class="form-label fw-bold small text-secondary mb-1"
                >이메일</label
              >
              <input
                v-model="email"
                type="email"
                class="form-underline"
                placeholder="등록된 이메일을 입력하세요"
              />
            </div>

            <div class="d-grid gap-2 mb-4">
              <button
                @click="handleFindPw"
                class="btn btn-find-pw py-2 fw-bold"
              >
                비밀번호 확인
              </button>
            </div>

            <div class="text-center">
              <router-link
                to="/loginPage"
                class="back-link small text-secondary"
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
/* 배경 및 전체 래퍼 (로그인/아이디 찾기와 동일) */
.find-pw-wrapper {
  min-height: 100vh;
  background: no-repeat center center / cover;
  padding: 20px;
}

/* 박스 크기 통일 */
.find-pw-container {
  width: 100%;
  max-width: 650px;
}

.find-pw-card {
  border-radius: 40px !important;
  border: 1px solid #eaeaea !important;
  background-color: #ffffff;
}

.pc-title {
  font-size: 3rem;
  font-weight: 800;
  color: #333;
}

/* 왼쪽 원형 아이콘 스타일 */
.user-icon-area {
  display: flex;
  justify-content: center;
  align-items: center;
}

.user-icon {
  width: 120px;
  height: 120px;
  background-color: #2c7a90;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 입력창 밑줄 스타일 */
.form-underline {
  width: 100%;
  padding: 10px 0;
  border: none;
  border-bottom: 2px solid #333;
  background: transparent;
  outline: none;
  transition: border-bottom 0.3s;
}

.form-underline:focus {
  border-bottom: 2px solid #2c7a90;
}

/* 버튼 스타일 */
.btn-find-pw {
  background-color: #ffffff;
  border: 1px solid #333;
  color: #333;
  border-radius: 12px;
  transition: all 0.2s;
}

.btn-find-pw:hover {
  background-color: #333;
  color: #fff;
}

.back-link {
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}

/* 모바일 */
@media (max-width: 767.98px) {
  .find-pw-container {
    max-width: 390px;
    padding: 0 10px;
  }

  .find-pw-card {
    border-radius: 30px !important;
    padding: 40px 25px !important;
    margin: 0 5px;
  }

  .mobile-inner-title {
    font-size: 2rem;
    font-weight: 800;
    color: #333;
  }
}
</style>
