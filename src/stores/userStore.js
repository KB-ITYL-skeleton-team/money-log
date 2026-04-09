import { ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';
import { useRouter } from 'vue-router';

export const useLoginStore = defineStore('login', () => {
  const router = useRouter();

  const userId = ref('');
  const userPw = ref('');
  const isLoggedIn = ref(false);
  const userName = ref('');
  const currentUser = ref(null);

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

  const deleteAccount = async () => {
    if (!currentUser.value) return;

    if (!confirm('정말로 탈퇴하시겠습니까? 계정과 모든 데이터가 삭제됩니다.'))
      return;

    try {
      await axios.delete(`http://localhost:3000/users/${currentUser.value.id}`);

      currentUser.value = null;
      isLoggedIn.value = false;
      userId.value = '';
      userPw.value = '';

      alert('탈퇴가 완료되었습니다.');
      router.push('/loginPage'); // 탈퇴 후 로그인 페이지로 이동
    } catch (error) {
      console.error('탈퇴 에러:', error);
      alert('탈퇴 처리 중 오류가 발생했습니다.');
    }
  };

  return {
    userId,
    userPw,

    isLoggedIn,
    userName,
    handleLogin,
    deleteAccount,
  };
});
