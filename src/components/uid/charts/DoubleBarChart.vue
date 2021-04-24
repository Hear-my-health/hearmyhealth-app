<script>
import { Bar } from "vue-chartjs";

export default {
  extends: Bar,
  props: {
    label: {
      type: Object,
    },
    chartData: {
      type: Object,
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
      const datesOne = this.chartData.tt.map((d) => d.date);
      const totalsOne = this.chartData.tt.map((d) => d.data || 0);

      const datesTwo = this.chartData.tt2.map((d) => d.date);
      const totalsTwo = this.chartData.tt2.map((d) => d.data || 0);

      const { sleepLabel, deepSleepLabel } = this.label;

      this.renderChart(
        {
          labels: datesOne,
          datasets: [
            {
              label: sleepLabel,
              data: totalsOne,
              borderColor: "#741bc2",
              pointBorderColor: "#741bc2",
              pointBackgroundColor: "#741bc2",
              backgroundColor: "#741bc2",
            },
            {
              label: deepSleepLabel,
              data: totalsTwo,
              borderColor: "#d9710f",
              pointBorderColor: "#d9710f",
              pointBackgroundColor: "#d9710f",
              backgroundColor: "#d9710f",
            },
          ],
        },
        this.options
      );
    },
  },
  mounted() {
    console.log(this.chartData);
    const datesOne = this.chartData.tt.map((d) => d.date);
    const totalsOne = this.chartData.tt.map((d) => d.data || 0);

    const datesTwo = this.chartData.tt2.map((d) => d.date);
    const totalsTwo = this.chartData.tt2.map((d) => d.data || 0);

    const { sleepLabel, deepSleepLabel } = this.label;

    this.renderChart(
      {
        labels: datesOne,
        datasets: [
          {
            label: sleepLabel,
            data: totalsOne,
            borderColor: "#741bc2",
            pointBorderColor: "#741bc2",
            pointBackgroundColor: "#741bc2",
            backgroundColor: "#741bc2",
          },
          {
            label: deepSleepLabel,
            data: totalsTwo,
            borderColor: "#d9710f",
            pointBorderColor: "#d9710f",
            pointBackgroundColor: "#d9710f",
            backgroundColor: "#d9710f",
          },
        ],
      },
      this.options
    );
  },
};
</script>
