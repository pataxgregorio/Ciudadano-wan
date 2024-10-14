<template>
  <q-page class="">
    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <PieChart3 :chartData="chartData" /> 
    </div>
  </q-page>
  <q-inner-loading :showing="isLoading">
    <img class="loader" src="/images/loader.png" alt="Cargando..." width="200px">
  </q-inner-loading>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import PieChart3 from 'components/PieChart3.vue';

export default {
  name: "IndexPage",
  components: { PieChart3 },
  setup() {
    const isLoading = ref(true);
    const chartData = ref(null);

    async function fetchData() {
      try {
        const response = await axios.get('http://127.0.0.1:8002/solicitud/medicinacomunas');
        return processChartData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        return null; 
      }
    }

    function processChartData(data) {
  const comunas = [];
  const totales = [];
  data.forEach(item => {
    comunas.push(item.comuna);
    const medicina = parseInt(item.MEDICINA); // Convertir a número
    const insumos = parseInt(item.INSUMOS);  // Convertir a número
    totales.push(medicina + insumos);        // Sumar los números
  });
  return { comunas, totales }; 
}

    onMounted(async () => {
      chartData.value = await fetchData();
      console.log('desde la pagina',chartData.value);
      isLoading.value = false;
    });

    return { isLoading, chartData };
  }
};
</script>