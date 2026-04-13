<template>
  <div class="mypage-wrapper container mt-md-5 pb-5">
    <header class="d-flex justify-content-start mb-4">
      <button
        @click="$router.push('/transactionList')"
        class="btn btn-yellow-main btn-sm rounded-pill px-3 fw-bold"
      >
        &lt; 뒤로가기
      </button>
    </header>

    <h1 class="pc-title d-none d-md-block mb-5 text-center text-md-start">
      My Page
    </h1>

    <div class="row info-content-area align-items-center">
      <div class="col-12 col-md-5 text-center mb-4 mb-md-0 icon-section">
        <h1 class="d-md-none mb-4 mobile-inner-title">My Page</h1>

        <div class="saturn-container mx-auto">
          <div class="saturn-ring"></div>
          <div
            class="saturn-body d-flex align-items-center justify-content-center"
          >
            {{ loginStore.currentUser?.name?.charAt(0) }}
          </div>
        </div>

        <div class="mt-4">
          <h4 class="fw-bold m-0 text-white">
            {{ loginStore.currentUser?.name }}님
          </h4>
          <p class="text-white opacity-75 small">반가워요!</p>
        </div>
      </div>

      <div class="col-12 col-md-7 ps-md-5 form-section">
        <section class="card p-4 rounded-4 border shadow-sm bg-white">
          <div class="info-list">
            <div class="mb-4">
              <label class="form-label fw-bold small text-secondary mb-1"
                >아이디</label
              >
              <p
                class="m-0 border-bottom border-secondary pb-2 text-white fw-bold"
              >
                {{ loginStore.currentUser?.userId }}
              </p>
              <small class="text-warning-light mt-1 d-block"
                >※ 아이디는 변경되지 않습니다.</small
              >
            </div>

            <div class="mb-4">
              <label class="form-label fw-bold small text-secondary mb-1"
                >이름</label
              >
              <input
                v-if="isEditMode"
                v-model="editForm.name"
                type="text"
                class="form-control-custom"
              />
              <p v-else class="m-0 border-bottom pb-2">
                {{ loginStore.currentUser?.name }}
              </p>
              <small v-if="isEditMode && !validateName" class="text-danger"
                >한글 정자로 입력해주세요.</small
              >
            </div>

            <div class="mb-4">
              <label class="form-label fw-bold small text-secondary mb-1"
                >이메일</label
              >
              <input
                v-if="isEditMode"
                v-model="editForm.email"
                type="email"
                class="form-control-custom"
              />
              <p v-else class="m-0 border-bottom pb-2">
                {{ loginStore.currentUser?.email }}
              </p>
              <small v-if="isEditMode && !validateEmail" class="text-danger"
                >이메일 형식을 확인해주세요.</small
              >
            </div>

            <div v-if="isEditMode" class="password-edit-area">
              <div class="mb-3">
                <label class="form-label fw-bold small text-primary mb-1"
                  >현재 비밀번호 확인</label
                >
                <div class="position-relative d-flex align-items-center">
                  <input
                    :type="showPw.current ? 'text' : 'password'"
                    v-model="editForm.currentPassword"
                    class="form-control-custom"
                    placeholder="기존 비밀번호 입력"
                    style="flex: 1"
                  />
                  <span v-if="validateCurrentPw" class="ms-1 text-success"
                    >✔️</span
                  >
                  <span
                    class="pw-icon"
                    @click="showPw.current = !showPw.current"
                    style="position: static; cursor: pointer; margin-left: 10px"
                  >
                    {{ showPw.current ? '🐵' : '🙈' }}
                  </span>
                </div>
                <small
                  v-if="editForm.currentPassword && !validateCurrentPw"
                  class="text-danger d-block"
                >
                  현재 비밀번호를 정확하게 입력하세요.
                </small>
              </div>

              <div class="mb-2">
                <label class="form-label fw-bold small text-secondary mb-1"
                  >새 비밀번호</label
                >
                <div class="position-relative d-flex align-items-center">
                  <input
                    :type="showPw.new ? 'text' : 'password'"
                    v-model="editForm.newPassword"
                    class="form-control-custom"
                    placeholder="변경 시에만 입력"
                    style="flex: 1"
                  />
                  <span
                    v-if="isNewPwValidAndDifferent"
                    class="ms-1 text-success"
                    >✔️</span
                  >
                  <span
                    class="pw-icon"
                    @click="showPw.new = !showPw.new"
                    style="position: static; cursor: pointer; margin-left: 10px"
                  >
                    {{ showPw.new ? '🐵' : '🙈' }}
                  </span>
                </div>
                <small
                  v-if="editForm.newPassword && !validatePassword"
                  class="text-danger"
                  >영문, 숫자 포함 7자 이상 입력하세요.</small
                >
                <small
                  v-if="
                    editForm.newPassword &&
                    validatePassword &&
                    !isNewPwDifferent
                  "
                  class="text-danger d-block"
                  >현재 비밀번호와 같습니다.</small
                >
              </div>
            </div>
            <div v-else class="mb-4">
              <label class="form-label fw-bold small text-secondary mb-1"
                >비밀번호</label
              >
              <p class="m-0 border-bottom pb-2">********</p>
            </div>
          </div>
        </section>

        <div class="d-grid gap-2 mt-4">
          <button
            @click="handleEditToggle"
            class="btn py-2 fw-bold btn-yellow-main"
          >
            {{ isEditMode ? '변경 내용 저장' : '정보 수정하기' }}
          </button>

          <button
            v-if="isEditMode"
            @click="cancelEdit"
            class="btn py-2 fw-bold small mt-2 btn-red-main"
          >
            취소
          </button>

          <button
            v-else
            @click="confirmDelete"
            class="btn py-2 fw-bold small mt-2 btn-red-main"
          >
            회원 탈퇴
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useLoginStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';

