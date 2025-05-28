<template>
  <q-page class="">
    <img src="/images/logoSIA.png" class="img-logo" />
    <!-- <div class="filtrado">
      <input type="date" v-model="fechaDesde" />
      <input type="date" v-model="fechaHasta" />
      <button class="btn" @click="filtrar">Filtrar</button>
    </div> -->
    <div class="row q-col-gutter-sm q-ml-xs q-mr-sm q-py-sm">
      <!-- <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <BarChart :chart-data="chartData" />
      </div> -->
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <PieChart :chartData2="chartData2" />
      </div>
    </div>
    <!-- <div class="row q-col-gutter-sm q-ml-xs q-mr-sm q-py-sm">
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12" v-if="chartData3">
        <PieChart2 :chartData3="chartData3" />
      </div>
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <PieChart3 :chartData5="chartData5" />
      </div>
    </div>
    <div class="row q-col-gutter-sm q-ml-xs q-mr-sm q-py-sm">
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <FinalizadasTable :rows="finalizadasRows" />
      </div>
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <FinalizadasTable2 :rows="finalizadasRows2" titulo="Últimas Entradas al Almacén" />
      </div>
    </div>
    <div class="row q-col-gutter-sm q-ml-xs q-mr-sm q-py-sm">
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12" v-if="mostrar2">
        <FinalizadasTable3 :rows="finalizadasRows3" titulo="Casos por Comuna de Medicinas e Insumos" />
      </div>
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12" v-if="mostrar">
        <FinalizadasTable4 :rows2="finalizadasRows4" titulo="Últimas Salidas de Medicinas" />
      </div>
    </div> -->
    <img
      src="/images/logo-rafael-torrealba.png"
      class="logo-rafael-torrealba"
    />
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

// Componentes
import BarChart from "components/BarChart.vue";
import PieChart from "components/PieChart.vue";
import PieChart2 from "components/PieChart2.vue";
import PieChart3 from "components/PieChart3.vue";
import FinalizadasTable from "components/FinalizadasTable.vue";
import FinalizadasTable2 from "components/FinalizadasTable2.vue";
import FinalizadasTable3 from "components/FinalizadasTable3.vue";
import FinalizadasTable4 from "components/FinalizadasTable4.vue";

