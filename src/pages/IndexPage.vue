<template>
  <q-page class="">
    <div class="row q-col-gutter-sm q-ml-xs q-mr-sm q-py-sm">
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <bar-chart :chartData = "chartData"></bar-chart>
      </div>
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <pie-chart :chartData2="chartData2"></pie-chart>
      </div>
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <simpleencode-chart :chartData3="chartData3"></simpleencode-chart>
      </div>
    </div>
  </q-page>
</template>

<script>
import BarChart from "components/BarChart.vue";
import PieChart from "components/PieChart.vue";
import SimpleencodeChart from "components/SimpleencodeChart.vue";
import axios from 'axios';
import { defineComponent, ref, onMounted } from "vue";

export default defineComponent({
  
  name: "IndexPage",
  components: { BarChart, PieChart, SimpleencodeChart },

  setup() {
  const chartData = ref(null);
  const chartData2 = ref(null);
  const chartData3 = ref(null);

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
  });

  return { chartData, chartData2, chartData3 };
}
});

</script>

<style lang="scss" scoped></style>
