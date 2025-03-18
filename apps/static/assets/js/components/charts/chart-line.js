'use strict';

//
// Sales chart
//

var SalesChart = (function() {

  // Variables

  var $chart = $('#chart-sales-dark');


  // Methods

  function init($chart) {

    var salesChart = new Chart($chart, {
      type: 'line',
      options: {
        scales: {
          yAxes: [{
            gridLines: {
              lineWidth: 1,
              color: Charts.colors.gray[900],
              zeroLineColor: Charts.colors.gray[900]
            },
            ticks: {
              callback: function(value) {
                if (!(value % 10)) {
                  return '$' + value + 'k';
                }
              }
            }
          }]
        },
        tooltips: {
          callbacks: {
            label: function(item, data) {
              var label = data.datasets[item.datasetIndex].label || '';
              var yLabel = item.yLabel;
              var content = '';

              if (data.datasets.length > 1) {
                content += '<span class="popover-body-label mr-auto">' + label + '</span>';
              }

              content += '<span class="popover-body-value">$' + yLabel + 'k</span>';
              return content;
            }
          }
        }
      },
      data: {
        labels: [],
        datasets: [{
          label: 'Performance',
          data: []
        }]
      }
    });

    // Save to jQuery object

    $chart.data('chart', salesChart);

    // Fetch CSV data
    fetch($chart.data('data-update').data.csvPath)
      .then(response => response.text())
      .then(data => {
        const parsedData = parseCSV(data);
        $chart.data('chart').data.labels = parsedData.labels;
        $chart.data('chart').data.datasets[0].data = parsedData.values;
        $chart.data('chart').update();
      });

    // Function to parse CSV data
    function parseCSV(data) {
      const lines = data.split('\n');
      const labels = [];
      const values = [];

      for (let i = 1; i < lines.length; i++) { // Skip header
        const [label, value] = lines[i].split(',');
        labels.push(label);
        values.push(parseFloat(value));
      }

      return { labels, values };
    }

  };


  // Events

  if ($chart.length) {
    init($chart);
  }

})();
