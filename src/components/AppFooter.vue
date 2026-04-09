<template>
  <nav class="footer-nav">
    <RouterLink to="/transactionList">홈</RouterLink>
    <!-- <RouterLink to="/transactionForm">등록</RouterLink> -->
    <RouterLink to="/summaryCard">통계</RouterLink>
    <RouterLink to="/budgetCard">예산</RouterLink>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>

<style scoped>
.footer-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;

  display: flex;
  justify-content: space-around;
  align-items: center;

  height: 70px;
  background: #ffffff;

  border-top: 1px solid #e5e7eb;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);

  z-index: 100;
}

.footer-nav a {
  text-decoration: none;
  color: #333;
  font-size: 14px;
}
</style>
