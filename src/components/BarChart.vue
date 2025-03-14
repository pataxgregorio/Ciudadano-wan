<template>
  <q-card :class="$q.dark.isActive ? 'bg-dark' : ''">
    <q-card-section class="text-h6">
      Medidores por tipo de Gestiones y Solicitudes de Atención al Ciudadano
      <!-- <q-btn icon="fa fa-download" class="float-right" @click="saveImage" flat dense>
        <q-tooltip>Descargar Grafica PNG</q-tooltip>
      </q-btn> -->
    </q-card-section>
    <q-card-section>
      <ECharts
        ref="barchart"
        :option="options"
        autoresize
        style="height: 380px; width: 100%"
      />
    </q-card-section>
  </q-card>
</template>

<script>
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from "echarts/components";
import ECharts from "vue-echarts";
import { useQuasar } from "quasar";

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  BarChart,
  CanvasRenderer,
  LegendComponent,
]);

export default {
  name: "BarChart",
  components: { ECharts },
  props: {
    chartData: {
      type: Object,
      required: true,
      default: () => ({ nombres: [], totales: [] }),
    },
  },
  data() {
    return {
      $q: useQuasar(),
      options: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          formatter: (params) => `${params[0].axisValue}: ${params[0].value}`,
        },
        xAxis: {
          type: "category",
          data: [],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            itemStyle: {
              color: (params) =>
                ["#FF5733", "#3498DB", "#2ECC71", "#F1C40F", "#9B59B6"][
                  params.dataIndex % 5
                ],
            },
            data: [],
            type: "bar",
          },
        ],
      },
    };
  },
  watch: {
    chartData: {
      handler(newChartData) {
        this.options.xAxis.data = newChartData.nombres;
        this.options.series[0].data = newChartData.totales;
      },
      deep: true,
    },
  },
  methods: {
    saveImage() {
      const linkSource = this.$refs.barchart.getDataURL();
      const downloadLink = document.createElement("a");
      document.body.appendChild(downloadLink);
      downloadLink.href = linkSource;
      downloadLink.target = "_self";
      downloadLink.download = "BarChart.png";
      downloadLink.click();
    },
  },
};
</script>

<style scoped></style>
