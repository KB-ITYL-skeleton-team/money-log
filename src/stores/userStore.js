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

  const handleLogin = async () => {
    try {
      console.log('handleLogin userStore 확인 ');
      // 1. 서버에 데이터 요청
      const response = await axios.get('http://localhost:3000/users');
      console.log(response.data);

      const users = response.data;
      console.log(users);

      console.log('내가 입력한 아이디:', userId.value);
      console.log('DB에서 온 첫번째 유저 정보:', users[0]);

      // 2. 유저 찾기
      const foundUser = users.find((u) => {
        return (
          String(u.userId) === String(userId.value) &&
          String(u.password) === String(userPw.value)
        );
      });

      console.log('찾은 결과:', foundUser);

      if (foundUser) {
        console.log('성공! 유저 정보:', foundUser);
        isLoggedIn.value = true;
        userName.value = foundUser.name;

        alert(`${foundUser.name}님 환영합니다!`);
        router.push('/homePage');
      } else {
        alert('아이디 또는 비밀번호가 일치하지 않습니다.');
      }
    } catch (error) {
      console.error('서버 연결 에러:', error);
      alert('인터넷 연결을 확인하세요');
    }
  };

  // --- 아이디 찾기 ---
  const findId = async (email) => {
    try {
      const response = await axios.get('http://localhost:3000/users');
      const users = response.data;

      // 입력한 이메일과 일치하는 유저 찾기
      const foundUser = users.find(
        (u) => String(u.email).trim() === String(email).trim(),
      );

      if (foundUser) {
        alert(`찾으시는 아이디는 [ ${foundUser.userId} ] 입니다.`);
        router.push('/loginPage');
      } else {
        alert('해당 이메일로 가입된 아이디가 없습니다.');
      }
    } catch (error) {
      alert('서버 연결에 실패했습니다.');
    }
  };

  // --- 비밀번호 찾기 ---
  const findPw = async (inputId, email) => {
    try {
      const response = await axios.get('http://localhost:3000/users');
      const users = response.data;

      // 아이디와 이메일이 모두 일치하는 유저 찾기
      const foundUser = users.find(
        (u) =>
          String(u.id).trim() === String(userId).trim() &&
          u.email === String(email).trim(),
      );

      if (foundUser) {
        alert(
          `${foundUser.name}님의 비밀번호는 [ ${foundUser.password} ] 입니다.`,
        );
        router.push('/loginPage');
      } else {
        alert('입력하신 정보와 일치하는 회원이 없습니다.');
      }
    } catch (error) {
      alert('서버 연결에 실패했습니다.');
    }
  };
  return { userId, userPw, isLoggedIn, userName, handleLogin, findId, findPw };
});
