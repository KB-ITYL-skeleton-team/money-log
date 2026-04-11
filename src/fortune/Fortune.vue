<template>
  <div class="sky">
    <div
      v-for="(star, i) in stars"
      :key="star.id"
      class="star"
      :style="star.style"
    ></div>
    <div class="fortunement" v-if="shown">
      <div class="content" :class="{ shadeIn: shadeInMent }">
        {{ fortune }}
      </div>
      <br />
      <div class="retry" :class="{ shadeIn: shadeInMent }" @click="reload">
        다시 뽑고 싶다면 이곳을 눌러보세요!
      </div>
    </div>
    <div class="moon" v-if="show">
      <div class="dot" :class="{ explode: exploded }" @click="explode"></div>
      <br />
      <p class="ment" :class="{ shadeOut: shadeOutMent }">달을 클릭해보세요!</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import data from '../../fortune.json';
import soundURL from '@/fortune/MP_Ta Da.mp3';
export default {
  name: 'fortune',
  setup() {
    function reload() {
      window.location.reload();
    }

    const fortune = ref('');
    const exploded = ref(false);
    const animating = ref(false);
    const show = ref(true);
    const shown = ref(false);
    const shadeOutMent = ref(false);
    const shadeInMent = ref(false);

    const clickSound = new Audio(soundURL);

    function playSound() {
      clickSound.currentTime = 0;
      clickSound.play();
    }

    function explode() {
      if (animating.value) {
        return;
      }

      animating.value = true;
      exploded.value = true;
      shadeOutMent.value = true;

      setTimeout(() => {
        const list = data.fortunes;
        const index = Math.floor(Math.random() * list.length);
        fortune.value = list[index];
        animating.value = false;
        exploded.value = false;
        show.value = false;
        shown.value = true;
        shadeInMent.value = false;
        playSound();

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            shadeInMent.value = true;
          });
        });
      }, 3000);
    }

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
      stars.value = Array.from({ length: 10 }, createStar);
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

    return {
      reload,
      show,
      shown,
      shadeOutMent,
      shadeInMent,
      fortune,
      exploded,
      explode,
      stars,
      animating,
    };
  },
};
</script>

<style scoped>
.sky {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #020617;

  display: flex;
  justify-content: flex-start;
  align-items: center;

  flex-direction: column;
  padding-top: 30vh;
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

.dot {
  position: relative;

  width: clamp(150px, 14vw, 300px);
  height: clamp(150px, 14vw, 300px);

  background: rgba(250, 204, 21, 0.803);
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(250, 204, 21, 0.803);
  cursor: pointer;
}

.dot.explode {
  animation: shadeoutMoon 3s linear 1;
}

@keyframes shadeoutMoon {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  10% {
    transform: scale(2);
    opacity: 0.9;
  }
  20% {
    transform: scale(4);
    opacity: 0.8;
  }
  30% {
    transform: scale(6);
    opacity: 0.7;
  }
  40% {
    transform: scale(8);
    opacity: 0.6;
  }
  50% {
    transform: scale(10);
    opacity: 0.5;
  }
  60% {
    transform: scale(12);
    opacity: 0.4;
  }
  70% {
    transform: scale(14);
    opacity: 0.3;
  }
  80% {
    transform: scale(16);
    opacity: 0.2;
  }
  90% {
    transform: scale(18);
    opacity: 0.1;
  }
  100% {
    transform: scale(20);
    opacity: 0;
  }
}

.ment {
  position: relative;
  color: rgba(250, 204, 21, 0.4);
  opacity: 1;
  transition: opacity 3s ease;
}

.ment.shadeOut {
  opacity: 0;
}

.content {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 80vw;
  max-width: 1000px;

  font-size: clamp(16px, 4vw, 40px);
  color: rgba(250, 204, 21, 0.803);

  text-align: center;
  word-break: keep-all;

  opacity: 0;
  transition: opacity 2s linear;
}

.content.shadeIn {
  opacity: 1;
}

.moon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.fortunement {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 3vh;
}

.retry {
  opacity: 0;
  transition: opacity 2s linear;
  color: rgba(250, 204, 21, 0.4);
  cursor: pointer;
}

.retry.shadeIn {
  opacity: 1;
}
</style>
