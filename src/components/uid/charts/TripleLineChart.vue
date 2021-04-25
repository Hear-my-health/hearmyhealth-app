<script>
import { Line } from "vue-chartjs";

export default {
  extends: Line,
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

      const datesThree = this.chartData.tt3.map((d) => d.date);
      const totalsThree = this.chartData.tt3.map((d) => d.data || 0);

      const {
        avgHeartRateLabel,
        maxHeartRateLabel,
        minHeartRateLabel,
      } = this.label;

      this.renderChart(
        {
          labels: datesOne,
          datasets: [
            {
              label: avgHeartRateLabel,
              data: totalsOne,
              borderColor: "#E55381",
              pointBorderColor: "#E55381",
              pointBackgroundColor: "#E55381",
              backgroundColor: "transparent",
              borderWidth: 1,
            },
            {
              label: maxHeartRateLabel,
              data: totalsTwo,
              borderColor: "#d9710f",
              pointBorderColor: "#d9710f",
              pointBackgroundColor: "#d9710f",
              backgroundColor: "transparent",
              borderWidth: 1,
            },
            {
              label: minHeartRateLabel,
              data: totalsThree,
              borderColor: "#0345fc",
              pointBorderColor: "#0345fc",
              pointBackgroundColor: "#0345fc",
              backgroundColor: "transparent",
              borderWidth: 1,
            },
          ],
        },
        this.options
      );
    },
  },
  mounted() {
    const datesOne = this.chartData.tt.map((d) => d.date);
    const totalsOne = this.chartData.tt.map((d) => d.data || 0);

    const datesTwo = this.chartData.tt2.map((d) => d.date);
    const totalsTwo = this.chartData.tt2.map((d) => d.data || 0);

    const datesThree = this.chartData.tt3.map((d) => d.date);
    const totalsThree = this.chartData.tt3.map((d) => d.data || 0);

    const {
      avgHeartRateLabel,
      maxHeartRateLabel,
      minHeartRateLabel,
    } = this.label;

    this.renderChart(
      {
        labels: datesOne,
        datasets: [
          {
            label: avgHeartRateLabel,
            data: totalsOne,
            borderColor: "#741bc2",
            pointBorderColor: "#741bc2",
            pointBackgroundColor: "#741bc2",
            backgroundColor: "transparent",
            borderWidth: 1,
          },
          {
            label: maxHeartRateLabel,
            data: totalsTwo,
            borderColor: "#d9710f",
            pointBorderColor: "#d9710f",
            pointBackgroundColor: "#d9710f",
            backgroundColor: "transparent",
            borderWidth: 1,
          },
          {
            label: minHeartRateLabel,
            data: totalsThree,
            borderColor: "#0345fc",
            pointBorderColor: "#0345fc",
            pointBackgroundColor: "#0345fc",
            backgroundColor: "transparent",
            borderWidth: 1,
          },
        ],
      },
      this.options
    );
  },
};
</script>
