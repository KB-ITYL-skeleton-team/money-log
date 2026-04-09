<template>
  <div>
    <h1>Income (Yearly)</h1>

    <!-- 연도 선택 -->
    <label
      >Year:
      <input
        type="number"
        v-model.number="selectedYear"
        min="2000"
        max="2100"
      />
    </label>

    <div v-if="filteredYear">
      <h2>Year: {{ filteredYear.year }} | Total: {{ filteredYear.total }}</h2>

      <div v-for="group in filteredYear.categories" :key="group.categoryId">
        <h3>
          Category: {{ group.categoryId }} | Sum: {{ group.total }} |
          Percentage:{{ group.percentage }}
        </h3>

        <ul>
          <li v-for="item in group.incomes" :key="item.id">
            {{ item.amount }} ({{ item.date }})
          </li>
        </ul>
      </div>
    </div>

    <p v-else>해당 연도 데이터 없음</p>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useTransactionsStore } from '@/stores/stores';
import { storeToRefs } from 'pinia';

export default {
  name: 'yearStaticsIncome',

  setup() {
    const transactions = useTransactionsStore();
    const { income } = storeToRefs(transactions);

    // 선택된 연도 (기본값: 현재 연도)
    const selectedYear = ref(new Date().getFullYear());

    // 연도별 그룹화
    const incomeByYear = computed(() => {
      const result = {};

      income.value.forEach((inc) => {
        const year = inc.date.slice(0, 4);

        if (!result[year]) {
          result[year] = {
            categories: {},
            total: 0,
          };
        }

        if (!result[year].categories[inc.categoryId]) {
          result[year].categories[inc.categoryId] = {
            incomes: [],
            total: 0,
          };
        }

        result[year].categories[inc.categoryId].incomes.push(inc);

        // 카테고리 합계
        result[year].categories[inc.categoryId].total += inc.amount;

        // 연도 총합
        result[year].total += inc.amount;
      });

      return Object.entries(result).map(([year, data]) => ({
        year,
        total: data.total,
        categories: Object.entries(data.categories).map(
          ([categoryId, categoryData]) => ({
            categoryId,
            incomes: categoryData.incomes,
            total: categoryData.total,
            percentage:
              data.total === 0 ? 0 : (categoryData.total / data.total) * 100,
          }),
        ),
      }));
    });

    // 선택한 연도만 필터링
    const filteredYear = computed(() => {
      return incomeByYear.value.find(
        (y) => Number(y.year) === selectedYear.value,
      );
    });

    return { selectedYear, filteredYear };
  },
};
</script>
