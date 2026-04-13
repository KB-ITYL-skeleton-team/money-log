<template>
  <div class="app-background">
    <!-- 모바일 전용: 위 이미지 -->
    <div class="mobile-side-image mobile-left"></div>

    <router-view />

    <!-- 모바일 전용: 아래 이미지 -->
    <div class="mobile-side-image mobile-right"></div>
  </div>
</template>

<style>
.app-background {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  background-image: url('@/assets/giphy3.gif'), url('@/assets/guide.jpeg');
  background-repeat: no-repeat, no-repeat;

  /* 수정 포인트 */
  background-position:
    left 15% center,
    right 15% center;

  background-size:
    55% auto,
    25% auto;
}

/* 모바일용 이미지는 기본 숨김 */
.mobile-side-image {
  display: none;
}

/* 모바일 반응형 */
@media (max-width: 767px) {
  .app-background {
    /* 모바일에서는 배경 2장 제거 */
    background-image: none;
    background-repeat: initial;
    background-position: initial;
    background-size: initial;
  }

  .mobile-side-image {
    display: block;
    width: 100%;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    flex-shrink: 0;
  }

  /* 왼쪽 이미지 -> 모바일에서는 좀 더 작게 */
  .mobile-left {
    height: 220px;
    background-image: url('@/assets/giphy3.gif');
    background-size: 70% auto;
    margin-top: 12px;
    margin-bottom: 16px;
  }

  /* 오른쪽 이미지 -> 아래쪽에 표시 */
  .mobile-right {
    height: 180px;
    background-image: url('@/assets/guide.jpeg');
    background-size: 50% auto;
    margin-top: 16px;
    margin-bottom: 20px;
  }
}
</style>
