/**
 * Returns formatted chart data
 * @param {Array} chart The array containing the chart data
 * @param {String} chartTitle The title of the chart
 * @param {String} chartId The div#id of the chart
 * @param {String} dataKey The key/value pair for the data stored in the chart record
 * @param {String} labelKey The key/value pair for the label in the chart record
 * @param {Object} opts Additional options
 */
const formatPieChartData = function (
  chart,
  title,
  chartId,
  dataKey,
  labelKey,
  opts
) {
  let chartTitle = title || '';
  let series = [];
  let labels = [];
  let options = {
    chart: {
      id: chartId,
      type: 'pie',
    },
    labels,
    theme: {
      mode: 'dark',
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
      if (i === 0 && !title) {
        chartTitle = Object.keys(chart[i])[0];
      }
      labels.push(chart[i][labelKey || chartTitle]);
      series.push(parseInt(chart[i][dataKey], 10));
    }
  }

  return { chartTitle, options, series };
};

export default formatPieChartData;
