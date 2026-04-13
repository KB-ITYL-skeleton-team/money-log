TML
<template>
  <div
    class="signup-wrapper d-flex align-items-center justify-content-center mt-md-5 pb-5"
  >
    <form
      @submit.prevent="submitSignup"
      class="signup-card p-4 p-md-5 border rounded-5 shadow-sm bg-white"
    >
      <div class="d-flex align-items-center mb-4 gap-3">
        <h1 class="fw-extra-bold display-6 mb-0 signup-title-yellow">
          회원가입
        </h1>
        <div class="planets-box d-none d-sm-flex gap-2">
          <div class="planet jupiter"></div>
          <div class="planet saturn"></div>
          <div class="planet uranus"></div>
          <div class="planet neptune"></div>
        </div>
      </div>

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
                placeholder="한글로 정확히 입력하세요"
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
                  placeholder="아이디 (6자리 이상)"
                  @input="isIdChecked = false"
                />
                <span class="valid-icon" v-if="userId.length > 0">
                  <span v-if="isIdChecked" style="color: green">✅</span>
                  <template v-else>
                    <span v-if="!isIdValid" style="color: red">❌</span>
                    <span v-else style="color: orange">⚠️</span>
                  </template>
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

          <div class="mt-2" style="font-size: 0.75rem">
            <span class="me-2">❌: 6자 미만</span>
            <span class="me-2">⚠️: 중복 확인 필요</span>
            <span>✅: 사용 가능</span>
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
                {{ showPassword ? '🐵' : '🙈' }}
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
                {{ showPasswordConfirm ? '🐵' : '🙈' }}
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
              class="btn btn-yellow-main py-2 rounded-3 fw-bold"
            >
              가입하기
            </button>

            <button
              type="button"
              @click="router.push('/loginPage')"
              class="btn btn-red-cancel py-2 rounded-3 fw-bold"
            >
              가입취소
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useLoginStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';

const loginStore = useLoginStore();
const router = useRouter();
const name = ref('');
const phone = ref('');
const email = ref('');
const userId = ref('');
const password = ref('');
const passwordConfirm = ref('');
const isIdChecked = ref(false); // 아이디 중복 확인 변수
const isEmailUnique = ref(true);

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

// 아이디 형식
const isIdValid = computed(() => userId.value.length >= 6);

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

// --- 중복 확인 버튼 클릭 시 실행 ---
const checkId = async () => {
  // 1. 6자리 미만이면 서버 요청도 안 보냄
  if (userId.value.length < 6) {
    alert('아이디는 6자리 이상이어야 합니다.');
    return;
  }

  // 2. 스토어 함수 호출해서 중복 여부 확인
  const isDuplicated = await loginStore.checkIdDuplicated(userId.value);
  if (isDuplicated) {
    alert('이미 사용 중인 아이디입니다.');
    isIdChecked.value = false; // 중복 확인 실패 상태
  } else {
    alert('사용 가능한 아이디입니다.');
    isIdChecked.value = true; // 중복 확인 완료 상태
  }
};

const submitSignup = async () => {
  // 1. 이름 검사
  if (!name.value.trim()) {
    alert('이름을 입력해주세요.');
    return;
  }
  if (!isNameValid.value) {
    alert('이름을 한글로 정확히 입력해주세요.');
    return;
  }

  // 2. 전화번호 검사
  if (!phone.value.trim()) {
    alert('전화번호를 입력해주세요.');
    return;
  }
  if (!isPhoneValid.value) {
    alert('전화번호 형식이 올바르지 않습니다. (010-0000-0000)');
    return;
  }

  // 3. 이메일 검사
  if (!email.value.trim()) {
    alert('이메일을 입력해주세요.');
    return;
  }
  if (!isEmailValid.value) {
    alert('이메일 형식이 올바르지 않습니다.');
    return;
  }

  // 4. 아이디 검사
  if (!userId.value.trim()) {
    alert('아이디를 입력해주세요.');
    return;
  }
  if (!isIdValid.value) {
    alert('아이디는 6자리 이상이어야 합니다.');
    return;
  }
  if (!isIdChecked.value) {
    alert('아이디 중복 확인을 완료해주세요.');
    return;
  }

  // 5. 비밀번호 검사
  if (!password.value.trim()) {
    alert('비밀번호를 입력해주세요.');
    return;
  }
  if (!isPwValid.value) {
    alert('비밀번호는 영문과 숫자를 포함하여 7자 이상이어야 합니다.');
    return;
  }

  // 6. 비밀번호 확인 검사
  if (!passwordConfirm.value.trim()) {
    alert('비밀번호 확인 칸을 입력해주세요.');
    return;
  }
  if (!isPwConfirmValid.value) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }

  // 모든 검사를 통과하면 서버로 가입 요청 전송
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
/* [가입하기] 정보수정 스타일 (노란색) */
.btn-yellow-main {
  background-color: #ffd700;
  border: 1px solid #ffd700;
  color: #333;
  transition: all 0.2s ease;
}
.btn-yellow-main:hover {
  background-color: #333;
  border-color: #333;
  color: #ffd700;
}

