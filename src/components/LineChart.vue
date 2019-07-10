<script>
import { Line } from 'vue-chartjs'
export default {
  extends: Line,
  props: {
    chartData: {
      type: Array,
      required: false
    },
    chartLabels: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      gradient: null,
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              },
              gridLines: {
                display: true,
                color: '#EEF0F4',
                borderDash: [5, 15]
              }
            }
          ],
          xAxes: [
            {
              gridLines: {
                display: false,
                color: '#EEF0F4',
                borderDash: [5, 15]
              }
            }
          ]
        },
        tooltips: {
          // enabled: false,
          // custom: function(tooltipModel) {
          //   // Tooltip Element
          //   var tooltipEl = document.getElementById('chartjs-tooltip')

          //   // Create element on first render
          //   if (!tooltipEl) {
          //     tooltipEl = document.createElement('div')
          //     tooltipEl.id = 'chartjs-tooltip'
          //     tooltipEl.innerHTML = '<table></table>'
          //     document.body.appendChild(tooltipEl)
          //   }

          //   // Hide if no tooltip
          //   if (tooltipModel.opacity === 0) {
          //     tooltipEl.style.opacity = 0
          //     return
          //   }

          //   // Set caret Position
          //   tooltipEl.classList.remove('above', 'below', 'no-transform')
          //   if (tooltipModel.yAlign) {
          //     tooltipEl.classList.add(tooltipModel.yAlign)
          //   } else {
          //     tooltipEl.classList.add('no-transform')
          //   }

          //   function getBody(bodyItem) {
          //     return bodyItem.lines
          //   }

          //   // Set Text
          //   if (tooltipModel.body) {
          //     var titleLines = tooltipModel.title || []
          //     var bodyLines = tooltipModel.body.map(getBody)

          //     var innerHtml = '<thead>'

          //     titleLines.forEach(function(title) {
          //       innerHtml += '<tr><th>' + title + '</th></tr>'
          //     })
          //     innerHtml += '</thead><tbody>'

          //     bodyLines.forEach(function(body, i) {
          //       var colors = tooltipModel.labelColors[i]
          //       var style = 'background:' + colors.backgroundColor
          //       style += '; border-color:' + colors.borderColor
          //       style += '; border-width: 2px'
          //       var span = '<span style="' + style + '"><span class="iconfont icon-xiazai"></span></span>'
          //       innerHtml += '<tr><td>' + span + body + '</td></tr>'
          //     })
          //     innerHtml += '</tbody>'

          //     var tableRoot = tooltipEl.querySelector('table')
          //     tableRoot.innerHTML = innerHtml
          //   }

          //   // `this` will be the overall tooltip
          //   var position = this._chart.canvas.getBoundingClientRect()

          //   // Display, position, and set styles for font
          //   tooltipEl.style.opacity = 1
          //   tooltipEl.style.position = 'absolute'
          //   tooltipEl.style.left =
          //     position.left + window.pageXOffset + tooltipModel.caretX + 'px'
          //   tooltipEl.style.top =
          //     position.top + window.pageYOffset + tooltipModel.caretY + 'px'
          //   tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily
          //   tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px'
          //   tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle
          //   tooltipEl.style.padding =
          //     tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px'
          //   tooltipEl.style.pointerEvents = 'none'
          // }

          backgroundColor: '#4F5565',
          titleFontFamily: '"Maven Pro"',
          titleFontStyle: 'normal',
          titleFontSize: 16,
          cornerRadius: 3,
          // bodyFontColor: '#20C4C8',
          bodyFontFamily: '"Maven Pro"',
          bodyFontSize: 16,
          xPadding: 14,
          yPadding: 14,
          displayColors: false,
          mode: 'index',
          intersect: false,
          callbacks: {
            title: tooltipItem => {
              return `📆 ${tooltipItem[0].xLabel}`
            },
            label: (tooltipItem, data) => {
              let dataset = data.datasets[tooltipItem.datasetIndex]
              let currentValue = dataset.data[tooltipItem.index]
              return `⬇️ ${currentValue.toLocaleString()}`
            }
          }
        },
        legend: {
          display: false
        },
        responsive: true,
        maintainAspectRatio: false
      }
    }
  },
  mounted() {
    this.gradient = this.$refs.canvas
      .getContext('2d')
      .createLinearGradient(0, 0, 0, 450)
    this.gradient.addColorStop(0, 'rgba(52, 217, 221, 0.6)')
    this.gradient.addColorStop(0.5, 'rgba(52, 217, 221, 0.25)')
    this.gradient.addColorStop(1, 'rgba(52, 217, 221, 0)')

    this.renderChart(
      {
        labels: this.chartLabels,
        datasets: [
          {
            label: 'downloads',
            borderColor: '#249EBF',
            pointBackgroundColor: 'rgba(0,0,0,0)',
            pointBorderColor: 'rgba(0,0,0,0)',
            pointHoverBorderColor: '#249EBF',
            pointHoverBackgroundColor: '#fff',
            pointHoverRadius: 4,
            pointHitRadius: 10,
            pointHoverBorderWidth: 1,
            borderWidth: 1,
            backgroundColor: this.gradient,
            data: this.chartData
          }
        ]
      },
      this.options
    )
  }
}
</script>