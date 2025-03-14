<template>
  <q-page class="">
    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <FinalizadasTable4
        :rows2="finalizadasRows2"
        :titulo="'Ultimas Salidas de Medicinas'"
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
import FinalizadasTable4 from "components/FinalizadasTable4.vue";

export default {
  name: "IndexPage",
  components: {
    FinalizadasTable4,
  },
  setup() {
    const isLoading = ref(true);
    const chartData = ref(null);
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
        chartData4.value = responseGauge.data;
        finalizadasRows.value = Object.entries(response.data).map(
          ([name, value]) => ({ name, value })
        );
      } catch (error) {
        console.error("Error filtering data:", error);
        // Mostrar un mensaje de error al usuario, por ejemplo, con una alerta
      }
    }

    async function obtenerDatos() {
      isLoading.value = true;
      try {
        const response = await axios.get(
          "http://192.168.0.113:7001/solicitud/totalFinalizadas6"
        );
        const data = response.data;

        finalizadasRows2.value = data.map((item) => ({
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
      } finally {
        isLoading.value = false;
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
      await obtenerDatos();
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
