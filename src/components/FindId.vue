<template>
  <div class="find-id-wrapper d-flex align-items-center justify-content-center">
    <div class="container find-id-container">
      <div class="find-id-card p-4 p-md-5 shadow-lg bg-white">
        <h1 class="pc-title d-none d-md-block mb-5 text-center text-md-start">
          아이디 찾기
        </h1>

        <div class="row align-items-center">
          <div class="col-12 col-md-5 text-center mb-4 mb-md-0 icon-section">
            <h1 class="d-md-none mb-4 mobile-inner-title">
              아이디 찾기 <span style="font-size: 1.5rem">🔍</span>
            </h1>
            <div class="user-icon-area">
              <div class="user-icon">
                <span style="font-size: 3.5rem">🔍</span>
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
                class="form-underline"
                placeholder="이메일을 입력하세요"
              />
            </div>

            <div class="d-grid gap-2 mb-4">
              <button
                @click="handleFindId"
                class="btn btn-find-id py-2 fw-bold"
              >
                아이디 찾기
              </button>
            </div>

            <div class="text-center">
              <router-link
                to="/loginPage"
                class="back-link small text-secondary"
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
  background: no-repeat center center / cover;
  padding: 20px;
}

/* 로그인 화면과 완전히 동일한 컨테이너 크기 */
.find-id-container {
  width: 100%;
  max-width: 650px;
}

.find-id-card {
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

/* 입력창 밑줄 */
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

.btn-find-id {
  background-color: #ffffff;
  border: 1px solid #333;
  color: #333;
  border-radius: 12px;
  transition: all 0.2s;
}

.btn-find-id:hover {
  background-color: #333;
  color: #fff;
}

.back-link {
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}

/* --- 아이폰 12 프로 대응 (390px) --- */
@media (max-width: 767.98px) {
  .find-id-container {
    max-width: 390px;
    padding: 0 10px;
  }

  .find-id-card {
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
