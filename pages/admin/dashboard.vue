<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <span>User Registeration</span>
            <v-spacer></v-spacer>
            <v-select
              :items="selectOptions"
              v-model="computedChartType"
              label="Chart Type"
            ></v-select>
          </v-card-title>
          <v-card-text>
            <apex-chart
              :series="topChart.series"
              :options="topChart.options"
              :type="chartType"
              :height="500"
              v-if="loaded"
            ></apex-chart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3">
        <v-card>
          <v-card-title>Discord Bot</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Status:</v-list-item-title>
                </v-list-item-content>
                <v-list-item-icon>
                  <v-icon>{{ statusIcon }}</v-icon>
                </v-list-item-icon>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Ready At:</v-list-item-title>
                  <v-list-item-subtitle>{{
                    discord.readyAt
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="3">
        <v-card>
          <v-card-title>Total Users</v-card-title>
          <v-card-text>
            <apex-chart
              :series="verifiedChart.series"
              :options="verifiedChart.options"
              :type="'pie'"
              v-if="loaded"
            ></apex-chart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import setTitle from '~/middleware/setPageTitle.js';
import formatPieChartData from '~/utilities/charts/formatPieChartData.js';
import formatBarChartData from '~/utilities/charts/formatBarChartData.js';

import ApexChart from 'vue-apexcharts';

const generateChartData = function (chart, type = 'bar', chartId, labels) {
  let categories = [];
  let series = [];
  let options = {
    chart: {
      id: chartId,
    },
    xaxis: {
      categories,
    },
  };

  if (type === 'bar') {
    categories = ['Users'];
    for (let i = 0; i <= chart.length; i++) {
      if (chart[i]) {
        const item = chart[i];
        const label = this.$dayjs(item.day);
        // categories[i] = label.format('MMM D');

        series.push({
          name: label.format('ddd, MMM Do, YYYY'),
          data: [parseInt(item.users, 10)],
        });
      }
    }
  }

  if (type === 'line') {
    const data = [];
    for (let i = 0; i <= chart.length; i++) {
      if (chart[i]) {
        const item = chart[i];
        const label = this.$dayjs(item.day);
        categories.push(label.format('MMM D'));
        data.push(parseInt(item.users, 10));
      }
    }
    series = [{ data }];
  }

  if (type === 'donut' || type === 'pie') {
    options = Object.assign({}, { labels });

    for (let i = 0; i <= chart.length; i++) {
      if (chart[i]) {
        const item = chart[i].total;
        series.push(item);
      }
    }
  }

  return {
    options,
    series,
  };
};

export default {
  name: 'AdminDashboard',
  layout: 'admin',

  components: { ApexChart },

  middleware: [
    'auth',
    ({ $auth, $permissions, redirect }) => {
      if ($auth.loggedIn) {
        if (!$auth.hasScope($permissions.VIEW_ALL_ADMIN)) {
          redirect('/');
        }
      } else {
        redirect('/');
      }
    },
    setTitle('Dashboard'),
  ],

  head() {
    return { title: 'Blackout - Admin CP - Dashboard' };
  },

  async asyncData(ctx) {
    console.log(ctx);
    try {
      const { chart, verified, discord } = (
        await ctx.$axios.get('/admin/dashboard')
      ).data;

      return {
        topChart: {
          chartData: chart,
          ...generateChartData.call(ctx, chart, 'bar', 'user-bar-chart'),
        },
        verifiedChart: {
          ...generateChartData.call(
            ctx,
            verified,
            'pie',
            'verified-users-chart',
            ['Unverified', 'Verified']
          ),
        },

        discord,
        loaded: true,
      };
    } catch (err) {
      console.error(err);
    }
  },

  data() {
    return {
      chartType: 'bar',
      selectOptions: ['Line', 'Bar'],
      loaded: false,
      discord: {
        status: false,
        readyAt: '00:00',
      },
    };
  },

  computed: {
    statusIcon() {
      return this.discord.status ? 'mdi-check-circle' : 'mdi-alert-circle';
    },

    computedChartType: {
      get() {
        return this.chartType.charAt(0).toUpperCase() + this.chartType.slice(1);
      },
      set(value) {
        const type = value.toLowerCase();

        const { options, series } = generateChartData.call(
          this,
          this.topChart.chartData,
          type,
          'user-line-chart'
        );

        this.topChart.options.xaxis.categories = options.xaxis.categories;
        this.topChart.series = series;
        this.chartType = type;
      },
    },
  },
};
</script>