/* [가입취소] 회원탈퇴 스타일 (빨간색) */
.btn-red-cancel {
  background-color: transparent;
  border: 1px solid #ff4d4d;
  color: #ff4d4d;
  transition: all 0.2s ease;
}
.btn-red-cancel:hover {
  background-color: #ff4d4d;
  color: #fff;
  box-shadow: 0 0 10px rgba(255, 77, 77, 0.3);
}

/* 폰트 굵기 보정 */
.fw-bold {
  font-weight: 700 !important;
}
/* 전체 폰트 및 공통 설정 */
.fw-extra-bold {
  font-weight: 800;
  letter-spacing: -1px;
}

.display-6 {
  font-size: 2.5rem;
}

/* [1] 회원가입 타이틀 (로그인 테마 노란색) */
.signup-title-yellow {
  color: #ffd700 !important;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

/* [2] 행성 애니메이션 (목토천해) */
.planets-box {
  display: flex;
  align-items: center;
}
.planet {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  animation: float-planet 3s infinite ease-in-out;
}
.jupiter {
  background: #d39c7e;
  animation-delay: 0s;
}
.saturn {
  background: #f0e2a8;
  animation-delay: 0.5s;
  border: 2px solid #d4c38d;
  position: relative;
}
/* 토성 고리 효과 */
.saturn::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 22px;
  height: 4px;
  border: 1px solid #d4c38d;
  border-radius: 50%;
  transform: translate(-50%, -50%) rotate(-20deg);
}
.uranus {
  background: #b2d8d8;
  animation-delay: 1s;
}
.neptune {
  background: #5b5ddf;
  animation-delay: 1.5s;
}

@keyframes float-planet {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-12px);
  }
}

/* [3] 블록형 입력창 스타일 */
.form-underline {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd !important;
  border-radius: 12px; /* 둥근 블록형 */
  background-color: #f8f9fa; /* 연한 회색 블록 */
  outline: none;
  transition: all 0.3s ease;
}

.form-underline:focus {
  border-color: #ffd700 !important;
  background-color: #ffffff;
  box-shadow: 0 0 8px rgba(255, 215, 0, 0.2);
}

/* 입력 아이콘 위치 최적화 */
.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.valid-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
}

.valid-icon.pw-valid {
  right: 45px;
}

.eye-btn {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 1.2rem;
  padding: 0;
  z-index: 5;
}

/* [4] 노란색 버튼 스타일 */
.btn-yellow-main {
  background-color: #ffd700;
  border: 1px solid #ffd700;
  color: #333;
  transition: all 0.2s ease;
}
.btn-yellow-main:hover {
  background-color: #333;
  border-color: #333;
  color: #ffd700;
}

.btn-outline-yellow-sub {
  background-color: transparent;
  border: 1px solid #ffd700;
  color: #ffd700;
}
.btn-outline-yellow-sub:hover {
  background-color: #ffd700;
  color: #333;
}

/* 카드 및 레이아웃 */
.signup-card {
  max-width: 850px;
  width: 100%;
  border-radius: 40px !important;
  border: 1px solid #eaeaea !important;
}

@media (max-width: 767.98px) {
  .signup-card {
    margin: 0 165px;
    border-radius: 30px !important;
  }
}
</style>