export default {
  name: "IndexPage",
  components: {
    // BarChart,
    PieChart,
    // PieChart2,
    // PieChart3,
    // FinalizadasTable,
    // FinalizadasTable2,
    // FinalizadasTable3,
    // FinalizadasTable4,
  },
  setup() {
    const isLoading = ref(true);
    const chartData = ref(null);
    const chartData2 = ref(null);
    const chartData3 = ref(null);
    const chartData5 = ref(null);
    const finalizadasRows = ref([]);
    const finalizadasRows2 = ref([]);
    const finalizadasRows3 = ref([]);
    const finalizadasRows4 = ref([]);
    const fechaDesde = ref(null);
    const fechaHasta = ref(null);
    const mostrar = ref(false);
    const mostrar2 = ref(false);

    // Función para filtrar datos por fecha
    async function filtrar() {
      isLoading.value = true;
      try {
        const [
          response,
          responseBar,
          responsePie,
          responsePie2,
          responseMedicina,
        ] = await Promise.all([
          axios.get(
            "http://156.235.91.67:4000/solicitud/totalFinalizadasConFecha",
            {
              params: {
                fecha_desde: fechaDesde.value,
                fecha_hasta: fechaHasta.value,
              },
            }
          ),
          axios.get(
            "http://156.235.91.67:4000/solicitud/solicitudTipo2PorFecha",
            {
              params: {
                fecha_desde: fechaDesde.value,
                fecha_hasta: fechaHasta.value,
              },
            }
          ),
          axios.get(
            "http://156.235.91.67:4000/solicitud/solicitudTipo4PorFecha",
            {
              params: {
                fecha_desde: fechaDesde.value,
                fecha_hasta: fechaHasta.value,
              },
            }
          ),
          axios.get("http://156.235.91.67:4000/seguimiento/getproductos2", {
            params: {
              fecha_desde: fechaDesde.value,
              fecha_hasta: fechaHasta.value,
            },
          }),
          axios.get(
            "http://156.235.91.67:4000/solicitud/medicinacomunasFecha",
            {
              params: {
                fecha_desde: fechaDesde.value,
                fecha_hasta: fechaHasta.value,
              },
            }
          ),
          axios.get(
            "http://156.235.91.67:4000/solicitud/totalFinalizadas6Fecha",
            {
              params: {
                fecha_desde: fechaDesde.value,
                fecha_hasta: fechaHasta.value,
              },
            }
          ),
        ]);

        chartData.value = processChartData(responseBar.data);
        chartData2.value = processChartData(responsePie.data);
        chartData3.value = processChartData(responsePie2.data);
        chartData5.value = processChartData2(responseMedicina.data);
        const responsesalidaMedicina = await axios.get(
          "http://156.235.91.67:4000/solicitud/totalFinalizadas6Fecha",
          {
            params: {
              fecha_desde: fechaDesde.value,
              fecha_hasta: fechaHasta.value,
            },
          }
        );

        // Agrupar las salidas por nombre de medicina
        const salidasPorMedicina = {};
        responsesalidaMedicina.data.forEach((item) => {
          const nombreMedicina = item.nombre;
          salidasPorMedicina[nombreMedicina] =
            (salidasPorMedicina[nombreMedicina] || 0) + item.cantidad;
        });

        // Transformar el objeto en un array de objetos
        const dataChart6 = Object.entries(salidasPorMedicina).map(
          ([name, value]) => ({
            value: value,
            name: name,
          })
        );

        chartData6.value = dataChart6;
        finalizadasRows.value = Object.entries(response.data).map(
          ([name, value]) => ({ name, value })
        );
      } catch (error) {
        console.error("Error filtering data:", error);
      } finally {
        isLoading.value = false;
      }
    }

    // Funciones para obtener datos de la API
    async function obtenerFinalizadas() {
      try {
        const response = await axios.get(
          "http://156.235.91.67:4000/solicitud/totalFinalizadas3"
        );
        return Object.entries(response.data).map(([name, value]) => ({
          name,
          value,
        }));
      } catch (error) {
        console.error("Error obteniendo datos:", error);
        return [];
      }
    }

    async function obtenerFinalizadas2() {
      try {
        const response = await axios.get(
          "http://156.235.91.67:4000/solicitud/totalFinalizadas5"
        );
        return response.data.map((item) => ({
          nombre: item.nombre,
          cantidad_entrada: item.cantidad_entrada,
          fecha: new Date(item.fecha).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
          tipoentrada: item.tipoentrada,
        }));
      } catch (error) {
        console.error("Error obteniendo datos:", error);
        return [];
      }
    }

    async function obtenerFinalizadas3() {
      try {
        const response = await axios.get(
          "http://156.235.91.67:4000/solicitud/totalFinalizadas4"
        );
        return response.data.map((item) => ({
          comuna: item.comuna,
          medicina: item.MEDICINA,
          insumos: item.INSUMOS,
          total: item.MEDICINA + item.INSUMOS,
        }));
      } catch (error) {
        console.error("Error obteniendo datos:", error);
        return [];
      }
    }

    async function obtenerDatos() {
      try {
        const response = await axios.get(
          "http://156.235.91.67:4000/solicitud/totalFinalizadas6"
        );
        return response.data.map((item) => ({
          solicitud_id: item.solicitud_salud_id,
          nombre: item.nombre,
          fecha: new Date(item.fecha).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
          cantidad: item.cantidad,
        }));
      } catch (error) {
        console.error("Error obteniendo datos:", error);
        return [];
      }
    }

    // Funciones para obtener datos para las gráficas
    async function fetchDataForChart1() {
      try {
        const response = await axios.get(
          "http://156.235.91.67:4000/solicitud/solicitudTipo2"
        );
        return processChartData(response.data);
      } catch (error) {
        console.error("Error fetching data for chart 1:", error);
        return null;
      }
    }

    async function fetchDataForChart2() {
      try {
        const response = await axios.get(
          "http://156.235.91.67:4000/solicitud/solicitudTipo4"
        );
        return processChartData(response.data);
      } catch (error) {
        console.error("Error fetching data for chart 2:", error);
        return null;
      }
    }

    async function fetchDataForChart3() {
      try {
        const response = await axios.get(
          "http://156.235.91.67:4000/seguimiento/getproductos"
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching data for chart 3:", error);
        return null;
      }
    }

    async function fetchDataForChart5() {
      try {
        const response = await axios.get(
          "http://156.235.91.67:4000/solicitud/medicinacomunas"
        );
        return processChartData2(response.data);
      } catch (error) {
        console.error("Error fetching data for chart 5:", error);
        return null;
      }
    }

    // Funciones para procesar datos para las gráficas
    function processChartData(data) {
      const nombres = [];
      const totales = [];
      data.forEach((solicitud) => {
        nombres.push(solicitud.SOLICITUD_NOMBRE);
        totales.push(solicitud.TOTAL_SOLICITUD);
      });
      return { nombres, totales };
    }

    function processChartData2(data) {
      const comunas = [];
      const totales = [];
      data.forEach((item) => {
        comunas.push(item.comuna);
        const medicina = parseInt(item.MEDICINA, 10);
        const insumos = parseInt(item.INSUMOS, 10);
        totales.push(medicina + insumos);
      });
      return { comunas, totales };
    }

    // Hook onMounted para cargar datos al iniciar el componente
    onMounted(async () => {
      isLoading.value = true;
      try {
        chartData2.value = await fetchDataForChart2();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        isLoading.value = false;
      }
      try {
        [
          chartData.value,
          chartData2.value,
          chartData3.value,
          chartData5.value,
          finalizadasRows.value,
          finalizadasRows2.value,
          finalizadasRows3.value,
          finalizadasRows4.value,
        ] = await Promise.all([
          fetchDataForChart1(),
          fetchDataForChart2(),
          fetchDataForChart3(),
          fetchDataForChart5(),
          obtenerFinalizadas(),
          obtenerFinalizadas2(),
          obtenerFinalizadas3(),
          obtenerDatos(),
        ]);

        mostrar.value = true;
        mostrar2.value = true;
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        isLoading.value = false;
      }
    });

    return {
      isLoading,
      chartData,
      chartData2,
      chartData3,
      chartData5,
      finalizadasRows,
      finalizadasRows2,
      finalizadasRows3,
      finalizadasRows4,
      filtrar,
      fechaDesde,
      fechaHasta,
      mostrar,
      mostrar2,
    };
  },
};
</script>

<style lang="scss" scoped>
.img-logo {
  margin: -120px auto -160px auto;
}

.logo-rafael-torrealba {
  width: 125px;
  position: relative;
  margin-top: -30px;
  left: 67%;
  padding: -100px auto 150px auto;
}

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
