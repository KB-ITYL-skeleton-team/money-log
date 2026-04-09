<template>
  <div>
    <h2>비밀번호 찾기</h2>

    <div>
      <label>아이디</label>
      <input v-model="userId" type="text" placeholder="아이디를 입력하세요" />
    </div>

    <div>
      <label>이메일</label>
      <input
        v-model="email"
        type="email"
        placeholder="등록된 이메일을 입력하세요"
      />
    </div>

    <button @click="handleFindPw">비밀번호 확인</button>

    <div>
      <router-link to="/loginPage">취소</router-link>
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
