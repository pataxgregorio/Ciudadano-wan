<template>
  <q-card :class="$q.dark.isActive ? 'bg-dark text-white' : ''">
    <q-card-section class="text-h6">
      Salidas de Medicina e Insumos por Comuna
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
  chartData: { 
    type: Object,
    required: false,
    default: () => ({ comunas: [], totales: [] }), 
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
  () => props.chartData,
  (newChartData) => {
    console.log('newChartData', newChartData);
    if (newChartData && newChartData.comunas && newChartData.comunas.length > 0) { 
      chartOption.value.series[0].data = newChartData.comunas.map((comuna, index) => ({ 
        value: newChartData.totales[index], 
        name: comuna,
      }));
      chartOption.value.legend.data = newChartData.comunas; 
    } else {
      chartOption.value.series[0].data = [];
      chartOption.value.legend.data = [];
    }
  },
  { deep: true, immediate: true }
);
</script>