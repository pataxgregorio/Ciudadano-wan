<template>
  <q-card :class="$q.dark.isActive ? 'bg-dark text-white' : ''">
    <q-card-section class="text-h6">
      Total de solicitudes en Proceso
      <q-btn icon="fa-solid fa-download" class="float-right" flat dense @click="saveImage">
        <q-tooltip>Descargar Grafica PNG</q-tooltip>
      </q-btn>
    </q-card-section>

    <q-card-section class="q-pa-none">
      <v-chart
        class="chart"
        :option="chartOption"
        autoresize
        style="height: 250px;"
      />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, watch, provide } from 'vue';
import { useQuasar } from 'quasar';
import VChart, { THEME_KEY } from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);

const $q = useQuasar();
provide(THEME_KEY, 'light');

const props = defineProps({
  chartData2: {
    type: Object,
    required: false, 
    default: () => ({ nombres: [], totales: [] }),
  },
});

const chartOption = ref({
  title: {
    text: 'Total de Solicitudes',
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    data: [],
    show: $q.screen.gt.xs,
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
      name: 'Solicitudes',
      type: 'pie',
      radius: '80%',
      center: ['50%', '60%'],
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
});

watch(
  () => props.chartData2,
  (newChartData) => {
    if (newChartData && newChartData.nombres && newChartData.nombres.length > 0) { 
      chartOption.value.series[0].data = newChartData.nombres.map((nombre, index) => ({
        value: newChartData.totales[index],
        name: nombre,
      }));
      chartOption.value.legend.data = newChartData.nombres;
    } else {
      chartOption.value.series[0].data = [];
      chartOption.value.legend.data = [];
      console.log("Empty or undefined chart data received."); 
    }
  },
  { deep: true, immediate: true } 
);


function saveImage() {
  $q.notify({ message: 'Functionality to download not implemented yet' });
}
</script>

<style lang="scss" scoped>
.chart {
  height: 250px; /* Adjust as needed */
}
</style>
