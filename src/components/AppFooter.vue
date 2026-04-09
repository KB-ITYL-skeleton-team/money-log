<template>
  <nav class="footer-nav footer">
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
  height: 60px;
  background: white;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 1000;
}

/* ===== 모바일에서만 보이게 ===== */
@media (max-width: 768px) {
  .footer-nav {
    display: flex;
  }
  #app {
    padding-bottom: 70px;
  }
}
</style>
