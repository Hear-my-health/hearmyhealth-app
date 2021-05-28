<script>
import { Line } from "vue-chartjs";

export default {
  extends: Line,
  props: {
    label: {
      type: String,
    },
    chartData: {
      type: Array,
    },
    options: {
      type: Object,
    },
    chartColors: {
      type: Object,
    },
  },
  watch: {
    chartData() {
      const dates = this.chartData.map((d) => d.date);
      const totals = this.chartData.map((d) => d.data || 0);

      const {
        borderColor,
        pointBorderColor,
        pointBackgroundColor,
        backgroundColor,
      } = this.chartColors;

      this.renderChart(
        {
          labels: dates,
          datasets: [
            {
              label: this.label,
              data: totals,
              borderColor: borderColor,
              pointBorderColor: pointBorderColor,
              pointBackgroundColor: pointBackgroundColor,
              backgroundColor: backgroundColor,
              borderWidth: 1,
            },
          ],
        },
        this.options
      );
    },
  },
  mounted() {
    const dates = this.chartData.map((d) => d.date);
    const totals = this.chartData.map((d) => d.data || 0);

    const {
      borderColor,
      pointBorderColor,
      pointBackgroundColor,
      backgroundColor,
    } = this.chartColors;

    this.renderChart(
      {
        labels: dates,
        datasets: [
          {
            label: this.label,
            data: totals,
            borderColor: borderColor,
            pointBorderColor: pointBorderColor,
            pointBackgroundColor: pointBackgroundColor,
            backgroundColor: backgroundColor,
            borderWidth: 1,
          },
        ],
      },
      this.options
    );
  },
};
</script>
