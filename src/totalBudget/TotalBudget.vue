<template>
  <div>
    <div class="total">
      <div class="moon"><moon></moon></div>
      <div class="bud"><budget></budget></div>
    </div>
  </div>
</template>

<script>
import budget from '@/totalBudget/Budget.vue';
import moon from '@/totalBudget/Moon.vue';
export default {
  name: 'totalBudget',
  components: { budget, moon },
};
</script>

<style lang="scss" scoped>
.total {
  background-color: #020617;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-around;
}

.bud {
  color: white;
}
</style>
