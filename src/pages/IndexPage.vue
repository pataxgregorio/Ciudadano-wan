<template>
  <q-page class="">
    <div class="row q-col-gutter-sm q-ml-xs q-mr-sm q-py-sm">
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <BarChart :chartData="chartData" />
      </div>
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <PieChart :chartData2="chartData2" />
      </div>
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <SimpleencodeChart :chartData3="chartData3" />
      </div>
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <GaugeChart :chartData4="chartData4" />
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import BarChart from 'components/BarChart.vue';
import PieChart from 'components/PieChart.vue';
import SimpleencodeChart from 'components/SimpleencodeChart.vue';
import GaugeChart from 'components/GaugeChart.vue';

export default {
  name: "IndexPage",
  components: {
    BarChart,
    PieChart,
    SimpleencodeChart,
    GaugeChart,
  },
  setup() {
    const chartData = ref(null);
    const chartData2 = ref(null);
    const chartData3 = ref(null);
    const chartData4 = ref(null);


    async function fetchDataForChart1() {
      try {
        const response = await axios.get('http://192.168.0.120:8000/solicitud/solicitudTipo2');
        return processChartData(response.data);
      } catch (error) {
        console.error("Error fetching data for chart 1:", error);
        return null; // Handle error gracefully
      }
    }

    async function fetchDataForChart2() {
      try {
        const response = await axios.get('http://192.168.0.120:8000/solicitud/solicitudTipo3');
        return processChartData(response.data);
      } catch (error) {
        console.error("Error fetching data for chart 2:", error);
        return null; // Handle error gracefully
      }
    }

    async function fetchDataForChart3() {
      try {
        const response = await axios.get('http://192.168.0.120:8000/solicitud/solicitudTipo4');
        return processChartData(response.data);
      } catch (error) {
        console.error("Error fetching data for chart 3:", error);
        return null; // Handle error gracefully
      }
    }

    async function fetchDataForChart4() {
      try {
        const response = await axios.get('http://192.168.0.120:8000/solicitud/solicitudTipo5');
        return response.data;
      } catch (error) {
        console.error("Error fetching data for chart 4:", error);
        return null; // Handle error gracefully
      }
    }

    function processChartData(data) {
      const nombres = [];
      const totales = [];
      data.forEach(solicitud => {
        nombres.push(solicitud.SOLICITUD_NOMBRE);
        totales.push(solicitud.TOTAL_SOLICITUD);
      });
      return { nombres, totales };
    }

    onMounted(async () => {
      chartData.value = await fetchDataForChart1();
      chartData2.value = await fetchDataForChart2();
      chartData3.value = await fetchDataForChart3();
      chartData4.value = await fetchDataForChart4();
    });
    return { chartData, chartData2, chartData3, chartData4 };
  }
};

</script>

<style lang="scss" scoped></style>
