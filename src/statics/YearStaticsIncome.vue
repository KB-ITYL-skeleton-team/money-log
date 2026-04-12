<template>
  <div class="total">
    <div class="inputYear">
      <h1>
        <label>
          <input
            type="number"
            v-model.number="selectedYear"
            min="2000"
            max="2100"
          />
        </label>
        수입
      </h1>
    </div>
    <br />
    <!-- 차트 -->
    <div>
      <apexchart
        v-if="filteredYear"
        type="donut"
        :options="chartOptions"
        :series="series"
        width="400"
      />
    </div>
    <br />
    <div v-if="filteredYear">
      <div
        class="description"
        v-for="group in filteredYear.categories"
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
              v-for="item in group.incomes.filter((i) => i && i.id)"
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
import { computed, ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useTransactionsStore } from '@/stores/staticsStores';

export default {
  name: 'yearStaticsIncome',
  components: { apexchart: VueApexCharts },

  setup() {
    const transactions = useTransactionsStore();
    const { income, categories } = storeToRefs(transactions);
    // 새로고침
    onMounted(() => transactions.init());

    // 연 선택
    const selectedYear = ref(new Date().getFullYear());

    // 연별 카테고리별 수입 목록 생성
    const incomeByYear = computed(() => {
      const result = {};

      income.value.forEach((income) => {
        if (!income || !income.id) return;

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

      // 데이터 객체형태 변환
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

    // 카테고리 아이디와 이름 연결
    const categoryName = computed(() => {
      const name = {};
      categories.value.forEach((category) => {
        name[category.id] = category.name;
      });
      return name;
    });

    // // 지출 내역 월별 분류
    const filteredYear = computed(() =>
      incomeByYear.value.find((y) => Number(y.year) === selectedYear.value),
    );

    // 차트 데이터
    const series = computed(() =>
      filteredYear.value
        ? filteredYear.value.categories.map((c) => c.total)
        : [],
    );

    const chartOptions = computed(() => ({
      labels: filteredYear.value
        ? filteredYear.value.categories.map(
            (c) => categoryName.value[c.categoryId] || '기타',
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
              name: { color: 'rgba(250, 204, 21, 0.7)' },
              value: { color: 'rgba(250, 204, 21, 0.7)' },
              total: {
                show: true,
                label: '총수입',
                color: 'rgba(250, 204, 21, 0.7)',
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
  width: 130px;
  margin-bottom: 20px;
  display: block;
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
.inputYear {
  width: clamp(250px, 25vw, 250px);
  color: rgba(250, 204, 21, 0.7);
}
.description {
  font-size: clamp(10px, 20px);
}
.part {
  color: rgba(250, 204, 21, 0.7);
  font-size: clamp(1px, 1px);
}
</style>
