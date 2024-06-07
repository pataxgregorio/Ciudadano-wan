<template>
  <div>
    <q-card :class="$q.dark.isActive ? 'bg-dark' : ''">
      <q-card-section class="text-h6">
        Bar Chart
        <q-btn
          icon="fa fa-download"
          class="float-right"
          @click="saveImage"
          flat
          dense
        >
          <q-tooltip>Download PNG</q-tooltip>
        </q-btn>
      </q-card-section>
      <q-card-section>
        <ECharts
          ref="barChart"
          :option="options"
          class="q-mt-md"
          :resizable="true"
          autoresize
          style="height: 250px"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import ECharts from "vue-echarts";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import { useQuasar } from "quasar";

use([
  CanvasRenderer,
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
]);

export default {
  name: "BarChart",
  components: { ECharts },
  data() {
    const $q = useQuasar();
    return {
      $q,
      options: {
        legend: {
          bottom: 10,
        },
        tooltip: {},
        dataset: {
          source: [
            ["Product", "2015", "2016", "2017"],
            ["Matcha Latte", 43.3, 85.8, 93.7],
            ["Milk Tea", 83.1, 73.4, 55.1],
            ["Cheese Cocoa", 86.4, 65.2, 82.5],
            ["Walnut Brownie", 72.4, 53.9, 39.1],
          ],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "20%",
          top: "5%",
          containLabel: true,
        },
        xAxis: { type: "category" },
        yAxis: {},
        series: [{ type: "bar" }, { type: "bar" }, { type: "bar" }],
      },
    };
  },
  watch: {
    "$q.dark.isActive": function () {
      this.$refs.barChart.setOption(this.options); // Update chart when theme changes
    },
  },
  methods: {
    saveImage() {
      const linkSource = this.$refs.barChart.getDataURL();
      const downloadLink = document.createElement("a");
      document.body.appendChild(downloadLink);

      downloadLink.href = linkSource;
      downloadLink.target = "_self";
      downloadLink.download = "bar-chart.png";
      downloadLink.click();
    },
  },
};
</script>

<style scoped></style>
