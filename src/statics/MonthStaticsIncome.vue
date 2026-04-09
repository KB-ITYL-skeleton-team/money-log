<template>
  <div class="content">
    <h1>Income (Monthly)</h1>
    <!-- select month -->
    <input type="month" v-model="selectedMonth" />

    <!-- chart -->
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
          Category: {{ categoryName[group.categoryId] }} | Sum:
          {{ group.total }} | Percentage: {{ group.percentage.toFixed(1) }}%
        </h3>

        <ul>
          <li v-for="item in group.incomes" :key="item.id">
            ({{ item.date }}) : {{ item.amount }}, ({{ item.memo }})
          </li>
        </ul>
      </div>
    </div>

    <p v-else>Nothing</p>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts';
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useTransactionsStore } from '@/stores/stores';

export default {
  name: 'monthStaticsIncome',
  components: { apexchart: VueApexCharts },
  setup() {
    const transactions = useTransactionsStore();
    const { income, categories } = storeToRefs(transactions);

    // selected month initializition
    const selectedMonth = ref(new Date().toISOString().slice(0, 7));

    // grouping income by month/category
    const incomeByMonth = computed(() => {
      const result = {};

      income.value.forEach((income) => {
        const month = income.date.slice(0, 7);

        if (!result[month]) {
          result[month] = { categories: {}, total: 0 };
        }

        if (!result[month].categories[income.categoryId]) {
          result[month].categories[income.categoryId] = {
            incomes: [],
            total: 0,
          };
        }

        result[month].categories[income.categoryId].incomes.push(income);
        result[month].categories[income.categoryId].total += income.amount;
        result[month].total += income.amount;
      });

      return Object.entries(result).map(([month, data]) => ({
        month: month,
        total: data.total,
        categories: Object.entries(data.categories).map(
          ([categoryId, category]) => ({
            categoryId: categoryId,
            incomes: category.incomes,
            total: category.total,
            percentage:
              data.total === 0 ? 0 : (category.total / data.total) * 100,
          }),
        ),
      }));
    });

    // catrgory name
    const categoryName = computed(() => {
      const name = {};
      categories.value.forEach((category) => {
        name[category.id] = category.name;
      });
      return name;
    });

    // filter month
    const filteredMonth = computed(() =>
      incomeByMonth.value.find((m) => m.month === selectedMonth.value),
    );

    // data for chart
    const series = computed(() =>
      filteredMonth.value
        ? filteredMonth.value.categories.map((c) => c.total)
        : [],
    );

    const chartOptions = computed(() => ({
      labels: filteredMonth.value
        ? filteredMonth.value.categories.map(
            (c) => categoryName.value[c.categoryId],
          )
        : [],
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total Income',
                formatter: () =>
                  filteredMonth.value ? filteredMonth.value.total : 0,
              },
            },
          },
        },
      },
      legend: { position: 'bottom' },
      dataLabels: { enabled: true },
      colors: ['#4caf50', '#ff9800', '#2196f3', '#9c27b0', '#e91e63'],
    }));

    return { selectedMonth, categoryName, filteredMonth, series, chartOptions };
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