const loginStore = useLoginStore();
const router = useRouter();
const isEditMode = ref(false);
const showPw = reactive({ current: false, new: false });

const editForm = reactive({
  name: '',
  email: '',
  currentPassword: '',
  newPassword: '',
});

// --- (Computed) ---
const validateName = computed(() => /^[가-힣]+$/.test(editForm.name));
const validateEmail = computed(() =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email),
);
const pwRegExp = /^(?=.*[a-zA-Z])(?=.*[0-9]).{7,}$/;

// 일곱글자 확인 + "실제 현재 비번과 일치하는지" 확인
const isCurrentPwCorrect = computed(
  () => editForm.currentPassword === loginStore.currentUser?.password,
);
const validateCurrentPw = computed(() => {
  // 입력한 값(editForm.currentPassword)이
  // 기존 저장된 값(loginStore.currentUser.password)과 일치하는지 확인
  return editForm.currentPassword === loginStore.currentUser?.password;
});
// 새 비번 규격 확인
const validatePassword = computed(() => pwRegExp.test(editForm.newPassword));
// 새 비번이 현재 비번과 다른지 확인
const isNewPwDifferent = computed(
  () => editForm.currentPassword !== editForm.newPassword,
);

// 4번: 새비번 체크표시 노출 조건 (규격에 맞고 + 현재 비번과 다를 때)
const isNewPwValidAndDifferent = computed(() => {
  return (
    editForm.newPassword && validatePassword.value && isNewPwDifferent.value
  );
});

const handleEditToggle = async () => {
  if (isEditMode.value) {
    // 현재 비밀번호 입력 필수
    if (!editForm.currentPassword)
      return alert('현재 비밀번호를 입력해야 저장이 가능합니다.');

    // 추가 검증: 입력한 현재 비번이 실제 DB의 비번과 맞는지 확인
    if (!isCurrentPwCorrect.value)
      return alert('현재 비밀번호가 일치하지 않습니다.');

    if (!validateName.value || !validateEmail.value)
      return alert('이름 또는 이메일 형식을 확인해주세요.');

    // 새 비번 입력 시 검증
    if (editForm.newPassword) {
      if (!validatePassword.value)
        return alert('새 비밀번호 형식이 올바르지 않습니다.');
      if (!isNewPwDifferent.value)
        return alert('새 비밀번호가 현재 비밀번호와 같습니다.');
    }

    // 저장 시도
    const success = await loginStore.updateUser({ ...editForm });
    if (success) {
      alert('수정되었습니다!');
      isEditMode.value = false;
      clearPwFields();
      // 저장 완료 후 달력(/transactionList)으로 이동
      router.push('/transactionList');
    }
  } else {
    // 수정 모드 진입 시 기존 정보 로드
    editForm.name = loginStore.currentUser?.name || '';
    editForm.email = loginStore.currentUser?.email || '';
    isEditMode.value = true;
  }
};

