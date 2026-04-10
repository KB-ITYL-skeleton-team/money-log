<template>
  <div
    class="signup-wrapper d-flex align-items-center justify-content-center mt-md-5 pb-5"
  >
    <div class="container signup-container">
      <h1 class="pc-title d-none d-md-block mb-5 text-center text-md-start">
        회원가입
      </h1>

      <!-- 페이지 새로고침으로 삭제 방지 -->
      <form
        @submit.prevent="submitSignup"
        class="signup-card p-4 p-md-5 border rounded-5 shadow-sm bg-white"
      >
        <h1 class="d-md-none mb-5 mobile-inner-title text-center">회원가입</h1>

        <h3 class="h5 fw-bold mb-4 text-secondary">개인정보</h3>

        <div class="row info-content-area">
          <div class="col-12 col-md-6 pe-md-4 mb-4 mb-md-0 section-divider">
            <div class="mb-4">
              <label class="form-label fw-bold small text-secondary mb-1"
                >이름</label
              >
              <div class="input-with-icon">
                <input
                  v-model="name"
                  type="text"
                  class="form-underline"
                  placeholder="이름을 입력하세요"
                />
                <span class="valid-icon" v-if="name.length > 0">
                  <span v-if="isNameValid" style="color: green">✅</span>
                  <span v-else style="color: red">❌</span>
                </span>
              </div>
            </div>

            <div class="mb-4">
              <label class="form-label fw-bold small text-secondary mb-1"
                >전화번호</label
              >
              <div class="input-with-icon">
                <input
                  v-model="phone"
                  type="text"
                  class="form-underline"
                  placeholder="010-0000-0000"
                />
                <span class="valid-icon" v-if="phone.length > 0">
                  <span v-if="isPhoneValid" style="color: green">✅</span>
                  <span v-else style="color: red">❌</span>
                </span>
              </div>
            </div>

            <div class="mb-4">
              <label class="form-label fw-bold small text-secondary mb-1"
                >이메일</label
              >
              <div class="input-with-icon">
                <input
                  v-model="email"
                  type="text"
                  class="form-underline"
                  placeholder="ex123@example.com"
                />
                <span class="valid-icon" v-if="email.length > 0">
                  <span v-if="isEmailValid" style="color: green">✅</span>
                  <span v-else style="color: red">❌</span>
                </span>
              </div>
            </div>

            <div class="mb-4">
              <label class="form-label fw-bold small text-secondary mb-1"
                >아이디</label
              >
              <div class="d-flex gap-2">
                <div class="input-with-icon flex-grow-1">
                  <input
                    v-model="userId"
                    type="text"
                    class="form-underline"
                    placeholder="아이디"
                    @input="isIdChecked = false"
                  />
                  <span class="valid-icon" v-if="userId.length > 0">
                    <span v-if="isIdChecked" style="color: green">✅</span>
                    <span v-else style="color: red">❌</span>
                  </span>
                </div>
                <button
                  type="button"
                  @click="checkId"
                  class="btn btn-outline-dark btn-sm rounded-pill px-3"
                >
                  중복확인
                </button>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-6 ps-md-4">
            <div class="mb-4">
              <label class="form-label fw-bold small text-secondary mb-1"
                >비밀번호</label
              >
              <div class="input-with-icon">
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-underline"
                  placeholder="영문+숫자 7자 이상"
                />
                <button
                  type="button"
                  class="eye-btn"
                  @click="showPassword = !showPassword"
                >
                  {{ showPassword ? '🙈' : '👁️' }}
                </button>
                <span class="valid-icon pw-valid" v-if="password.length > 0">
                  <span v-if="isPwValid" style="color: green">✅</span>
                  <span v-else style="color: red">❌</span>
                </span>
              </div>
            </div>

            <div class="mb-5">
              <label class="form-label fw-bold small text-secondary mb-1"
                >비밀번호 확인</label
              >
              <div class="input-with-icon">
                <input
                  v-model="passwordConfirm"
                  :type="showPasswordConfirm ? 'text' : 'password'"
                  class="form-underline"
                  placeholder="비밀번호 확인"
                />
                <button
                  type="button"
                  class="eye-btn"
                  @click="showPasswordConfirm = !showPasswordConfirm"
                >
                  {{ showPasswordConfirm ? '🙈' : '👁️' }}
                </button>
                <span
                  class="valid-icon pw-valid"
                  v-if="passwordConfirm.length > 0"
                >
                  <span v-if="isPwConfirmValid" style="color: green">✅</span>
                  <span v-else style="color: red">❌</span>
                </span>
              </div>
            </div>

            <div class="d-grid gap-2 mb-3 mt-auto">
              <button
                type="submit"
                class="btn btn-dark-custom py-2 rounded-3 fw-bold"
              >
                가입하기
              </button>
              <button
                type="button"
                @click="router.push('/loginPage')"
                class="btn btn-outline-secondary py-2 rounded-3 FW-bold"
              >
                가입취소
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useLoginStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';
import axios from 'axios';

