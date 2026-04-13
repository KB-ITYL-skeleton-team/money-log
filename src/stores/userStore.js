import { ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';
import { useRouter } from 'vue-router';

export const useLoginStore = defineStore('login', () => {
  const router = useRouter();

  // --- 상태(State) ---
  const userId = ref(''); // 입력창 아이디
  const userPw = ref(''); // 입력창 비밀번호
  const isLoggedIn = ref(false); // 로그인 여부
  const userName = ref(''); // 유저 이름
  const currentUser = ref(null); // 로그인한 유저 전체 정보 객체

  // --- 스토리지 저장 ---

  // localStorage 저장
  const setLoginUser = (foundUser) => {
    currentUser.value = foundUser;
    isLoggedIn.value = true;
    userName.value = foundUser.name;
    localStorage.setItem('loginUser', JSON.stringify(foundUser));
  };

  // localStorage 불러오기
  const loadUser = () => {
    const savedUser = localStorage.getItem('loginUser');

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      currentUser.value = parsedUser;
      isLoggedIn.value = true;
      userName.value = parsedUser.name;
    }
  };

  // 로그아웃
  const logout = () => {
    currentUser.value = null;
    isLoggedIn.value = false;
    userId.value = '';
    userPw.value = '';
    userName.value = '';
    localStorage.removeItem('loginUser');
    router.push('/loginPage');
  };

  // --- 로그인 로직 ---
  const handleLogin = async () => {
    try {
      const response = await axios.get('http://localhost:3000/users');
      const users = response.data;

      const foundUser = users.find((u) => {
        return (
          String(u.userId) === String(userId.value) &&
          String(u.password) === String(userPw.value)
        );
      });

      if (foundUser) {
        isLoggedIn.value = true;
        currentUser.value = foundUser;
        userName.value = foundUser.name;

        alert(`${foundUser.name}님 환영합니다!`);
        setLoginUser(foundUser);
        router.push('/transactionList');
      } else {
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

      const foundUser = users.find((u) => u.email === inputEmail);

      if (foundUser) {
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
  const findPw = async (userId, email) => {
    try {
      const response = await axios.get('http://localhost:3000/users');
      const users = response.data;

      const foundUser = users.find(
        (u) => String(u.userId) === String(userId) && u.email === email,
      );

      if (foundUser) {
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
  // --- 회원 정보 수정  ---
  const updateUser = async (editData) => {
    try {
      const updatedInfo = {
        ...currentUser.value,
        name: editData.name,
        email: editData.email,
        password: editData.newPassword || currentUser.value.password, // 새 비번 없으면 기존 비번
      };

      const response = await axios.put(
        `http://localhost:3000/users/${currentUser.value.id}`,
        updatedInfo,
      );

      if (response.status === 200) {
        // 2. 스토어 상태 및 로컬 스토리지 동기화
        setLoginUser(response.data);
        return true; // 성공 시 true 반환하여 컴포넌트에서 push 하도록 함
      }
    } catch (error) {
      console.error('정보 수정 에러:', error);
      alert('정보 수정 중 오류가 발생했습니다.');
      return false;
    }
  };

  // --- 회원 탈퇴 ---
  const deleteAccount = async () => {
    if (!currentUser.value) {
      alert('로그인 정보가 없습니다.');
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/users/${currentUser.value.id}`);

      currentUser.value = null;
      isLoggedIn.value = false;
      userId.value = '';
      userPw.value = '';
      userName.value = '';

      alert('탈퇴가 완료되었습니다.');
      router.push('/loginPage');
    } catch (error) {
      console.error('탈퇴 에러:', error);
      alert('탈퇴 처리 중 오류가 발생했습니다.');
    }
  };
  //------
  function getId() {
    const now = new Date();
    const yyyymmdd =
      now.getFullYear() +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000);
    return yyyymmdd + random;
  }
  // --- 회원가입 로직 ---
  const handleSignup = async (userData) => {
    try {
      // 1. 서버에 저장할 객체 구성
      // 새로운 회원 id 키 값 생성
      // 형태 : yyyymmdd + 난수 4자리
      const newUser = {
        ...userData,
        id: String(getId()),
        createdAt: new Date().toISOString().split('T')[0], // 가입 날짜
      };
      // 2. 서버에 데이터 전송 (POST 요청)
      await axios.post('http://localhost:3000/users', newUser);
      alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
      // 3. 가입 성공 후 로그인 페이지로 이동
      router.push('/loginPage');
    } catch (error) {
      console.error('회원가입 처리 에러:', error);
      alert('서버 연결 중 오류가 발생했습니다.');
    }
  };

  // --- 아이디 중복 확인 함수 ---
  const checkIdDuplicated = async (userId) => {
    try {
      const response = await axios.get('http://localhost:3000/users');
      const users = response.data;

      // 중복 여부 확인 (있으면 true, 없으면 false)
      return users.some((u) => String(u.userId) === String(userId));
    } catch (error) {
      console.error('중복 확인 에러:', error);
      return true; // 에러 시 안전하게 중복으로 간주
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
    setLoginUser,
    loadUser,
    logout,
    handleSignup,
    updateUser,
    checkIdDuplicated,
  };
});
