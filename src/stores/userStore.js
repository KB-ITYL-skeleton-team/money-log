import { ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';
import { useRouter } from 'vue-router';

export const useLoginStore = defineStore('login', () => {
  const router = useRouter();

  const userId = ref('');
  const userPw = ref('');
  const isRemembered = ref(false);
  const isLoggedIn = ref(false);
  const userName = ref('');

  const handleLogin = async () => {
    try {
      console.log('handleLogin userStore 확인 ');
      // 1. 서버에 데이터 요청
      const response = await axios.get('http://localhost:3000/users');
      console.log(response.data);

      const users = response.data;
      console.log(users);

      // 2. 유저 찾기
      const foundUser = users.find((u) => {
        return (
          String(u.id) === String(userId.value) &&
          String(u.password) === String(userPw.value)
        );
      });

      console.log('찾은 결과:', foundUser);

      if (foundUser) {
        console.log('성공! 유저 정보:', foundUser);
        isLoggedIn.value = true;
        userName.value = foundUser.name;

        alert(`${foundUser.name}님 환영합니다!`);
        router.push('/home');
      } else {
        alert('아이디 또는 비밀번호가 일치하지 않습니다.');
      }
    } catch (error) {
      console.error('서버 연결 에러:', error);
      alert('인터넷 연결을 확인하세요');
    }
  };

  return { userId, userPw, isRemembered, isLoggedIn, userName, handleLogin };
});
