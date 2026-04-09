<template>
  <nav class="footer-nav">
    <RouterLink to="/transactionList">목록</RouterLink>
    <RouterLink to="/transactionForm">등록</RouterLink>
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
  height: 60px;
  background: white;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 1000;
}

.footer-nav a {
  text-decoration: none;
  color: #333;
  font-size: 14px;
}
</style>
