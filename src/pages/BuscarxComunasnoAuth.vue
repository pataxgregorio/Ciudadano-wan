<template>
  <div class="fondo">
    <!-- <p class="titulo2-header"></p> -->
    <div class="filtrado">
      <div class="fechas">
        <div class="desde">
          <p class="negrita">Fecha Desde:</p>
          <input type="date" class="input" v-model="fechaDesde" />
        </div>
        <div class="hasta">
          <p class="negrita">Fecha Hasta:</p>
          <input type="date" class="input" v-model="fechaHasta" />
        </div>
      </div>

      <div class="botones-periodo">
        <label>
          <input type="checkbox" v-model="periodoSeleccionado" value="dia" @change="seleccionarPeriodo" /> 1 Día
        </label>
        <label>
          <input type="checkbox" v-model="periodoSeleccionado" value="semana" @change="seleccionarPeriodo" /> 1 Semana
        </label>
        <label>
          <input type="checkbox" v-model="periodoSeleccionado" value="mes" @change="seleccionarPeriodo" /> 1 Mes
        </label>
      </div>

      <div class="Comunas">
        <p class="negrita">Comuna:</p>
        <select v-model="selectedComunaId" class="comuna-select" @change="onComunaChange">
          <option value="">Seleccione una Comuna</option>
          <option v-for="comuna in comunas" :key="comuna.id" :value="comuna.id">
            {{ comuna.codigo }}
          </option>
        </select>
      </div>
      <div class="Comunidades" v-if="selectedComunaId">
        <p class="negrita">Comunidad:</p>
        <select v-model="selectedComunidadId" class="comunidad-select">
          <option value="">Seleccione una Comunidad</option>
          <option v-for="comunidad in filteredComunidades" :key="comunidad.id" :value="comunidad.id">
            {{ comunidad.nombre }}
          </option>
        </select>
      </div>
      <button @click="filtrar" class="boton-filtrar">Filtrar</button>
    </div>

    <div v-if="mostrarModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h2 class="titulo-resultados-filtro">Resultados del Filtro</h2>
          <button @click="cerrarModal" class="close-button">X</button>
        </div>
        <div class="modal-content">
          <div class="tituloComunas">Comuna: {{ comunaNombre }}</div>
          <div class="tituloComunidades">Comunidad: {{ comunidadNombre }}</div>
          <div class="solicitudes-lista">
            <p v-for="solicitud in solicitudesSinTotal" :key="solicitud.id">
              {{ solicitud.tipo_subsolicitud }} = {{ solicitud.total }}
            </p>
          </div>
          <div class="total-general" v-if="solicitudTotal">
            <p>{{ solicitudTotal.tipo_subsolicitud }} = {{ solicitudTotal.total }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ref, computed } from 'vue';

