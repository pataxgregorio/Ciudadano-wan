<template>
  <q-page class="">
    <div class="filtrado">
      <input type="date" v-model="fechaDesde">
      <input type="date" v-model="fechaHasta">
      <button @click="filtrar" class="btn">Filtrar</button>
    </div>
    <div class="row q-col-gutter-sm q-ml-xs q-mr-sm q-py-sm">
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <GaugeChart :chartData4="chartData4" />
      </div>
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <BarChart :chartData="chartData" />
      </div> <!--
        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
          <PieChart :chartData2="chartData2" />
        </div>-->
      <!-- <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
          <SimpleencodeChart :chartData3="chartData3" />
        </div> -->
    </div>
    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <FinalizadasTable :rows="finalizadasRows" />
    </div>
  </q-page>
  <q-inner-loading :showing="isLoading">
    <img class="loader" src="/public/images/NuestroAlcaldeLoader.png" alt="Cargando..." width="100px">
  </q-inner-loading>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import url from 'axios';
import BarChart from 'components/BarChart.vue';
import PieChart from 'components/PieChart.vue';
import SimpleencodeChart from 'components/SimpleencodeChart.vue';
import GaugeChart from 'components/GaugeChart.vue';
import FinalizadasTable from 'components/FinalizadasTable.vue';

export default {

  name: "IndexPage",
  components: {
    BarChart,
    // PieChart,
    // SimpleencodeChart,
    GaugeChart,
    FinalizadasTable
  },
  setup() {
    const isLoading = ref(true);
    const chartData = ref(null);
    const chartData2 = ref(null);
    const chartData3 = ref(null);
    const chartData4 = ref(null);
    const finalizadasRows = ref([]);
    const fechaDesde = ref(null);
    const fechaHasta = ref(null);

    async function filtrar() {
      try {
        const response = await axios.get('http://192.168.0.120:7000/solicitud/totalFinalizadasConFecha', {
          params: {
            fecha_desde: fechaDesde.value,
            fecha_hasta: fechaHasta.value
          }
        });

        const responseBar = await axios.get('http://192.168.0.120:7000/solicitud/solicitudTipo2PorFecha', {
          params: {
            fecha_desde: fechaDesde.value,
            fecha_hasta: fechaHasta.value
          }
        });
        chartData.value = processChartData(responseBar.data);

        const responsePie = await axios.get('http://192.168.0.120:7000/solicitud/solicitudTipo4PorFecha', {
          params: {
            fecha_desde: fechaDesde.value,
            fecha_hasta: fechaHasta.value
          }
        });
        chartData2.value = processChartData(responsePie.data);

        finalizadasRows.value = Object.entries(response.data)
          .map(([name, value]) => ({ name, value }));
      } catch (error) {
        console.error("Error filtering data:", error);
        // Consider displaying an error notification to the user
      }
    }
    async function obtenerFinalizadas() {
      try {
        const response = await axios.get('http://192.168.0.120:7000/solicitud/totalFinalizadas3');
        const data = response.data;
        return finalizadasRows.value = Object.entries(data)
          .map(([name, value]) => ({ name, value }));
      } catch (error) {
        console.error("Error obteniendo datos:", error);

      }
    }
    async function fetchDataForChart1() {
      try {
        const response = await axios.get('http://192.168.0.120:7000/solicitud/solicitudTipo2');
        return processChartData(response.data);
      } catch (error) {
        console.error("Error fetching data for chart 1:", error);
        return null; // Handle error gracefully
      }
    }

    // async function fetchDataForChart2() {
    //   try {
    //     const response = await axios.get('http://192.168.0.120:7000/solicitud/solicitudTipo4');
    //     return processChartData(response.data);
    //   } catch (error) {
    //     console.error("Error fetching data for chart 2:", error);
    //     return null; // Handle error gracefully
    //   }
    // }

    async function fetchDataForChart3() {
      try {
        const response = await axios.get('http://192.168.0.120:7000/solicitud/solicitudTipo4');
        return processChartData(response.data);
      } catch (error) {
        console.error("Error fetching data for chart 3:", error);
        return null; // Handle error gracefully
      }
    }

    async function fetchDataForChart4() {
      try {
        const response = await axios.get('http://192.168.0.120:7000/solicitud/solicitudTipo5');
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
      // chartData2.value = await fetchDataForChart2();
      // chartData3.value = await fetchDataForChart3();
      chartData4.value = await fetchDataForChart4();
      finalizadasRows.value = await obtenerFinalizadas();
      setTimeout(() => {
        isLoading.value = false;
      }, 5000); // 2000 milisegundos = 2 segundos
    });
    return { isLoading, chartData, chartData4, finalizadasRows, filtrar, fechaDesde, fechaHasta };
  }
};
</script>

<style lang="scss" scoped>
.loader {
  animation: rotate 1s linear infinite;
  /* Aplica la animación "rotate" */
  animation-duration: 5s;
  /* Establece la duración máxima de la animación */
  margin-top: -800px;
}

@keyframes rotate {
  0% {
    transform: rotateZ(0deg);
    /* Comienza sin rotación */
  }

  100% {
    transform: rotateZ(360deg);
    /* Gira 360 grados en el eje Y (horizontal) */
  }
}

.filtrado {
  display: flex;
  align-items: center;
  justify-content: right;
  margin-top: 10px;
  gap: 10px;
}

.filtrado button {
  margin-right: 5px;
}

.btn {
  padding: 10px;
  background-color: black;
  color: white;
  border-radius: 10px;
}

.background-image {
  background-image: url("/images/siamobile.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

@media (min-width: 768px) {

  .background-image {
    background-image: url("/images/siadesktop.jpg");
    background-size: fill;
    background-position: top;
  }
}
</style>
