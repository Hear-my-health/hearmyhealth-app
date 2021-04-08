<script>
import { Bar } from "vue-chartjs";

export default {
  extends: Bar,
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
    chartData(to, from) {
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
          },
        ],
      },
      this.options
    );
  },
};
</script>
