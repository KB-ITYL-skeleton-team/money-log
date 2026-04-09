<template></template>

<script></script>

<!-- <template>
  <div>
    <h2>회원가입</h2>

    <div>
      <div>
        <label>이름</label>
        <input v-model="userName" type="text" placeholder="이름" />
      </div>
      <div>
        <label>아이디</label>
        <input v-model="userId" type="text" placeholder="아이디" />
      </div>

      <div>
        <label>이메일</label>
        <input v-model="userEmail" type="email" placeholder="이메일" />
      </div>

      <div>
        <label>비밀번호</label>
        <input v-model="userPw" type="password" placeholder="비밀번호" />
      </div>

      <div>
        <label>비밀번호 확인</label>
        <input
          v-model="userPwConfirm"
          type="password"
          placeholder="비밀번호 확인"
        />
      </div>
    </div>

    <p v-if="userPw !== userPwConfirm && userPwConfirm">
      비밀번호가 일치하지 않습니다
    </p>
    <button type="submit">가입완료</button>

    <p>
      이미 계정이 있으신가요?
      <span @click="router.push('/login')">로그인</span>
    </p>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useLoginStore } from '@/stores/userStore';

const router = useRouter();

const form = ref({
  id:keyid,
  userId: '',
  email: '',
  userPw: '',
  userPwConfirm: '',
});

const handleSignUp = () => async () => {
  // 1. 유효성 검사 (비밀번호 일치 여부)
  if (userPw.value !== userPwConfirm) {
    alert('비밀번호가 서로 다릅니다. 다시 확인해주세요.');
    return;
  }

  // 2. 필수 입력값 확인
  const success = await useLoginStore.signup({
    id: userId.value,
    email: email.value,
    password: password.value,
  });

  // 3. 가입 성공하면 로그인 페이지로 이동
  if (success) {
    alert('회원가입이 정상적으로 완료되었습니다!');
    router.push('/login');
  } else {
    alert('모든 정보를 입력해주세요.');
  }
};
</script> -->
