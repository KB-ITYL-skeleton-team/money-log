<template>
  <div class="mypage-wrapper container mt-5 pb-5">
    <header class="d-flex justify-content-start mb-4">
      <!-- 뒤로가기 버튼(홈페이지로) -->
      <button
        @click="$router.push('/homePage')"
        class="btn btn-outline-dark btn-sm rounded-pill px-3"
      >
        &lt; 뒤로가기
      </button>
    </header>

    <!-- My Page -->
    <h1 class="pc-title d-none d-md-block mb-5 text-center text-md-start">
      My Page
    </h1>

    <div class="row info-content-area align-items-center">
      <div class="col-12 col-md-5 text-center mb-4 mb-md-0 icon-section">
        <h1 class="d-md-none mb-4 mobile-inner-title">My Page</h1>

        <!-- 이름 이미지 -->
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

      <!-- 유저 아이디 -->
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
            </div>

            <!-- 유저 이름 -->
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
                >이름은 2자 이상이어야 합니다.</small
              >
            </div>

            <!-- 유저 이메일 -->
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
                <div class="position-relative">
                  <input
                    :type="showPw.current ? 'text' : 'password'"
                    v-model="editForm.currentPassword"
                    class="form-control-custom"
                    placeholder="기존 비밀번호 입력"
                  />
                  <span
                    class="pw-icon"
                    @click="showPw.current = !showPw.current"
                    >{{ showPw.current ? '👁️' : '🙈' }}</span
                  >
                </div>
              </div>
              <div class="mb-2">
                <label class="form-label fw-bold small text-secondary mb-1"
                  >새 비밀번호</label
                >
                <div class="position-relative">
                  <input
                    :type="showPw.new ? 'text' : 'password'"
                    v-model="editForm.newPassword"
                    class="form-control-custom"
                    placeholder="변경 시에만 입력"
                  />
                  <span class="pw-icon" @click="showPw.new = !showPw.new">{{
                    showPw.new ? '👁️' : '🙈'
                  }}</span>
                </div>
                <small
                  v-if="editForm.newPassword && !validatePassword"
                  class="text-danger"
                  >영문, 숫자 포함 8자 이상 입력하세요.</small
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

const loginStore = useLoginStore();
const isEditMode = ref(false);

//  비밀번호 보이기, 가리기 (현재, 새 비번)
const showPw = reactive({ current: false, new: false });

// 수정시 입력 값 담을 객체
const editForm = reactive({
  name: '',
  email: '',
  currentPassword: '',
  newPassword: '',
});

// --- (Computed) ---

// 이름 글자수 제한 없이 오타 없는지 확인
const validateName = computed(() => /^[가-힣]+$/.test(editForm.name));

// 이메일 형식만 맞게
const validatePassword = computed(() => {
  const pw = editForm.newPassword;

  // 새 비밀번호 칸이 비어있다면 (수정 안 함) 통과
  if (!pw) return true;

  // 입력했다면 영문+숫자 포함 7자 이상인지 검사
  const regExp = /^(?=.*[a-zA-Z])(?=.*[0-9]).{7,}$/;

  return regExp.test(pw);
});
const handleEditToggle = async () => {
  if (isEditMode.value) {
    if (!validateName.value || !validateEmail.value)
      return alert('입력 형식을 확인해주세요.');
    if (editForm.newPassword && !validatePassword.value)
      return alert('새 비밀번호 형식이 올바르지 않습니다.');
    if (!editForm.currentPassword)
      return alert('현재 비밀번호를 입력해야 저장이 가능합니다.');

    const success = await loginStore.updateUser({ ...editForm });
    if (success) {
      alert('수정되었습니다!');
      isEditMode.value = false;
      clearPwFields();
    }
  } else {
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