export default {
  data() {
    return {
      comunas: [],
      comunidades: [],
      solicitudes: [],  // Original array from the API
      selectedComunaId: null,
      selectedComunidadId: null,
      fechaDesde: null,
      fechaHasta: null,
      comunaNombre: null,
      comunidadNombre: null,
      haFiltrado: false,
      filteredComunidades: [],
      periodoSeleccionado: [],
      mostrarModal: false,
      solicitudTotal: null, // Store the "TOTAL" object here
    };
  },
  computed: {
    solicitudesSinTotal() {
      // Filter out the "TOTAL" object and return only the other solicitudes
      return this.solicitudes.filter(s => s.tipo_subsolicitud !== 'TOTAL');
    }
  },
  async mounted() {
    try {
      const response = await axios.get("http://192.168.0.113:7001/getComunas");
      const response2 = await axios.get("http://192.168.0.113:7001/getComunidades");
      this.comunas = response.data;
      this.comunidades = response2.data;
    } catch (error) {
      console.error("Error al obtener las comunas:", error);
    }
  },
  watch: {
    selectedComunaId(newComunaId) {
      if (newComunaId) {
        this.filteredComunidades = this.comunidades.filter(comunidad => comunidad.comuna_id === newComunaId);
      } else {
        this.filteredComunidades = [];
      }
      this.selectedComunidadId = null;
    }
  },
  methods: {
    onComunaChange() {
      this.selectedComunidadId = null;
      this.haFiltrado = false;
      this.cerrarModal();
    },
    seleccionarPeriodo() {
      if (this.periodoSeleccionado.length > 1) {
        this.periodoSeleccionado = [this.periodoSeleccionado[this.periodoSeleccionado.length - 1]];
      }
      const periodo = this.periodoSeleccionado[0];

      if (!periodo) {
        this.fechaDesde = null;
        this.fechaHasta = null;
        return;
      }

      const hoy = new Date();
      this.fechaHasta = this.formatDate(hoy);
      if (periodo === "dia") {
        hoy.setDate(hoy.getDate() - 1);
      } else if (periodo === "semana") {
        hoy.setDate(hoy.getDate() - 7);
      } else if (periodo === "mes") {
        hoy.setMonth(hoy.getMonth() - 1);
      }
      this.fechaDesde = this.formatDate(hoy);
    },
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    async filtrar() {
      if (!this.selectedComunaId) {
        alert("Por favor, selecciona una comuna.");
        return;
      }

      let url = `http://192.168.0.113:7001/solicitudComunaTotalResumen/`;
      let params = {
        fecha_desde: this.fechaDesde,
        fecha_hasta: this.fechaHasta,
        comuna_id: this.selectedComunaId,
      };

      if (this.selectedComunidadId) {
        params.comunidad_id = this.selectedComunidadId;
      }

      try {
        const response = await axios.get(url, { params });
        // Store the full response data
        this.solicitudes = response.data;

        // Extract and store the "TOTAL" object
        this.solicitudTotal = this.solicitudes.find(s => s.tipo_subsolicitud === 'TOTAL');


        this.comunaNombre = this.comunas.find(c => c.id === this.selectedComunaId)?.codigo || "Comuna Desconocida";
        this.comunidadNombre = this.comunidades.find(c => c.id === this.selectedComunidadId)?.nombre || "";
        this.mostrarModal = true;
      } catch (error) {
        console.error("Error al obtener los detalles de la solicitud:", error);
        alert("Error al obtener los detalles de la solicitud. Por favor, inténtalo de nuevo más tarde.");
      }
    },
    cerrarModal() {
      this.mostrarModal = false;
    },
  },
};
</script>
<style>
/* Globales */

* {
  color: black;
}


/* Titulos */

.header h1 {
  font-size: 30px;
}


.tituloComunas {
  font-size: 25px;
}

.tituloComunidades {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
}

.titulo2-header {
  background-color: black;
  color: white;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  padding: 20px 0px 20px 0px;
}

.titulo-resultados-filtro {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}

.negrita {
  font-weight: bold;
  margin-left: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
}

.content {
  display: flex;
  flex-direction: column;
}


.comunas {
  display: flex;
  justify-content: flex-end;
}


.solicitudes {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 10px;
}

.solicitud {
  border: 1px solid #ccc;
  text-align: center;
  max-width: 80%;
}

.section {
  display: flex;
  justify-content: space-between;
}

.seccion-1-ver {
  display: flex;
  flex-direction: column;
}

.seccion-1-ver li {
  list-style: none;
}

.seccion-3-ver li {
  list-style: none;
}

.seccion-3-ver p {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  max-width: 120px;
}

.boton-filtrar {
  color: white;
  border-radius: 20px;
  width: 8rem;
  height: 2.5rem;
  margin: 20px auto 20px auto;
  font-size: 20px;
  font-weight: bold;
  margin-left: 20px;

}

.input,
.comuna-select,
.comunidad-select {
  border-radius: 20px;
  background-color: rgb(235, 234, 234);
  color: rgb(0, 0, 0);
}

.fechas {
  display: flex;
  gap: 20px;
  max-width: 100vw;
}

.comunas {
  display: flex;
  align-items: center;
  /* Vertically align items */
  max-width: 50px;
  margin-bottom: 1rem;
}

.Comunidades {
  display: flex;
  flex-direction: column;
}

.comuna-select,
.comunidad-select {
  margin-right: 1rem;
}

.comuna-select {
  max-width: 87vw;
}

.filtrado {
  justify-content: center;
  padding: 1rem;
}

.resultados {
  background-color: rgb(243, 243, 243);
}

.botones-periodo {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  color: black;
  /* Add some spacing */
}

.botones-periodo label {
  display: flex;
  align-items: center;
  /* Vertical alignment */
  gap: 5px;
  color: black;
  /* Space between checkbox and text */
  /* checkbox text color */
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  /* Semi-transparent black */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  /* Ensure it's on top */
}

.modal {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  max-width: 80%;
  /* Limit modal width */
  max-height: 80vh;
  /* Limit the modal Height*/
  overflow-y: auto;
  /* Add scroll if content overflows vertically*/

}


