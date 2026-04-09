<template>
  <div>
    <h1>Expense (Yearly)</h1>

    <!-- 연도 선택 -->
    <label>
      <input
        type="number"
        v-model.number="selectedYear"
        min="2000"
        max="2100"
      />
    </label>

    <!-- 도넛 차트 -->
    <apexchart
      v-if="filteredYear"
      type="donut"
      :options="chartOptions"
      :series="series"
      width="400"
    />

    <div v-if="filteredYear">
      <h2>Year: {{ filteredYear.year }} | Total: {{ filteredYear.total }}</h2>

      <div v-for="group in filteredYear.categories" :key="group.categoryId">
        <h3>
          Category: {{ group.categoryId }} | Sum: {{ group.total }} |
          Percentage: {{ group.percentage.toFixed(1) }}%
        </h3>

        <ul>
          <li v-for="item in group.expenses" :key="item.id">
            {{ item.memo }} : {{ item.amount }} ({{ item.date }})
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
import VueApexCharts from 'vue3-apexcharts';

export default {
  name: 'yearStaticsExpense',
  components: { apexchart: VueApexCharts },

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
          group[year] = { categories: {}, total: 0 };
        }

        if (!group[year].categories[exp.categoryId]) {
          group[year].categories[exp.categoryId] = { expenses: [], total: 0 };
        }

        group[year].categories[exp.categoryId].expenses.push(exp);
        group[year].categories[exp.categoryId].total += exp.amount;
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
    const filteredYear = computed(() =>
      expenseYear.value.find((y) => Number(y.year) === selectedYear.value),
    );

    // 도넛 차트용 데이터
    const series = computed(() =>
      filteredYear.value
        ? filteredYear.value.categories.map((c) => c.total)
        : [],
    );

    const chartOptions = computed(() => ({
      labels: filteredYear.value
        ? filteredYear.value.categories.map((c) => c.categoryId)
        : [],
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total',
                formatter: () =>
                  filteredYear.value ? filteredYear.value.total : 0,
              },
            },
          },
        },
      },
      legend: { position: 'bottom' },
      dataLabels: { enabled: true },
      colors: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff'],
    }));

    return { selectedYear, filteredYear, series, chartOptions };
  },
};
</script>

<style scoped>
input {
  width: 80px;
  margin-bottom: 20px;
  display: block;
}
</style>