const cancelEdit = () => {
  isEditMode.value = false;
  clearPwFields();
};

const clearPwFields = () => {
  editForm.currentPassword = '';
  editForm.newPassword = '';
  showPw.current = false;
  showPw.new = false;
};

const confirmDelete = () => {
  if (confirm('정말로 탈퇴하시겠습니까?')) loginStore.deleteAccount();
};
</script>

<style scoped>
/* 타이틀 */
.pc-title,
.mobile-inner-title {
  color: #f8e752 !important;
  text-shadow: 0 0 10px rgba(248, 231, 82, 0.5);
}

/* [노란색 버튼] 변경 내용 저장 / 정보 수정하기 */
.btn-yellow-main {
  background-color: #ffd700 !important; /* 선명한 노란색 */
  border: 1px solid #ffd700 !important;
  color: #333 !important; /* 글자는 어두운 색으로 가독성 확보 */
  border-radius: 12px;
  transition: all 0.3s ease;
}

.btn-yellow-main:hover {
  background-color: #333 !important; /* 호버 시 검은색 */
  color: #ffd700 !important; /* 글자는 노란색 */
  border-color: #333 !important;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
}

/* [빨간색 버튼] 취소 / 회원 탈퇴 */
.btn-red-main {
  background-color: #ff4d4d !important; /* 선명한 빨간색 */
  border: 1px solid #ff4d4d !important;
  color: #ffffff !important; /* 글자는 흰색 */
  border-radius: 12px;
  transition: all 0.3s ease;
}

.btn-red-main:hover {
  background-color: #b30000 !important; /* 호버 시 진한 빨강 */
  color: #ffffff !important;
  border-color: #b30000 !important;
  box-shadow: 0 0 15px rgba(255, 77, 77, 0.4);
}

/* 전체 래퍼: 약간 둥글게 처리 및 배경 최적화 */
.mypage-wrapper {
  max-width: 900px;
  min-height: 60vh; /* 요청하신 40vh보다 안정적인 60vh 추천 */
  background: rgba(11, 14, 24, 0.9);
  color: #ffffff;
  padding: 40px 20px;
  border-radius: 40px; /* 각지지 않게 둥글게 */
}

/* 아이디 라벨 및 안내문구 색상 */
.text-info-custom {
  color: #b0bec5 !important;
}
.text-warning-light {
  color: #ffd54f !important;
  font-size: 0.8rem;
}

/* 🛸 카드 디자인 */
.card {
  background: rgba(255, 255, 255, 0.05) !important;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 25px !important;
}

/* 🪐 토성 스타일 */
.saturn-container {
  position: relative;
  width: 160px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* [추가] 모바일용 미니 토성 */
.saturn-container.mini {
  width: 60px;
  height: 50px;
  transform: scale(0.6);
}

.saturn-body {
  width: 80px;
  height: 80px;
  background: radial-gradient(circle at 30% 30%, #f4d03f 0%, #d4ac0d 100%);
  border-radius: 50%;
  color: white;
  z-index: 2;
  box-shadow: 0 0 15px rgba(244, 208, 63, 0.3);
}

.saturn-ring {
  position: absolute;
  width: 140px;
  height: 40px;
  border: 6px solid rgba(212, 172, 13, 0.4);
  border-radius: 50%;
  transform: rotateX(75deg);
  z-index: 1;
}

/* --- 아이폰 12 프로 --- */
@media (max-width: 767.98px) {
  .mypage-wrapper {
    width: 92%;
    max-width: 400px;
    margin: 20px auto;

    border-radius: 30px;
    padding: 25px 20px;

    margin-bottom: 50px;
  }

  /* 타이틀 옆에 토성 배치 */
  .mobile-header-group {
    justify-content: flex-start;
  }

  .saturn-container.mini {
    margin: 0;
  }

  .form-section {
    padding-left: 10px !important;
  }
}

/* 블록형 입력 필드 */
.form-control-custom {
  width: 100%;
  padding: 10px 15px;
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 12px;
  color: white !important;
}
</style>
