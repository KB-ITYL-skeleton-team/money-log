<template>
  <div>
    <h1>Expense (Monthly)</h1>

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
          <li v-for="item in group.expenses" :key="item.id">
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
import { useTransactionsStore } from '@/stores/staticsStores';

export default {
  name: 'monthStaticsExpense',
  components: { apexchart: VueApexCharts },
  setup() {
    const transactions = useTransactionsStore();
    const { expense, categories } = storeToRefs(transactions);

    // seleted month initialization
    const selectedMonth = ref(new Date().toISOString().slice(0, 7));

    // grouping expense by month/category
    const expenseByMonth = computed(() => {
      const result = {};

      expense.value.forEach((expense) => {
        const month = expense.date.slice(0, 7);

        if (!result[month]) {
          result[month] = { categories: {}, total: 0 };
        }

        if (!result[month].categories[expense.categoryId]) {
          result[month].categories[expense.categoryId] = {
            expenses: [],
            total: 0,
          };
        }

        result[month].categories[expense.categoryId].expenses.push(expense);
        result[month].categories[expense.categoryId].total += expense.amount;
        result[month].total += expense.amount;
      });

      return Object.entries(result).map(([month, data]) => ({
        month: month,
        total: data.total,
        categories: Object.entries(data.categories).map(
          ([categoryId, category]) => ({
            categoryId: categoryId,
            expenses: category.expenses,
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
      expenseByMonth.value.find((m) => m.month === selectedMonth.value),
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
                label: 'Total Expense',
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
