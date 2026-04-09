<template>
  <div>
    <h1>Expense (Monthly)</h1>

    <!-- 월 선택 -->
    <input type="month" v-model="selectedMonth" />

    <!-- 도넛 차트 -->
    <apexchart
      v-if="filteredMonth"
      type="donut"
      :options="chartOptions"
      :series="series"
      width="400"
    />

    <div v-if="filteredMonth">
      <h2>
        Month: {{ filteredMonth.month }} | Total: {{ filteredMonth.total }}
      </h2>

      <div v-for="group in filteredMonth.categories" :key="group.categoryId">
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

    <p v-else>해당 월 데이터 없음</p>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useTransactionsStore } from '@/stores/stores';
import { storeToRefs } from 'pinia';
import VueApexCharts from 'vue3-apexcharts';

export default {
  name: 'monthStaticsExpense',
  components: { apexchart: VueApexCharts },
  setup() {
    const transactions = useTransactionsStore();
    const { expense } = storeToRefs(transactions);

    const selectedMonth = ref(new Date().toISOString().slice(0, 7));

    const expenseByMonth = computed(() => {
      const result = {};

      expense.value.forEach((exp) => {
        const month = exp.date.slice(0, 7);

        if (!result[month]) result[month] = { categories: {}, total: 0 };

        if (!result[month].categories[exp.categoryId]) {
          result[month].categories[exp.categoryId] = { expenses: [], total: 0 };
        }

        result[month].categories[exp.categoryId].expenses.push(exp);
        result[month].categories[exp.categoryId].total += exp.amount;
        result[month].total += exp.amount;
      });

      return Object.entries(result).map(([month, data]) => ({
        month,
        total: data.total,
        categories: Object.entries(data.categories).map(
          ([categoryId, cat]) => ({
            categoryId,
            expenses: cat.expenses,
            total: cat.total,
            percentage: data.total === 0 ? 0 : (cat.total / data.total) * 100,
          }),
        ),
      }));
    });

    const filteredMonth = computed(() =>
      expenseByMonth.value.find((m) => m.month === selectedMonth.value),
    );

    // 도넛 차트용 데이터
    const series = computed(() =>
      filteredMonth.value
        ? filteredMonth.value.categories.map((c) => c.total)
        : [],
    );

    const chartOptions = computed(() => ({
      labels: filteredMonth.value
        ? filteredMonth.value.categories.map((c) => c.categoryId)
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
                  filteredMonth.value ? filteredMonth.value.total : 0,
              },
            },
          },
        },
      },
      legend: { position: 'bottom' },
      dataLabels: { enabled: true },
      colors: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff'],
    }));

    return { selectedMonth, filteredMonth, series, chartOptions };
  },
};
</script>

<style scoped>
input {
  width: 120px;
  margin-bottom: 20px;
  display: block;
}
</style>
