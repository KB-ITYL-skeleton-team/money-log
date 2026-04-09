<template>
  <div>
    <header>
      <button @click="$router.push('/homePage')">뒤로가기</button>
    </header>

    <hr />
  </div>
  <h2>{{ loginStore.currentUser?.name }}</h2>

  <hr />

  <section>
    <h3>개인정보</h3>
    <div>
      <div v-for="(label, key) in userInfoLabels" :key="key">
        <label>{{ label }}</label>

        <input
          v-if="isEditMode"
          v-model="editForm[key]"
          :type="key === 'password' ? 'password' : 'text'"
        />

        <p v-else>{{ loginStore.currentUser?.[key] }}</p>
      </div>
    </div>
  </section>

  <section>
    <button @click="handleEditToggle">
      {{ isEditMode ? '저장하기' : '수정' }}
    </button>

    <button @click="loginStore.deleteAccount">회원 탈퇴</button>
  </section>

  <hr />
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useLoginStore } from '@/stores/userStore';

const loginStore = useLoginStore();
const isEditMode = ref(false);

// 화면에 보여줄 필드와 한글 라벨 매핑
const userInfoLabels = {
  userId: '아이디',
  name: '이름',
  email: '이메일',
  password: '비밀번호',
  phone: '전화번호',
};

// 수정을 위해 입력값을 임시로 담아둘 바구니 (반응형 객체)
const editForm = reactive({
  userId: loginStore.currentUser?.userId || '',
  name: loginStore.currentUser?.name || '',
  email: loginStore.currentUser?.email || '',
  password: loginStore.currentUser?.password || '',
  phone: loginStore.currentUser?.phone || '',
});

// 수정/저장 버튼 클릭 핸들러
const handleEditToggle = async () => {
  if (isEditMode.value) {
    // 저장하기 로직: 스토어의 업데이트 함수 호출
    await loginStore.updateUser({ ...editForm });
    isEditMode.value = false;
  } else {
    // 수정 모드 진입
    isEditMode.value = true;
  }
};
</script>
