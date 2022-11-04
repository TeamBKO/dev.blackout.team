<template>
  <v-dialog v-model="open" fullscreen>
    <template #activator="{ on }">
      <slot name="activator" v-bind="{ on }" />
    </template>
    <v-card>
      <v-toolbar>
        <v-toolbar-title>
          <span>Roster Analytics</span>
        </v-toolbar-title>
        <template #extension>
          <v-row>
            <v-col cols="6">
              <v-btn :color="buttonColor" @click="mode = 'list'"
                ><v-icon>mdi-view-list</v-icon></v-btn
              >
              <v-btn :color="buttonColor" @click="mode = 'grid'"
                ><v-icon>mdi-view-grid</v-icon></v-btn
              >
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="showCharts"
                label="Display Charts"
                multiple
                dense
                filled
                solo
                :items="chartList"
                :item-value="'chartID'"
                :item-text="'name'"
              >
                <template #selection="{ item, index }">
                  <span v-if="index === 0">
                    <span>Display charts (+{{ showCharts.length }})</span>
                  </span>
                </template>
              </v-select>
            </v-col>
          </v-row>
        </template>
        <v-spacer></v-spacer>
        <v-btn icon @click="open = false"><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>
      <v-card-text>
        <v-container fluid>
          <v-row>
            <v-col
              v-for="(chart, idx) in charts"
              v-show="showCharts.includes(chart.options.chart.id)"
              :cols="idx === 0 ? 12 : viewMode"
              :key="idx"
            >
              <v-card flat>
                <v-card-title>{{ chart.chartTitle }}</v-card-title>
                <v-card-text>
                  <apex-chart
                    :series="chart.series"
                    :options="chart.options"
                    :type="chart.options.chart.type"
                    :height="500"
                    v-if="loaded"
                  ></apex-chart>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import formatPieChartData from '~/utilities/charts/formatPieChartData.js';
import formatBarChartData from '~/utilities/charts/formatBarChartData.js';
import snakeCase from 'lodash/snakeCase';
import ApexChart from 'vue-apexcharts';

export default {
  name: 'RosterAnalyticCharts',

  components: {
    ApexChart,
  },

  props: {
    rosterID: {
      type: String,
      default: '',
    },
  },

  watch: {
    async open(v) {
      if (v) await this.getCharts();
    },
  },

  data() {
    return {
      charts: [],
      open: false,
      loaded: false,
      showCharts: [],
      chartList: [],
      buttonColor: '#1e1e1e',
      mode: 'list',
    };
  },

  methods: {
    async getCharts() {
      try {
        const charts = await this.$axios.$get(
          `/rosters/analytics/${this.rosterID}`
        );

        const staticCharts = charts.slice(0, 2);
        const dynamicCharts = charts.slice(2);

        this.charts = [
          formatBarChartData.call(
            this,
            staticCharts[0],
            'Members per day - Monthly',
            'bar-monthly',
            'members'
          ),
          formatPieChartData.call(
            this,
            staticCharts[1],
            'Members',
            'members-pie',
            'members',
            'status'
          ),
          ...dynamicCharts.map((chart, idx) => {
            return formatPieChartData.call(
              this,
              chart,
              null,
              `pie-chart-${idx}`,
              'members'
            );
          }),
        ];

        this.showCharts = this.charts.map((c) => c.options.chart.id);

        this.chartList = this.charts.map((c) => ({
          name: c.chartTitle,
          chartID: c.options.chart.id,
        }));

        this.loaded = true;
      } catch (err) {
        console.log(err);
      }
    },
  },

  computed: {
    viewMode() {
      return this.mode === 'list' || this.$vuetify.breakpoint.mobile ? 12 : 6;
    },
  },
};
</script>
