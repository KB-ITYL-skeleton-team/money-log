<template>
  <div class="total">
    <h1>월별 수입</h1>
    <br />
    <!-- select month -->
    <input class="month" type="month" v-model="selectedMonth" />

    <br />
    <!-- chart -->
    <apexchart
      v-if="filteredMonth"
      type="donut"
      :options="chartOptions"
      :series="series"
      width="400"
    />
    <br />
    <div v-if="filteredMonth">
      <h2>
        {{ filteredMonth.month }} 월의 총수입은 ₩
        {{ Number(filteredMonth.total).toLocaleString() }} 이에요.
      </h2>

      <div v-for="group in filteredMonth.categories" :key="group.categoryId">
        <h3>
          Category: {{ categoryName[group.categoryId] }} | Sum: ₩
          {{ Number(group.total).toLocaleString() }} | Percentage:
          {{ group.percentage.toFixed(1) }}%
        </h3>

        <ul>
          <li v-for="item in group.incomes" :key="item.id">
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
                  filteredMonth.value
                    ? Number(filteredMonth.value.total).toLocaleString()
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

    return { selectedMonth, categoryName, filteredMonth, series, chartOptions };
  },
};
</script>

<style scoped>
.month {
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
