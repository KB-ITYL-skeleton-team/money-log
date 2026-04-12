<template>
  <div class="total">
    <h1>연별 지출</h1>
    <br />
    <!-- select year -->
    <label>
      <input
        type="number"
        v-model.number="selectedYear"
        min="2000"
        max="2100"
      />
    </label>
    <br />
    <!-- chart -->
    <apexchart
      v-if="filteredYear"
      type="donut"
      :options="chartOptions"
      :series="series"
      width="400"
    />
    <br />
    <div v-if="filteredYear">
      <h2>
        {{ filteredYear.year }} 년의 총지출은 ₩
        {{ Number(filteredYear.total).toLocaleString() }} 이에요.
      </h2>

      <div v-for="group in filteredYear.categories" :key="group.categoryId">
        <h3>
          Category: {{ categoryName[group.categoryId] }} | Sum: ₩
          {{ Number(group.total).toLocaleString() }} | Percentage:
          {{ group.percentage.toFixed(1) }}%
        </h3>

        <ul>
          <li v-for="item in group.expenses" :key="item.id">
            ({{ item.date }}) : ₩ {{ Number(item.amount).toLocaleString() }} ({{
              item.memo
            }})
          </li>
        </ul>
      </div>
    </div>

    <div v-else>
      <div class="star"></div>
      <div class="ment">해당 내역이 없어요.</div>
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts';
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useTransactionsStore } from '@/stores/staticsStores';

export default {
  name: 'yearStaticsExpense',
  components: { apexchart: VueApexCharts },

  setup() {
    const transactions = useTransactionsStore();
    const { expense, categories } = storeToRefs(transactions);

    // selected year initialization
    const selectedYear = ref(new Date().getFullYear());

    // grouping income by year/category
    const expenseYear = computed(() => {
      const group = {};

      expense.value.forEach((expense) => {
        const year = expense.date.slice(0, 4);

        if (!group[year]) {
          group[year] = { categories: {}, total: 0 };
        }

        if (!group[year].categories[expense.categoryId]) {
          group[year].categories[expense.categoryId] = {
            expenses: [],
            total: 0,
          };
        }

        group[year].categories[expense.categoryId].expenses.push(expense);
        group[year].categories[expense.categoryId].total += expense.amount;
        group[year].total += expense.amount;
      });

      return Object.entries(group).map(([year, data]) => ({
        year: year,
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

    // filter year
    const filteredYear = computed(() =>
      expenseYear.value.find((y) => Number(y.year) === selectedYear.value),
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
      stroke: {
        colors: ['#020617'],
        width: 2,
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: { color: 'rgba(250, 204, 21, 0.45)' },
              value: { color: 'rgba(250, 204, 21, 0.45)' },
              total: {
                show: true,
                label: '총지출',
                color: 'rgba(250, 204, 21, 0.45)',
                formatter: () =>
                  filteredYear.value
                    ? Number(filteredYear.value.total).toLocaleString()
                    : 0,
              },
            },
          },
        },
      },
      legend: {
        position: 'bottom',
        labels: { colors: 'rgba(250, 204, 21, 0.45)' },
      },
      dataLabels: {
        enabled: true,
        style: { colors: ['rgba(250, 204, 21, 0.9)'] },
      },
      colors: [
        'rgba(245, 200, 20, 0.6)',
        'rgba(255, 170, 40, 0.5)',
        'rgba(255, 230, 90, 0.4)',
        'rgba(200, 150, 30, 0.5)',
        'rgba(220, 200, 120, 0.45)',
      ],
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

  background: #020617;
  border: 1px solid rgba(250, 204, 21, 0.45);
  color: rgba(250, 204, 21, 0.45);
  border-radius: 10px;
  cursor: pointer;
}

.total {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: rgba(250, 204, 21, 0.45);
}

.star {
  width: clamp(150px, 4vw, 150px);
  height: clamp(150px, 4vw, 150px);
  margin-top: 50px;
  margin-bottom: 50px;
  filter: drop-shadow(0 0 6px rgba(244, 218, 114, 0.929));
  background: rgba(250, 204, 21, 0.803);
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(250, 204, 21, 0.803);
  clip-path: polygon(
    50% 0%,
    61% 35%,
    98% 35%,
    68% 57%,
    79% 91%,
    50% 70%,
    21% 91%,
    32% 57%,
    2% 35%,
    39% 35%
  );
}
.ment {
  margin-left: 20px;
}
</style>
