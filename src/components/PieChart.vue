<template>
  <q-card :class="$q.dark.isActive ? 'bg-dark text-white' : ''">
    <q-card-section class="text-h6">
      Solicitudes en Proceso
      <q-btn icon="fa-solid fa-download" class="float-right" flat dense @click="saveImage">
        <q-tooltip>Descargar Grafica PNG</q-tooltip>
      </q-btn>
    </q-card-section>

    <q-card-section class="q-pa-none">
      <v-chart class="chart" :option="chartOption" autoresize style="height: 380px; width: 100%;" />
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
      }
    },
  ],
  series: [
    {
      name: 'Solicitudes',
      type: 'pie',
      radius: '84%',
      center: ['50%', '50%'],
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
    }
  },
  { deep: true, immediate: true }
);


function saveImage() {
  try {
    const chart = this.$refs.chart.chart;
    if (!chart) {
      throw new Error('Chart not initialized yet.');
    }
    const dataURL = chart.getDataURL({
      type: 'png',
      pixelRatio: 2, // Increase resolution for better quality
      backgroundColor: this.$q.dark.isActive ? '#1d1d1d' : '#ffffff', // Match card background
    });

    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'PieChart.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error saving chart image:', error);
    this.$q.notify({
      type: 'negative',
      message: 'Error al descargar la gráfica. Inténtalo nuevamente.'
    });
  }
}
</script>

<style lang="scss" scoped></style>
