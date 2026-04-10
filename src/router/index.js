import { createRouter, createWebHistory } from 'vue-router';

// Page
import HomePage from '@/pages/HomePage.vue';
import LoginPage from '@/pages/LoginPage.vue';
import MyPage from '@/pages/MyPage.vue';
import SignUpPage from '@/pages/SignUpPage.vue';
import TransactionPage from '@/pages/TransactionPage.vue';

// components
import TransactionForm from '@/components/TransactionForm.vue';
import TransactionList from '@/components/TransactionList.vue';

import FindId from '@/components/FindId.vue';
import FindPw from '@/components/FindPw.vue';

import statics from '@/statics/Statics.vue';
import yearStaticsIncome from '@/statics/YearStaticsIncome.vue';
import yearStaticsExpense from '@/statics/YearStaticsExpense.vue';
import monthStaticsIncome from '@/statics/MonthStaticsIncome.vue';
import monthStaticsExpense from '@/statics/MonthStaticsExpense.vue';
import settleExpense from '@/settle/SettleExpense.vue';
import fortune from '@/fortune/Fortune.vue';
import totalBudget from '@/totalBudget/TotalBudget.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 홈으로 가는것, 리스트로 가는것 2개 구현 -> (alias) 사용
    {
      path: '/',
      name: 'homePage',
      component: HomePage,
    },
    {
      path: '/transactionList',
      name: 'transactionList',
      component: TransactionList,
      // alias: '/transactionList',
    },
    {
      path: '/transactionForm',
      name: 'transactionForm',
      component: TransactionForm,
    },
    {
      path: '/loginPage',
      name: 'loginPage',
      component: LoginPage,
    },
    {
      path: '/myPage',
      name: 'myPage',
      component: MyPage,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUpPage,
    },
    {
      path: '/transactionPage',
      name: 'transactionPage',
      component: TransactionPage,
    },
    {
      path: '/find-id',
      name: 'findid',
      component: FindId,
    },
    {
      path: '/find-pw',
      name: 'findpw',
      component: FindPw,
    },

    {
      path: '/statics',
      component: statics,
      redirect: '/statics/monthStatics',
      children: [
        {
          path: 'yearStatics',
          components: {
            left: yearStaticsIncome,
            right: yearStaticsExpense,
          },
        },
        {
          path: 'monthStatics',
          components: {
            left: monthStaticsIncome,
            right: monthStaticsExpense,
          },
        },
      ],
    },

    { path: '/settleExpense', component: settleExpense },
    { path: '/fortune', component: fortune },
    { path: '/totalBudget', component: totalBudget },
  ],
});
// [Auth Guard] 홈/운세/통계/예산은 로그인 필요
router.beforeEach((to) => {
  const savedUser = localStorage.getItem('loginUser');

  // 이 프로젝트에서 name이 없는 라우트(/fortune, /statics, /totalBudget)가 있어서 path로 체크
  const needAuthPaths = ['/homePage', '/fortune', '/statics', '/totalBudget'];
  const needAuth = needAuthPaths.some(
    (base) => to.path === base || to.path.startsWith(base + '/'),
  );

  if (needAuth && !savedUser) {
    alert('로그인이 필요합니다.'); // 또는 '로그인 하세요'
    return { name: 'loginPage' }; // /loginPage로 이동
  }

  return true;
});

export default router;
