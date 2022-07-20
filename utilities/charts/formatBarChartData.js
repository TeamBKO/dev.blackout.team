/**
 * Returns formatted chart data
 * @param {Array} chart The array containing the chart data
 * @param {String} chartTitle The title of the chart
 * @param {String} chartId The div#id of the chart
 * @param {String} dataKey The key/value pair
 * @param {Object} opts Additional options
 */
const formatBarChartData = function (
  chart,
  chartTitle,
  chartId,
  dataKey,
  opts
) {
  let series = [];
  let categories = ['Members'];
  let options = {
    chart: {
      id: chartId,
      type: 'bar',
    },
    xaxis: {
      categories,
    },
    // responsive: {
    //   breakpoint: 480,
    //   options: {
    //     chart: {
    //       width: 200,
    //     },
    //     legend: {
    //       position: 'bottom',
    //     },
    //   },
    // },
  };

  options = Object.assign(options, opts);

  for (let i = 0; i <= chart.length; i++) {
    if (chart[i]) {
      const item = chart[i];
      const label = this.$dayjs(item.day);

      series.push({
        name: label.format('ddd, MMM Do, YYYY'),
        data: [parseInt(item[dataKey], 10)],
      });
    }
  }

  return { chartTitle, series, options };
};

export default formatBarChartData;
