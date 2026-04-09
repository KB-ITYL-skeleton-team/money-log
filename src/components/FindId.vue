<template>
  <div>
    <h2>아이디 찾기</h2>
    <div>
      <label>등록된 이메일</label>
      <input v-model="email" type="text" placeholder="이메일을 입력하세요" />
    </div>

    <button @click="handleFindId">아이디 찾기</button>

    <div><router-link to="/loginPage">로그인으로 돌아가기</router-link></div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useLoginStore } from '@/stores/userStore';

const email = ref('');
const loginStore = useLoginStore();

const handleFindId = async () => {
  if (!email.value) {
    alert('이메일을 입력해 주세요.');
    return;
  }

  console.log('입력한 이메일:', email.value);
  await loginStore.findId(email.value);
};
</script>
<style></style>
