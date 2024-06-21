<template>
  <q-card :class="$q.dark.isActive ? 'bg-dark text-white' : ''">
    <q-card-section class="text-h6">
      Analisis de Solicitudes Finalizadas
      <q-btn icon="fa-solid fa-download" class="float-right" flat dense @click="saveImage">
        <q-tooltip>Descargar Grafica PNG</q-tooltip>
      </q-btn>
    </q-card-section>

    <q-card-section class="q-pa-none">
      <v-chart class="chart" :option="chartOption" autoresize style="height: 350px; width: 100%;" />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { ref, watch, provide, computed } from 'vue';
import VChart, { THEME_KEY } from 'vue-echarts';
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import {
  DatasetComponent,
  GridComponent,
  VisualMapComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([
  DatasetComponent,
  GridComponent,
  VisualMapComponent,
  BarChart,
  CanvasRenderer
])

const $q = useQuasar();
provide(THEME_KEY, 'light');

const props = defineProps({
  chartData3: {
    type: Object,
    required: false,
    default: () => ({ nombres: [], totales: [] }),
  },
});

const chartDataFormatted = computed(() => {
  // Check if chartData3 exists and has data before mapping
  if (props.chartData3 && props.chartData3.nombres.length > 0) {
    return props.chartData3.nombres.map((nombre, index) => [props.chartData3.totales[index], nombre]);
  } else {
    // Return an empty array or a default dataset if chartData3 is null or empty
    return []; // Or a default dataset like [['Placeholder', 0]]
  }
});

const chartOption = ref({
  dataset: {
    source: [
      ['Total', 'Nombre'], // headers for clarity
      ...chartDataFormatted.value // spread the formatted data
    ]
  },
  grid: { containLabel: true },
  xAxis: { name: 'Total' },
  yAxis: { type: 'category' },
  series: [
    {
      type: 'bar',
      encode: {
        // Map the "amount" column to X axis.
        x: 'amount',
        // Map the "product" column to Y axis
        y: 'product'
      },
      itemStyle: {
        color: (params) => ['#FF5733', '#3498DB', '#2ECC71', '#F1C40F', '#9B59B6'][params.dataIndex % 5]
      }
    }
  ]
});
function saveImage() {
  const linkSource = this.$refs.barchart.getDataURL();
  const downloadLink = document.createElement('a');
  document.body.appendChild(downloadLink);
  downloadLink.href = linkSource;
  downloadLink.target = '_self';
  downloadLink.download = 'BarChart.png';
  downloadLink.click();
}

watch(
  () => props.chartData3,
  async (newValue, oldValue) => {
    // Ensure newValue exists and has data
    if (newValue && newValue.nombres.length > 0) {
      // Update chartDataFormatted (which is a computed property)
      chartDataFormatted.value = newValue.nombres.map(
        (nombre, index) => [newValue.totales[index], nombre]
      );

      // Update the chartOption's dataset source 
      chartOption.value.dataset.source = [
        ['Total', 'Nombre'],
        ...chartDataFormatted.value // Spread the updated data
      ];
    } else {
      // Handle cases where chartData3 is null or empty
      chartOption.value.dataset.source = [['Total', 'Nombre']]; // Clear the chart or show a message
    }
  }
);
</script>

<style lang="scss" scoped></style>