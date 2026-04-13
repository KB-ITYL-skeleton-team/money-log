<template>
  <div class="sky">
    <div
      v-for="(star, i) in stars"
      :key="star.id"
      class="star"
      :style="star.style"
    ></div>

    <div class="top">
      <div class="box">
        <router-link to="/statics/yearStatics">
          <div class="year"></div>
          <div>연도별 통계</div>
        </router-link>
      </div>

      <div class="box">
        <router-link to="/statics/monthStatics">
          <div class="month"></div>
          <div>월별 통계</div>
        </router-link>
      </div>
    </div>

    <div class="bottom">
      <div class="left"><RouterView name="left"></RouterView></div>
      <div class="right"><RouterView name="right"></RouterView></div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  name: 'Statics',
  setup() {
    const stars = ref([]);
    let timer = null;

    function createStar() {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight * 0.5;
      const distance = 300 + Math.random() * 400;
      const duration = 0.8 + Math.random() * 0.6;

      return {
        id: Math.random(),
        style: {
          left: x + 'px',
          top: y + 'px',
          '--x': distance + 'px',
          '--y': distance + 'px',
          animationDuration: duration + 's',
        },
      };
    }

    function init() {
      stars.value = Array.from({ length: 20 }, createStar);
    }

    function recycle(index) {
      if (!stars.value[index]) return;
      stars.value[index] = createStar();
    }

    onMounted(() => {
      init();

      timer = setInterval(() => {
        const i = Math.floor(Math.random() * stars.value.length);
        recycle(i);
      }, 700);
    });

    onUnmounted(() => {
      clearInterval(timer);
    });

    return { stars };
  },
};
</script>

<style lang="scss" scoped>
.sky {
  position: absolute;
  width: 100vw;
  height: 100vh;
  overflow: scroll;
  background-color: #020617;
  display: flex;
  flex-direction: column;
}

::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: #020617; /* 배경 */
}
::-webkit-scrollbar-thumb {
  background: #020617; /* 막대 */
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #020617;
}

.top {
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color: #020617;
}

.bottom {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  background-color: #020617;
  color: white;
}

.left {
  width: 40vw;
}
.right {
  width: 40vw;
}

.box {
  width: 120px;
  height: 50px;
  margin: 40px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: rgba(250, 204, 21, 0.7);
}

.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  box-shadow: 0 0 8px white;

  animation: shoot 3.5s linear forwards;
}
.star::after {
  content: '';
  position: absolute;
  width: 80px;
  height: 2px;
  background: linear-gradient(to left, white, transparent);
  transform: translateX(-80px);
}
@keyframes shoot {
  0% {
    transform: translate(0, 0) rotate(45deg);
    opacity: 1;
  }

  100% {
    transform: translate(var(--x), var(--y)) rotate(45deg);
    opacity: 0;
  }
}
.year {
  width: 50px;
  height: 50px;
  background-image: url('@/assets/sun.png');
  background-size: cover;
  background-position: center;
}

.month {
  width: 50px;
  height: 50px;
  background-image: url('@/assets/sun.png');
  background-size: cover;
  background-position: center;
}

a {
  color: rgba(250, 204, 21, 0.45);
  text-decoration: none;
}
</style>
