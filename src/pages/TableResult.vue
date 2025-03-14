<template>
  <q-page class="">
    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <FinalizadasTable2
        :rows="finalizadasRows"
        :titulo="'Ultimas Entradas al Almacen'"
      />
    </div>
    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <FinalizadasTable3
        :rows="finalizadasRows2"
        :titulo="'Casos por Comuna de Medicinas e Insumos'"
      />
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
import url from "axios";
//import BarChart from 'components/BarChart.vue';
//import PieChart from 'components/PieChart.vue';
//import SimpleencodeChart from 'components/SimpleencodeChart.vue';
//import GaugeChart from 'components/GaugeChart.vue';
import FinalizadasTable3 from "components/FinalizadasTable3.vue";
import FinalizadasTable2 from "components/FinalizadasTable2.vue";

export default {
  name: "IndexPage",
  components: {
    FinalizadasTable3,
    FinalizadasTable2,
  },
  setup() {
    const isLoading = ref(true);
    const chartData = ref(null);
    const chartData2 = ref(null);
    const chartData3 = ref(null);
    const chartData4 = ref(null);
    const finalizadasRows = ref([]);
    const finalizadasRows2 = ref([]);

    const fechaDesde = ref(null);
    const fechaHasta = ref(null);

    async function filtrar() {
      try {
        const response = await axios.get(
          "http://192.168.0.113:7001/solicitud/totalFinalizadasConFecha",
          {
            params: {
              fecha_desde: fechaDesde.value,
              fecha_hasta: fechaHasta.value,
            },
          }
        );

        const responseBar = await axios.get(
          "http://192.168.0.113:7001/solicitud/solicitudTipo2PorFecha",
          {
            params: {
              fecha_desde: fechaDesde.value,
              fecha_hasta: fechaHasta.value,
            },
          }
        );

        // const responsePie = await axios.get('http://192.168.0.113:7001/solicitud/solicitudTipo4PorFecha', {
        //   params: {
        //     fecha_desde: fechaDesde.value,
        //     fecha_hasta: fechaHasta.value
        //   }
        // });

        const responseGauge = await axios.get(
          "http://192.168.0.113:7001/solicitud/solicitudTipo5PorFecha",
          {
            params: {
              fecha_desde: fechaDesde.value,
              fecha_hasta: fechaHasta.value,
            },
          }
        );

        chartData.value = processChartData(responseBar.data);
        // chartData2.value = processChartData(responsePie.data);
        chartData4.value = responseGauge.data;
        finalizadasRows.value = Object.entries(response.data).map(
          ([name, value]) => ({ name, value })
        );
      } catch (error) {
        console.error("Error filtering data:", error);
        // Consider displaying an error notification to the user
      }
    }
    async function obtenerFinalizadas() {
      try {
        const response = await axios.get(
          "http://192.168.0.113:7001/solicitud/totalFinalizadas5"
        );
        const data = response.data;

        // Mapear los datos para que coincidan con el formato esperado
        return (finalizadasRows.value = data.map((item) => ({
          nombre: item.nombre,
          cantidad_entrada: item.cantidad_entrada,
          // Formatear la fecha
          fecha: new Date(item.fecha).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
          tipoentrada: item.tipoentrada,
        })));
      } catch (error) {
        console.error("Error obteniendo datos:", error);
      }
    }
    async function obtenerFinalizadas2() {
      try {
        const response = await axios.get(
          "http://192.168.0.113:7001/solicitud/totalFinalizadas4"
        );
        const data = response.data;
        finalizadasRows2.value = processFinalizadasData(data); // Aquí se procesan los datos
      } catch (error) {
        console.error("Error obteniendo datos:", error);
      }
    }
    function processFinalizadasData(data) {
      return data.map((item) => ({
        comuna: item.comuna,
        medicina: item.MEDICINA,
        insumos: item.INSUMOS,
        total: item.MEDICINA + item.INSUMOS,
      }));
    }
    async function fetchDataForChart1() {
      try {
        const response = await axios.get(
          "http://192.168.0.113:7001/solicitud/solicitudTipo2"
        );
        return processChartData(response.data);
      } catch (error) {
        console.error("Error fetching data for chart 1:", error);
        return null; // Handle error gracefully
      }
    }

    // async function fetchDataForChart2() {
    //   try {
    //     const response = await axios.get('http://192.168.0.113:7001/solicitud/solicitudTipo4');
    //     return processChartData(response.data);
    //   } catch (error) {
    //     console.error("Error fetching data for chart 2:", error);
    //     return null; // Handle error gracefully
    //   }
    // }

    // async function fetchDataForChart3() {
    //   try {
    //     const response = await axios.get('http://192.168.0.113:7001/solicitud/solicitudTipo4');
    //     return processChartData(response.data);
    //   } catch (error) {
    //     console.error("Error fetching data for chart 3:", error);
    //     return null; // Handle error gracefully
    //   }
    // }

    async function fetchDataForChart4() {
      try {
        const response = await axios.get(
          "http://192.168.0.113:7001/solicitud/solicitudTipo5"
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching data for chart 4:", error);
        return null; // Handle error gracefully
      }
    }
    function processChartData(data) {
      const nombres = [];
      const totales = [];
      data.forEach((solicitud) => {
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
      finalizadasRows2.value = await obtenerFinalizadas2();

      setTimeout(() => {
        isLoading.value = false;
      }, 2000);
    });
    return {
      isLoading,
      chartData,
      chartData4,
      finalizadasRows,
      finalizadasRows2,
      filtrar,
      fechaDesde,
      fechaHasta,
    };
  },
};
</script>

<style lang="scss" scoped>
.loader {
  animation: rotate 1s linear infinite;
  /* Aplica la animación "rotate" */
  animation-duration: 2.4s;
  /* Establece la duración máxima de la animación */
  margin-top: -750px;
}

@keyframes rotate {
  0% {
    transform: translateY(-150px);
  }

  25% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-15px);
  }

  75% {
    transform: translateY(0px);
  }

  100% {
    transform: translateY(-15px);
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
