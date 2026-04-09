import { createRouter, createWebHistory } from 'vue-router';

// Page
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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'transactionList',
      component: TransactionList,
    },
    {
      path: '/transactionList',
      name: 'transactionList',
      component: TransactionList,
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
  ],
});

export default router;
