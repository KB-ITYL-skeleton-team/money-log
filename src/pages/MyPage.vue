<template>
  <div class="mypage-wrapper container mt-5 pb-5">
    <header class="d-flex justify-content-start mb-4">
      <button
        @click="$router.push('/transactionList')"
        class="btn btn-outline-dark btn-sm rounded-pill px-3"
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
        <div class="profile-img-wrapper position-relative d-inline-block">
          <div
            class="profile-img bg-secondary rounded-circle d-flex align-items-center justify-content-center text-white mx-auto"
            style="
              width: 140px;
              height: 140px;
              font-size: 3rem;
              overflow: hidden;
            "
          >
            {{ loginStore.currentUser?.name?.charAt(0) }}
          </div>
          <div class="mt-3">
            <h4 class="fw-bold m-0">{{ loginStore.currentUser?.name }}님</h4>
            <p class="text-muted small">반가워요!</p>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-7 ps-md-5 form-section">
        <section class="card p-4 rounded-4 border shadow-sm bg-white">
          <div class="info-list">
            <div class="mb-4">
              <label class="form-label fw-bold small text-secondary mb-1"
                >아이디</label
              >
              <p class="m-0 border-bottom pb-2 text-muted">
                {{ loginStore.currentUser?.userId }}
              </p>
              <small class="text-muted">아이디는 변경되지 않습니다.</small>
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
                >한글로 입력해주세요</small
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
            class="btn py-2 fw-bold"
            :class="isEditMode ? 'btn-dark' : 'btn-outline-dark'"
          >
            {{ isEditMode ? '변경 내용 저장' : '정보 수정하기' }}
          </button>
          <button
            v-if="isEditMode"
            @click="cancelEdit"
            class="btn btn-outline-secondary py-2"
          >
            취소
          </button>
          <button
            v-else
            @click="confirmDelete"
            class="btn btn-link text-danger text-decoration-none small mt-2"
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
.mypage-wrapper {
  max-width: 900px;
}

/* PC용 타이틀 (로그인 화면 스타일) */
.pc-title {
  font-size: 3rem;
  font-weight: 800;
  color: #333;
}

/* 모바일용 타이틀 */
.mobile-inner-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: #333;
}

/* 입력창 밑줄 스타일 */
.form-control-custom {
  width: 100%;
  padding: 10px 0; 
  border: none;
  border-bottom: 2px solid #ddd;
  background: transparent;
  outline: none;
  transition: 0.3s;
}
.form-control-custom:focus {
  border-bottom-color: #333;
}

.pw-icon {
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
  font-size: 1.2rem;
}

/* 📱 반응형 대응 */
@media (max-width: 767.98px) {
  .login-container {
    max-width: 420px;
  }
  .icon-section {
    margin-bottom: 2rem;
  }
}

@media (min-width: 768px) {
  .icon-section {
    border-right: 1px solid #eee;
  }
}
</style>
