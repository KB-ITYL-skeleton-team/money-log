<template>
  <div class="sky">
    <div
      v-for="(star, i) in stars"
      :key="star.id"
      class="star"
      :style="star.style"
    ></div>
    <div class="total">
      <div class="bud"><budget></budget></div>
      <div class="moon"><moon></moon></div>
      <div class="res"><result></result></div>
    </div>
  </div>
</template>

<script>
import result from '@/totalBudget/Result.vue';
import budget from '@/totalBudget/Budget.vue';
import moon from '@/totalBudget/Moon.vue';
import { ref, onMounted } from 'vue';
export default {
  name: 'totalBudget',
  components: { budget, moon, result },
  setup() {
    const stars = ref([]);
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
      stars.value = Array.from({ length: 15 }, createStar);
    }
    function recycle(index) {
      stars.value[index] = createStar();
    }
    onMounted(() => {
      init();
      setInterval(() => {
        const i = Math.floor(Math.random() * 5);
        recycle(i);
      }, 700);
    });
    return { stars };
  },
};
</script>

<style lang="scss" scoped>
// 배경
.sky {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #020617;
  overflow: scroll;
}

// 스크롤바 변경
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: #020617;
}
::-webkit-scrollbar-thumb {
  background: #020617;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #020617;
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

.total {
  background-color: #020617;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 100vw;
  height: 100vh;
}
.bud {
  margin-top: -30px;
}

.moon {
  margin-top: -40vh;
}
.res {
  margin-top: -20vh;
  margin-left: -100px;
}
</style>
