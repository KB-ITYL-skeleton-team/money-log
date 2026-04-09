import { ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';
import { useRouter } from 'vue-router';

export const useLoginStore = defineStore('login', () => {
  const router = useRouter();

  const userId = ref('');
  const userPw = ref('');
  const isLoggedIn = ref(false); // 로그인 여부
  const userName = ref('');
  const currentUser = ref(null); // 로그인한 유저 전체 정보

  // --- 로그인 ---
  const handleLogin = async () => {
    try {
      console.log('handleLogin userStore 확인 ');
      // 1. 서버에 데이터 요청
      const response = await axios.get('http://localhost:3000/users');
      console.log(response.data);

      const users = response.data;
      console.log(users);

      // 2. 입력한 정보와 일치하는 유저 찾기
      const foundUser = users.find((u) => {
        return (
          String(u.id) === String(userId.value) &&
          String(u.password) === String(userPw.value)
        );
      });

      console.log('찾은 결과:', foundUser);

      // 3. 유저를 찾으면 로그인 성공
      if (foundUser) {
        console.log('성공! 유저 정보:', foundUser);
        isLoggedIn.value = true;

        currentUser.value = foundUser;
        userName.value = foundUser.name;

        alert(`${foundUser.name}님 환영합니다!`);
        router.push('/home'); // 로그인 하면 홈으로 이동
      } else {
        // 로그인 실패
        alert('아이디 또는 비밀번호가 일치하지 않습니다.');
      }
    } catch (error) {
      console.error('서버 연결 에러:', error);
      alert('인터넷 연결을 확인하세요');
    }
  };

  // --- 아이디 찾기 ---
  const findId = async (inputEmail) => {
    try {
      const response = await axios.get('http://localhost:3000/users');
      const users = response.data;

      // 입력받은 이메일과 일치하는 유저 찾기
      const foundUser = users.find((u) => u.email === inputEmail);

      if (foundUser) {
        // 아이디를 찾았을 경우 알림
        alert(`찾으시는 아이디는 [ ${foundUser.userId} ] 입니다.`);
      } else {
        alert('해당 이메일로 등록된 아이디가 없습니다.');
      }
    } catch (error) {
      console.error('아이디 찾기 중 에러:', error);
      alert('서버와 통신 중 오류가 발생했습니다.');
    }
  };

  // --- 비밀번호 찾기 ---
  const findPw = async (inputUserId, inputEmail) => {
    try {
      const response = await axios.get('http://localhost:3000/users');
      const users = response.data;

      // 아이디와 이메일이 모두 일치하는 유저 찾기
      const foundUser = users.find(
        (u) =>
          String(u.userId) === String(inputUserId) && u.email === inputEmail,
      );

      if (foundUser) {
        // 실제로는 임시 비밀번호를 발송하거나 재설정 페이지로 보내야 하지만,
        // 현재는 학습용이므로 직접 비밀번호를 알려주는 방식으로 구현합니다.
        alert(
          `${foundUser.name}님의 비밀번호는 [ ${foundUser.password} ] 입니다.`,
        );
      } else {
        alert('입력하신 정보와 일치하는 회원이 없습니다.');
      }
    } catch (error) {
      console.error('비밀번호 찾기 에러:', error);
      alert('서버와 통신 중 오류가 발생했습니다.');
    }
  };

  // --- 마이페이지 ---
  // 회원 탈퇴
  const deleteAccount = async () => {
    if (!currentUser.value) {
      alert('로그인 정보가 없습니다.');
      return;
    }

    if (!confirm('정말로 탈퇴하시겠습니까? 계정과 모든 데이터가 삭제됩니다.'))
      return;

    try {
      // 서버에 삭제 요청
      await axios.delete(`http://localhost:3000/users/${currentUser.value.id}`);

      // 탈퇴 성공하면 모든 정보 초기화
      currentUser.value = null;
      isLoggedIn.value = false;
      userId.value = '';
      userPw.value = '';
      userName.value = '';

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
    currentUser,
    isLoggedIn,
    userName,
    handleLogin,
    findId,
    findPw,
    deleteAccount,
  };
});