.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.modal-header h2 {
  margin: 0;
  /* Remove default margin */
}

.close-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.modal-content {
  color: black;
}

.botones-periodo {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  color: black;
}

.botones-periodo label {
  display: flex;
  align-items: center;
  gap: 5px;
  color: black;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  max-width: 80%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.titulo-resultados-filtro {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}

.modal-header h2 {
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.modal-content {
  color: black;
}

.total-general {
  margin-top: 20px;
  /* Add some space above the total */
  font-weight: bold;
  border-top: 1px solid #ccc;
  /* Optional: Add a separator line */
  padding-top: 10px;
  /* Space above the line */
}

.header {
  display: flex;
  justify-content: space-between;
}

.content {
  display: flex;
  flex-direction: column;
}

.header h1 {
  font-size: 30px;
}

.comunas {
  display: flex;
  justify-content: flex-end;
}

.tituloComunas {
  font-size: 25px;
}

.tituloComunidades {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
}

.solicitudes {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 10px;
}

.solicitud {
  border: 1px solid #ccc;
  text-align: center;
  max-width: 80%;
}

.section {
  display: flex;
  justify-content: space-between;
}

.negrita {
  font-weight: bold;
  margin-left: 20px;
}

.seccion-1-ver {
  display: flex;
  flex-direction: column;
}

.seccion-1-ver li {
  list-style: none;
}

.seccion-3-ver li {
  list-style: none;
}

.seccion-3-ver p {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  max-width: 120px;
}

.titulo2-header {
  color: white;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  padding: 20px 0px 20px 0px;
}

.boton-filtrar {
  background-color: black;
  color: white;
  border-radius: 20px;
  width: 8rem;
  height: 2.5rem;
  margin: 20px auto 20px auto;
  font-size: 20px;
  font-weight: bold;
}

.input,
.comuna-select,
.comunidad-select {
  border-radius: 20px;
  background-color: rgb(235, 234, 234);
  color: rgb(0, 0, 0);
}

.fechas {
  display: flex;
  gap: 20px;
  max-width: 100vw;
}

.comunas {
  display: flex;
  align-items: center;
  /* Vertically align items */
  max-width: 50px;
  margin-bottom: 1rem;
}

.Comunidades {
  display: flex;
  flex-direction: column;
}

.comuna-select,
.comunidad-select {
  margin-right: 1rem;
}

.comuna-select {
  max-width: 87vw;
}

.boton-filtrar {
  margin-left: 20px;
}

.filtrado {
  color: white;
  justify-content: center;
  padding: 1rem;
}

.resultados {
  background-color: rgb(243, 243, 243);
}

@media(min-width: 768px) {
  .card-solicitudes {
    min-width: 80%;
    min-height: 40%;
  }

  .comuna-select,
  .comunidad-select {
    max-width: 25rem;
  }
}

@media (max-width: 768px) {
  .solicitudes {
    grid-template-columns: repeat(2, 1fr);
  }

  .tituloComunas {
    font-size: 16px;
    font-weight: bold;
  }

  .nombre-comuna-card {
    font-size: 12px;
  }

  .solicitud {
    border: 1px solid #ccc;
    /* Degradado de rojo a azul */
    color: black;
    border-radius: 10px;
    text-align: center;
    min-height: 90px;
    min-width: 80px;
  }

  .solicitudes {
    margin-left: 20px;
  }

  .header {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .titulo-header {
    font-size: 17px;
    font-weight: bold;
    margin-top: 80px;
    margin-bottom: 10px;
    text-align: center;
  }

  .fechas {
    flex-direction: column;
  }

}

@media(min-width: 768px) {
  .card-solicitudes {
    min-width: 80%;
    min-height: 40%;
  }

}

@media (max-width: 768px) {
  .solicitudes {
    grid-template-columns: repeat(2, 1fr);
  }

  .tituloComunas {
    font-size: 16px;
    font-weight: bold;
  }

  .nombre-comuna-card {
    font-size: 12px;
  }

  .solicitud {
    border: 1px solid #ccc;
    /* Degradado de rojo a azul */
    color: black;
    border-radius: 10px;
    text-align: center;
    min-height: 90px;
    min-width: 80px;
  }

  .solicitudes {
    margin-left: 20px;
  }

  .header {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .titulo-header {
    font-size: 17px;
    font-weight: bold;
    margin-top: 80px;
    margin-bottom: 10px;
    text-align: center;
  }

  .fechas {
    flex-direction: column;
  }

}
</style>
