<template>
  <q-page>
    <div class="filtrado">
      <div class="fechas">
        <div class="desde">
          <p class="negrita">Fecha Desde:</p>
          <input type="date" v-model="fechaDesde" />
        </div>
        <div class="hasta">
          <p class="negrita">Fecha Hasta:</p>
          <input type="date" v-model="fechaHasta" />
        </div>
      </div>
      <div class="Comunas">
        <p class="negrita">Comunas:</p>
        <select v-model="selectedComunaId" class="comuna-select">
          <option v-for="comuna in comunas" :key="comuna.id" :value="comuna.id">
            {{ comuna.codigo }}
          </option>
        </select>
        <button @click="filtrar" class="btn">Filtrar</button>
      </div>
    </div>
    <div class="q-pa-md">
      <q-table
        flat
        bordered
        title="Tabla"
        dense
        :rows="solicitudesRows"
        :columns="columns"
        row-key="name"
      />
    </div>
    <!-- <div class="botones">
      <q-btn color="black" @click="filtrarPorEstado(1)">
        <li>Registradas</li>
      </q-btn>
      <q-btn color="black" @click="filtrarPorEstado(5)">
        <li>Finalizadas</li>
      </q-btn>
      <q-btn color="black" @click="filtrarPorEstado(2)">
        <li>En Análisis</li>
      </q-btn>
    </div> -->
    <q-btn
      class="imprimir"
      color="black"
      label="Imprimir"
      @click="imprimir"
    ></q-btn>
  </q-page>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";

const getComunas = async () => {
  const response = await axios.get("http://156.235.91.67:4000/getComunas");
  console.log(response.data);
  return response.data;
};

export default {
  setup() {
    const comunas = ref([]);
    const solicitudesRows = ref([]);
    const selectedComunaId = ref(null);
    const fechaDesde = ref(null);
    const fechaHasta = ref(null);

    const columns = [
      {
        name: "solicitud_salud_id",
        label: "Nro Solicitud",
        field: "solicitud_salud_id",
      },
      { name: "nombre", label: "Nombre Solicitante", field: "nombre" },
      { name: "cedula", label: "Cédula", field: "cedula" },
      { name: "direccion", label: "Dirección", field: "direccion" },
    ];

    async function filtrarPorEstado(status) {
      await filtrar({ status });
    }

    async function imprimir(params = {}) {
      try {
        const url =
          "http://156.235.91.67:4000/solicitud/imprimirWAN?" +
          "fechaDesde=" +
          fechaDesde.value +
          "&" +
          "fechaHasta=" +
          fechaHasta.value +
          "&" +
          "status=" +
          (params.status || null) +
          "&" +
          "comuna_id=" +
          selectedComunaId.value;

        window.open(url, "_blank");
      } catch (error) {
        console.error("Error al imprimir:", error);
      }
    }

    async function filtrar(params = {}) {
      try {
        const queryParams = {
          fechaDesde: fechaDesde.value,
          fechaHasta: fechaHasta.value,
          status: params.status || null,
          comuna_id: selectedComunaId.value,
        };

        const response = await axios.get(
          "http://156.235.91.67:4000/solicitud/getSolicitudesWAN",
          {
            params: queryParams,
          }
        );

        solicitudesRows.value = response.data;
        console.log(solicitudesRows.value);
      } catch (error) {
        console.error("Error obteniendo datos:", error);
      }
    }

    onMounted(async () => {
      await filtrar();
      const response = await getComunas();
      comunas.value = [{ id: null, codigo: "Seleccionar Comuna" }, ...response];
      console.log(comunas.value);
    });

    const options = comunas;

    return {
      options,
      comunas,
      selectedComunaId,
      solicitudesRows,
      columns,
      filtrar,
      filtrarPorEstado,
      fechaDesde,
      fechaHasta,
      imprimir,
    };
  },
};
</script>
<style>
@media screen and (max-width: 599px) {
  .botones li {
    width: 50px;
    height: 15px;
  }

  .filtrado {
    flex-direction: column;
  }

  .Comunas {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .comuna-select {
      /* Agregar clase al select */
      max-width: 90vw;
      /* Limitar el ancho al 90% del viewport */
    }
  }
}

.Comunas {
  flex-direction: column;
}

.fechas {
  display: flex;
  gap: 5px;
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

.botones {
  display: flex;
  list-style: none;
  gap: 50px;
  justify-content: center;
}

.botones li {
  width: 150px;
  height: 30px;
  text-align: center;
  font-size: 18px;
}

.imprimir {
  margin: 20px 0px 0px 20px;
}

.btn {
  padding: 10px;
  background-color: black;
  color: white;
  border-radius: 10px;
}
</style>
