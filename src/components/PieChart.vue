<template>
  <q-card :class="$q.dark.isActive ? 'bg-dark text-white' : ''">
    <q-card-section class="text-h6">
      <p style="text-align: center;">Análisis Diacrónico de Tipología de Procedimientos de Atención al
        Ciudadano Medicina e Insumos</p>
    </q-card-section>
    <q-card-section class="q-pa-none">
      <v-chart class="chart" :option="chartOption" autoresize style="height: 350px; width: 100%" ref="vChart" />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, watch, provide, onMounted } from "vue"; // Import onMounted
import { useQuasar } from "quasar";
import VChart, { THEME_KEY } from "vue-echarts";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);

const $q = useQuasar();
provide(THEME_KEY, "light");

const props = defineProps({
  chartData2: {
    type: Object,
    required: false,
    default: () => ({ nombres: [], totales: [] }),
  },
});

const chartOption = ref({
  title: {
    left: "center",
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} ({d}%)", // Keep the original formatter
  },
  legend: {
    orient: "vertical",
    left: "left",
    data: [],
    show: $q.screen.gt.xs,
    formatter: (name) => {  // Add the formatter here.
      let total = 0;
      let value = 0;
      for (let i = 0, l = chartOption.value.series[0].data.length; i < l; i++) {
        total += chartOption.value.series[0].data[i].value;
        if (chartOption.value.series[0].data[i].name === name) {
          value = chartOption.value.series[0].data[i].value;
        }
      }
      return `${name} - ${value}`;
    }
  },
  media: [
    {
      query: {
        maxWidth: 599,
      },
      option: {
        legend: {
          show: false,
        },
      },
    },
  ],
  series: [
    {
      name: "Solicitudes",
      type: "pie",
      radius: "80%",
      center: ["50%", "50%"],
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
      label: {
        show: true, // Ensure labels are displayed
        formatter: '{b}: {d}%' // Format the label to show percentage.  You can customize this.
      },
    },
  ],
});



watch(
  () => props.chartData2,
  (newChartData) => {
    if (
      newChartData &&
      newChartData.nombres &&
      newChartData.nombres.length > 0
    ) {
      chartOption.value.series[0].data = newChartData.nombres.map(
        (nombre, index) => ({
          value: newChartData.totales[index],
          name: nombre,
        })
      );
      chartOption.value.legend.data = newChartData.nombres;
    } else {
      chartOption.value.series[0].data = [];
      chartOption.value.legend.data = [];
    }
  },
  { deep: true, immediate: true }
);

const vChartRef = ref(null); // Add a ref for the VChart component

onMounted(() => {
  // Access the ECharts instance after the component is mounted
  if (vChartRef.value) {
    // No need to manually call setOption; the chart updates reactively
  }
});

function saveImage() {
  try {
    const chart = vChartRef.value.chart; //Correctly access the chart instance
    if (!chart) {
      throw new Error("Chart not initialized yet.");
    }
    const dataURL = chart.getDataURL({
      type: "png",
      pixelRatio: 2,
      backgroundColor: $q.dark.isActive ? "#1d1d1d" : "#ffffff",
    });

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "PieChart.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error saving chart image:", error);
    $q.notify({
      type: "negative",
      message: "Error al descargar la gráfica. Inténtalo nuevamente.",
    });
  }
}
</script>

<style lang="scss" scoped></style>
