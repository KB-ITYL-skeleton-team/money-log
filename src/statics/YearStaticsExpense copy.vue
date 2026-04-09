<template>
  <div>
    <h1>Expense (Yearly)</h1>

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
          Percentage: {{ group.percentage }}
        </h3>

        <ul>
          <li v-for="item in group.expenses" :key="item.id">
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
  name: 'yearStaticsExpense',

  setup() {
    const transactions = useTransactionsStore();
    const { expense } = storeToRefs(transactions);

    const selectedYear = ref(new Date().getFullYear());

    // 연도별 그룹화
    const expenseYear = computed(() => {
      const group = {};

      expense.value.forEach((exp) => {
        const year = exp.date.slice(0, 4);

        if (!group[year]) {
          group[year] = {
            categories: {},
            total: 0,
          };
        }

        if (!group[year].categories[exp.categoryId]) {
          group[year].categories[exp.categoryId] = {
            expenses: [],
            total: 0,
          };
        }

        group[year].categories[exp.categoryId].expenses.push(exp);

        // 카테고리 합계
        group[year].categories[exp.categoryId].total += exp.amount;

        // 연도 총합
        group[year].total += exp.amount;
      });

      return Object.entries(group).map(([year, data]) => ({
        year,
        total: data.total,
        categories: Object.entries(data.categories).map(
          ([categoryId, categoryData]) => ({
            categoryId,
            expenses: categoryData.expenses,
            total: categoryData.total,
            percentage:
              data.total === 0 ? 0 : (categoryData.total / data.total) * 100,
          }),
        ),
      }));
    });

    // 선택한 연도만 필터링
    const filteredYear = computed(() => {
      return expenseYear.value.find(
        (y) => Number(y.year) === selectedYear.value,
      );
    });

    return { selectedYear, filteredYear };
  },
};
</script>