const loginStore = useLoginStore();
const router = useRouter();

const name = ref('');
const phone = ref('');
const email = ref('');
const userId = ref('');
const password = ref('');
const passwordConfirm = ref('');
const isIdChecked = ref(false); // 아이디 중복 확인 변수

// 비밀번호 보이기, 숨기기 상태 관리 변수
const showPassword = ref(false);
const showPasswordConfirm = ref(false);

// --- 유효성 검사 로직  ---
// 이름 오타없이 완전한 글자로
const isNameValid = computed(() => /^[가-힣]+$/.test(name.value));
// 전화번호 형식
const isPhoneValid = computed(() => /^010-\d{4}-\d{4}$/.test(phone.value));
// 이메일 형식
const isEmailValid = computed(() =>
  /^[a-zA-A0-9._%+-]+@[a-zA-A0-9.-]+\.[a-zA-A]{2,}$/.test(email.value),
);
// 비밀번호 형식
const isPwValid = computed(() => {
  const pw = password.value;
  if (!pw) return false;

  // 영문(?=.*[a-zA-Z])과 숫자(?=.*[0-9])가 모두 포함된 7자 이상(.{7,})인지 검사
  const regExp = /^(?=.*[a-zA-Z])(?=.*[0-9]).{7,}$/;

  return regExp.test(pw);
});

// 비밀번호와 비밀번호 확인 일치한지
const isPwConfirmValid = computed(
  () => password.value !== '' && password.value === passwordConfirm.value,
);

const checkId = async () => {
  if (!userId.value) return alert('아이디를 입력하세요.');
  try {
    const res = await axios.get(
      `http://localhost:3000/users?userId=${userId.value}`,
    );
    if (res.data.length > 0) {
      alert('이미 사용 중인 아이디입니다.');
      isIdChecked.value = false;
    } else {
      alert('사용 가능한 아이디입니다.');
      isIdChecked.value = true;
    }
  } catch (e) {
    alert('중복 확인 중 오류가 발생했습니다.');
  }
};

const submitSignup = async () => {
  if (
    !isNameValid.value ||
    !isPhoneValid.value ||
    !isEmailValid.value ||
    !isIdChecked.value ||
    !isPwValid.value ||
    !isPwConfirmValid.value
  ) {
    alert('입력 칸에 정보를 모두 작성하고 중복 확인을 완료해주세요.');
    return;
  }
  await loginStore.handleSignup({
    name: name.value,
    phone: phone.value,
    email: email.value,
    userId: userId.value,
    password: password.value,
  });
};
</script>

<style scoped>
/* 카드 스타일 */
.signup-card {
  border-radius: 40px !important;
  border: 1px solid #eaeaea !important;
}

/* PC용 타이틀 */
.pc-title {
  font-size: 3rem;
  font-weight: 800;
  color: #333;
}

/* 입력창 밑줄 스타일 */
.form-underline {
  width: 100%;
  padding: 10px 0;
  border: none;
  border-bottom: 2px solid #333;
  background: transparent;
  outline: none;
  transition: border-color 0.3s;
}

.form-underline:focus {
  border-bottom-color: #2c7a90;
}

/* 아이콘 및 체크 표시 위치 */
.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.valid-icon {
  position: absolute;
  right: 5px;
  top: 10px;
}

/*  비밀번호 가리기, 보이기 아이콘 */
.valid-icon.pw-valid {
  right: 35px;
}

.eye-btn {
  position: absolute;
  right: 0px;
  top: 10px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-size: 1.2rem;
}

/* 가입하기 버튼 스타일 */
.btn-dark-custom {
  background-color: #ffffff;
  border: 1px solid #333;
  color: #333;
  transition: all 0.2s;
}

.btn-dark-custom:hover {
  background-color: #333;
  color: #fff;
}

/* [앱/모바일 환경 설정] 
/* 아이폰 12 프로 (너비 390px) */
@media (max-width: 767.98px) {
  .signup-container {
    max-width: 390px;
    padding: 0 10px;
  }

  .signup-card {
    border-radius: 25px !important;
    padding: 25px 15px !important;
    margin: 0 5px;
    border: 1px solid #eee !important;
  }

  .mobile-inner-title {
    font-size: 2rem;
    font-weight: 800;
    color: #333;
    margin-bottom: 30px !important;
  }

  .info-content-area .col-12:first-child {
    border-right: none !important;
    margin-bottom: 20px;
  }
}

/* [웹/PC 환경 설정] */
@media (min-width: 768px) {
  .section-divider {
    border-right: 1px solid #eee;
  }
}
</style>
