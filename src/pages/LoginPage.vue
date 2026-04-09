<template>
  <div class="container mt-5">
    <div class="mb-3">
      <input
        v-model="userId"
        type="text"
        class="form-control"
        placeholder="아이디"
      />
    </div>
    <div class="mb-3">
      <input
        v-model="userPw"
        type="password"
        class="form-control"
        placeholder="비밀번호"
      />
    </div>
  </div>

  <button @click="handleLogin" class="btn btn-primary w-100 mb-3">
    로그인
  </button>

  <div class="d-flex justify-content-between">
    <router-link to="/signup" class="text-decoration-none"
      >회원가입</router-link
    >
    <div>
      <router-link to="/find-id" class="text-decoration-none"
        >아이디 찾기</router-link
      >
      <span class="mx-1">|</span>
      <router-link to="/find-pw" class="text-decoration-none"
        >비밀번호 찾기</router-link
      >
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useLoginStore } from '@/stores/userStore';

const userId = ref('');
const userPw = ref('');

const router = useRouter();
const loginStore = useLoginStore();

const handleLogin = async () => {
  if (!userId.value.trim() || !userPw.value.trim()) {
    alert('아이디와 비밀번호를 모두 입력해주세요.');
    return;
  }
  loginStore.userId = userId.value;
  loginStore.userPw = userPw.value;

  await loginStore.handleLogin(userId.value, userPw.value);
};
</script>
