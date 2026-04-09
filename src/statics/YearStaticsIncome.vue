<template>
  <div>
    <h1>Income (Yearly)</h1>

    <!-- select year -->
    <label>
      <input
        type="number"
        v-model.number="selectedYear"
        min="2000"
        max="2100"
      />
    </label>

    <!-- chart -->
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
  name: 'yearStaticsIncome',
  components: { apexchart: VueApexCharts },

  setup() {
    const transactions = useTransactionsStore();
    const { income, categories } = storeToRefs(transactions);

    // selected year initialization
    const selectedYear = ref(new Date().getFullYear());

    // grouping income by year/category
    const incomeByYear = computed(() => {
      const result = {};

      income.value.forEach((income) => {
        const year = income.date.slice(0, 4);

        if (!result[year]) {
          result[year] = { categories: {}, total: 0 };
        }

        if (!result[year].categories[income.categoryId]) {
          result[year].categories[income.categoryId] = {
            incomes: [],
            total: 0,
          };
        }

        result[year].categories[income.categoryId].incomes.push(income);
        result[year].categories[income.categoryId].total += income.amount;
        result[year].total += income.amount;
      });

      return Object.entries(result).map(([year, data]) => ({
        year: year,
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

    // filter year
    const filteredYear = computed(() =>
      incomeByYear.value.find((y) => Number(y.year) === selectedYear.value),
    );

    // data for chart
    const series = computed(() =>
      filteredYear.value
        ? filteredYear.value.categories.map((c) => c.total)
        : [],
    );

    const chartOptions = computed(() => ({
      labels: filteredYear.value
        ? filteredYear.value.categories.map(
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
                  filteredYear.value ? filteredYear.value.total : 0,
              },
            },
          },
        },
      },
      legend: { position: 'bottom' },
      dataLabels: { enabled: true },
      colors: ['#4caf50', '#ff9800', '#2196f3', '#ff5722', '#9c27b0'],
    }));

    return { selectedYear, categoryName, filteredYear, series, chartOptions };
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
