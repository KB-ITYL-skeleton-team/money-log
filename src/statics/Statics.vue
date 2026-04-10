<template>
  <div>
    <div class="top">
      <div class="box">
        <router-link to="/statics/yearStatics">Year Statics</router-link>
      </div>
      <div class="box">
        <router-link to="/statics/monthStatics">Month Statics</router-link>
      </div>
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
.top {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  // background-color: #020617;
}

.bottom {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-around;
  // background-color: #020617;
  color: white;
}

.box {
  width: 120px;
  height: 50px;
  margin: 20px;
  border: 2px solid yellow;
  background: yellow;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
</style>
