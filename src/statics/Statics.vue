<template>
  <div>
    <div class="top">
      <router-link to="/statics/yearStatics">Year Statics</router-link>
      <router-link to="/statics/monthStatics">Month Statics</router-link>
    </div>
    <div class="bottom">
      <div class="left"><RouterView name="left"></RouterView></div>
      <div class="right"><RouterView name="right"></RouterView></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Statics',
};
</script>

<style lang="scss" scoped>
.bottom {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-around;
  background-color: #020617;
  color: white;
}
</style>
