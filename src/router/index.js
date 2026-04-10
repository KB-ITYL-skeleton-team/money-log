import { createRouter, createWebHistory } from 'vue-router';

// Page
import IntroPage from '@/pages/IntroPage.vue';
import HomePage from '@/pages/HomePage.vue';
import LoginPage from '@/pages/LoginPage.vue';
import MyPage from '@/pages/MyPage.vue';
import SignUpPage from '@/pages/SignUpPage.vue';
import TransactionPage from '@/pages/TransactionPage.vue';

// components
import TransactionForm from '@/components/TransactionForm.vue';
import TransactionItem from '@/components/TransactionItem.vue';
import TransactionList from '@/components/TransactionList.vue';
import SummaryCard from '@/components/SummaryCard.vue';
import BudgetCard from '@/components/BudgetCard.vue';

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
    {
      path: '/',
      name: 'introPage',
      component: IntroPage,
    },

    // 홈으로 가는것, 리스트로 가는것 2개 구현 -> (alias) 사용
    {
      path: '/transactionList',
      name: 'transactionList',
      component: TransactionList,
      // alias: '/transactionList',
    },

    {
      path: '/transactionItem',
      name: 'transactionItem',
      component: TransactionItem,
    },
    {
      path: '/transactionForm',
      name: 'transactionForm',
      component: TransactionForm,
    },
    {
      path: '/summaryCard',
      name: 'summaryCard',
      component: SummaryCard,
    },
    {
      path: '/budgetCard',
      name: 'budgetCard',
      component: BudgetCard,
    },
    {
      path: '/homePage',
      name: 'homePage',
      component: HomePage,
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

export default router;
