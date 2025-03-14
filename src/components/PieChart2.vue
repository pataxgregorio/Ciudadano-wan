<template>
  <q-card :class="$q.dark.isActive ? 'bg-dark text-white' : ''">
    <q-card-section class="text-h6">
      Salidas de Medicina e Insumos
    </q-card-section>

    <q-card-section class="q-pa-none">
      <v-chart
        class="chart"
        :option="chartOption"
        autoresize
        style="height: 380px; width: 100%"
      />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, provide, watch } from "vue";
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
  chartData3: {
    type: Object,
    required: true,
  },
});

const chartOption = ref({
  title: {
    text: "",
    left: "center",
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b}: {c}%", // Mostrar solo el porcentaje
  },
  legend: {
    orient: "vertical",
    left: "left",
    data: [],
    show: $q.screen.gt.xs,
  },
  series: [
    {
      name: "Productos",
      type: "pie",
      radius: "85%",
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
});

watch(
  () => props.chartData3,
  (newChartData) => {
    console.log("data vista", newChartData);
    if (newChartData) {
      // Convertir los valores a números y crear el array de datos
      const data = Object.entries(newChartData).map(([name, value]) => ({
        value: parseFloat(value), // Convertir el valor a número
        name: name,
      }));
      chartOption.value.series[0].data = data;
      chartOption.value.legend.data = data.map((item) => item.name);
    }
  },
  { deep: true, immediate: true }
);
</script>

<style lang="scss" scoped></style>
