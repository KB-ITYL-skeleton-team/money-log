<template>
  <nav class="footer-nav">
    <RouterLink to="/transactionList">🌍 홈</RouterLink>
    <RouterLink to="/fortune">🔮 운세</RouterLink>
    <RouterLink to="/statics">📊 통계</RouterLink>
    <RouterLink to="/totalBudget">💰 예산</RouterLink>
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

  /* 🌌 우주 배경 */
  background: radial-gradient(circle at top, #0b1120, #020617);
  border-top: 1px solid rgba(255, 255, 255, 0.08);

  /* 은은한 glow */
  box-shadow:
    0 -5px 20px rgba(59, 130, 246, 0.15),
    0 -2px 10px rgba(139, 92, 246, 0.1);

  z-index: 100;
}

/* 메뉴 기본 스타일 */
.footer-nav a {
  text-decoration: none;
  color: #cbd5f5;
  font-size: 14px;
  font-weight: 500;

  position: relative;
  transition: all 0.3s ease;
}

/* 🌠 hover 효과 (우주 느낌 핵심) */
.footer-nav a:hover {
  color: #ffffff;
  text-shadow:
    0 0 5px #3b82f6,
    0 0 10px #8b5cf6,
    0 0 20px #8b5cf6;
}

/* ✨ 선택된 메뉴 강조 */
.footer-nav a.router-link-active {
  color: #ffffff;

  text-shadow:
    0 0 8px #60a5fa,
    0 0 15px #a78bfa;

  transform: translateY(-2px);
}

/* 🚀 아래 빛나는 라인 */
.footer-nav a.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);

  width: 6px;
  height: 6px;
  border-radius: 50%;

  background: #8b5cf6;
  box-shadow:
    0 0 8px #8b5cf6,
    0 0 15px #8b5cf6;
}
</style>
