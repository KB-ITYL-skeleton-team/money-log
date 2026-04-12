<template>
  <div class="total">
    <div class="inputMonth">
      <h1><input class="month" type="month" v-model="selectedMonth" /> 지출</h1>
    </div>
    <br />
    <!-- 차트 -->
    <div>
      <apexchart
        v-if="filteredMonth.total"
        type="donut"
        :options="chartOptions"
        :series="series"
        width="400"
      />
    </div>
    <br />
    <div v-if="filteredMonth.total">
      <div
        class="description"
        v-for="group in filteredMonth.categories"
        :key="group.categoryId"
      >
        <div class="part">
          <h3>
            {{ categoryName[group.categoryId] || '기타' }}의 총합은 ₩
            {{ Number(group.total).toLocaleString() }} (
            {{ group.percentage.toFixed(1) }}%) 이에요.
          </h3>
        </div>
        <div>
          <ul>
            <li
              v-for="item in group.expenses.filter((i) => i && i.id)"
              :key="item.id"
            >
              <div>
                ({{ item.date }}) : ₩
                {{ Number(item.amount).toLocaleString() }} ({{ item.memo }})
              </div>
            </li>
          </ul>
        </div>
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
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useTransactionsStore } from '@/stores/staticsStores';

export default {
  name: 'monthStaticsExpense',
  components: { apexchart: VueApexCharts },
  setup() {
    const transactions = useTransactionsStore();
    const { expense, categories } = storeToRefs(transactions);
    // 새로고침
    onMounted(() => transactions.init());

    const selectedMonth = ref(new Date().toISOString().slice(0, 7));

    // 월별 카테고리별 지출 목록 생성
    const expenseByMonth = computed(() => {
      const result = {};

      expense.value.forEach((expense) => {
        if (!expense || !expense.id) return;

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
        month,
        total: data.total,
        categories: Object.entries(data.categories).map(
          ([categoryId, category]) => ({
            categoryId,
            expenses: category.expenses,
            total: category.total,
            percentage:
              data.total === 0 ? 0 : (category.total / data.total) * 100,
          }),
        ),
      }));
    });

    const categoryName = computed(() => {
      const name = {};
      categories.value.forEach((category) => {
        name[category.id] = category.name;
      });
      return name;
    });

    const filteredMonth = computed(() => {
      return (
        expenseByMonth.value.find((m) => m.month === selectedMonth.value) || {
          month: selectedMonth.value,
          total: 0,
          categories: [],
        }
      );
    });

    const series = computed(() =>
      filteredMonth.value.categories.map((c) => c.total),
    );

    const chartOptions = computed(() => ({
      labels: filteredMonth.value.categories.map(
        (c) => categoryName.value[c.categoryId] || '기타',
      ),
      stroke: {
        colors: ['#020617'],
        width: 2,
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: { color: 'rgba(250, 204, 21, 0.7)' },
              value: { color: 'rgba(250, 204, 21, 0.7)' },
              total: {
                show: true,
                label: '총지출',
                color: 'rgba(250, 204, 21, 0.7)',
                formatter: () =>
                  Number(filteredMonth.value.total).toLocaleString(),
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
input {
  width: 250px;
  color: rgba(250, 204, 21, 0.7);
}

.month {
  background: #020617;
  border: 1px solid rgba(250, 204, 21, 0.7);
  color: rgba(250, 204, 21, 0.7);
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
.inputMonth {
  color: rgba(250, 204, 21, 0.7);
  width: clamp(350px, 30vw, 600px);
}
.description {
  font-size: clamp(10px, 20px);
}
.part {
  color: rgba(250, 204, 21, 0.7);
  font-size: clamp(1px, 1px);
}
</style>
