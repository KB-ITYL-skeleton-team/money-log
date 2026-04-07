<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <!-- 로고 -->
      <RouterLink class="navbar-brand" to="/">MoneyLog</RouterLink>
      <!-- 햄버거 버튼 -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- 메뉴 -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/loginPage"> 로그인 </RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink class="nav-link" to="/transactionList">
              목록
            </RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink class="nav-link" to="/transactionForm">
              거래등록
            </RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink class="nav-link" to="/summaryCard"> 통계 </RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink class="nav-link" to="/budgetCard"> 예산 </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>

<style scoped></style>
