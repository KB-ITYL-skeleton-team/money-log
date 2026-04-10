<template>
  <div class="app-background">
    <router-view />
  </div>
</template>

<style>
.app-background {
  min-height: 100vh;

  background-image: url('@/assets/giphy3.gif');
  /* background-image: url('@/assets/moon.png'); */
  /* background-image: url('@/assets/moon.gif'); */
  /* background-image: url('@/assets/giphy.gif'); */
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain; /* 또는 contain */

  display: flex;
  flex-direction: column;
}
</style>
