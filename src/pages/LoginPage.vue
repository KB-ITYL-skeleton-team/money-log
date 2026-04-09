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

// 로그인 버튼 클릭 시 실행
const handleLogin = async () => {
  console.log('handle login  확인');

  // 입력한 아이디를 스토어에 전달해서 스토어가 서버와 통신할 때 꺼낼 수 있도록
  loginStore.userId = userId.value;
  loginStore.userPw = userPw.value;

  // 로그인 완료될 때까지 기다림
  await loginStore.handleLogin();
};
</script>
