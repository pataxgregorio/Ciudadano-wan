<template>
  <q-page class="">
    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12" v-if="chartData2">
      <PieChart2 :chartData3="chartData2" />
    </div>
  </q-page>
  <q-inner-loading :showing="isLoading">
    <img
      class="loader"
      src="/images/loader.png"
      alt="Cargando..."
      width="200px"
    />
  </q-inner-loading>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import PieChart2 from "components/PieChart2.vue";

export default {
  name: "IndexPage",
  components: {
    PieChart2,
  },
  setup() {
    const isLoading = ref(true);
    const chartData2 = ref(null);

    async function fetchDataForChart2() {
      try {
        const response = await axios.get(
          "http://156.235.91.67:4000/seguimiento/getproductos"
        );
        const data = response.data;
        console.log("respuesta de la aipi", data);
        return data; // Retorna los datos directamente
      } catch (error) {
        console.error("Error fetching data for chart 2:", error);
        return null;
      }
    }

    onMounted(async () => {
      chartData2.value = await fetchDataForChart2();
      console.log("desde la pagina", chartData2.value);
      isLoading.value = false;
    });

    return { isLoading, chartData2 };
  },
};
</script>

<style scoped>
/* ... (tus estilos aquí) */
</style>
