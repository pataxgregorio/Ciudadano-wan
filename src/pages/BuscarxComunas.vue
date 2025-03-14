<template>
  <div class="fondo">
    <p class="titulo2-header">Ayudas Entregadas por Comunas</p>
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

      <div class="Comunas">
        <p class="negrita">Comuna:</p>
        <select v-model="selectedComunaId" class="comuna-select" @change="onComunaChange">
          <option value="">Seleccione una Comuna</option>
          <option v-for="comuna in comunas" :key="comuna.id" :value="comuna.id">
            {{ comuna.codigo }}
          </option>
        </select>
      </div>
      <button @click="filtrar" class="boton-filtrar">Filtrar</button>
    </div>

    <div class="resultados-lista" v-if="mostrarResultados">
      <h2 class="titulo-resultados-filtro">Resultados del Filtro</h2>
      <div class="tituloComunas">Comuna: {{ comunaNombre }}</div>
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
</template>

<script>
import axios from "axios";
import { ref, computed } from 'vue';

export default {
  data() {
    return {
      comunas: [],
      comunidades: [],
      solicitudes: [],
      selectedComunaId: null,
      selectedComunidadId: null,
      fechaDesde: null,
      fechaHasta: null,
      comunaNombre: null,
      comunidadNombre: null,
      haFiltrado: false,
      filteredComunidades: [],
      periodoSeleccionado: [],
      // mostrarModal: false,  // Comentado: Ya no se usa el modal
      solicitudTotal: null,
      mostrarResultados: false, // Nueva variable para mostrar/ocultar resultados
    };
  },
  computed: {
    solicitudesSinTotal() {
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
      // this.cerrarModal(); // Comentado: Ya no se cierra el modal
      this.mostrarResultados = false; // Oculta los resultados al cambiar de comuna
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
        this.solicitudes = response.data;
        this.solicitudTotal = this.solicitudes.find(s => s.tipo_subsolicitud === 'TOTAL');
        this.comunaNombre = this.comunas.find(c => c.id === this.selectedComunaId)?.codigo || "Comuna Desconocida";
        this.comunidadNombre = this.comunidades.find(c => c.id === this.selectedComunidadId)?.nombre || "";
        // this.mostrarModal = true; // Comentado: Ya no se muestra el modal
        this.mostrarResultados = true; // Mostrar los resultados fuera del modal

      } catch (error) {
        console.error("Error al obtener los detalles de la solicitud:", error);
        alert("Error al obtener los detalles de la solicitud. Por favor, inténtalo de nuevo más tarde.");
      }
    },
    /*  cerrarModal() {   //Comentado ya que no se usa el modal
      this.mostrarModal = false;
    }, */
  },
};
</script>
<style>
/* Estilos generales */
.negrita {
  font-weight: bold;
  margin-left: 20px;
  color: black;
}

.input,
.comuna-select,
.comunidad-select {
  border-radius: 20px;
  background-color: rgb(235, 234, 234);
  color: rgb(0, 0, 0);
}

/* Títulos */
.titulo2-header {
  color: black;
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

.tituloComunas {
  font-size: 25px;
}

.tituloComunidades {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
}

/* Contenedores y Layout */
.header {
  display: flex;
  justify-content: space-between;
}

.content {
  display: flex;
  flex-direction: column;
}

.filtrado {
  color: white;
  justify-content: center;
  padding: 1rem;
}

.fechas {
  display: flex;
  gap: 20px;
  max-width: 100vw;
}

.Comunas {
  margin-top: 20px;
}

.Comunidades {
  display: flex;
  flex-direction: column;
}

.comunas {
  display: flex;
  justify-content: flex-end;
  /* Esto se movió a .comunas */
  align-items: center;
  /*  Alineación vertical */
  max-width: 50px;
  margin-bottom: 1rem;
}

.section {
  display: flex;
  justify-content: space-between;
}

/* Estilos para los elementos dentro de los contenedores */
.boton-filtrar {
  background: rgb(0, 0, 0);
  color: white;
  border-radius: 20px;
  width: 8rem;
  height: 2.5rem;
  margin: 20px auto 20px auto;
  font-size: 20px;
  font-weight: bold;
  margin-left: 20px;
}

.comuna-select,
.comunidad-select {
  margin-right: 1rem;
}

.comuna-select {
  max-width: 87vw;
}

/* Estilos para la lista de solicitudes */
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

.total-general {
  margin-top: 20px;
  font-weight: bold;
  border-top: 1px solid #ccc;
  padding-top: 10px;
}

/* Estilos para el modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
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

/* Estilos para los botones de período (actualmente comentados) */
/* .botones-periodo {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.botones-periodo label {
  display: flex;
  align-items: center;
  gap: 5px;
  color: white;
} */

/* Estilos para secciones específicas (actualmente no utilizados) */
/* .seccion-1-ver {
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
} */

/* Media queries para responsividad */
@media(min-width: 768px) {
  .card-solicitudes {
    min-width: 80%;
    min-height: 40%;
  }
}

@media (max-width: 768px) {
  .solicitudes {
    grid-template-columns: repeat(2, 1fr);
    margin-left: 20px;
    /* Se movió aquí desde el estilo .solicitudes general */

  }

  .tituloComunas {
    font-size: 16px;
    font-weight: bold;
  }

  .titulo-header {
    font-size: 17px;
    font-weight: bold;
    margin-top: 80px;
    margin-bottom: 10px;
    text-align: center;
  }

  .header {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .fechas {
    gap: 10px;
  }

  .hasta {
    margin-right: 20px;
  }

  .resultados-lista {
    text-align: center;
    background-color: white;
  }

  /* .nombre-comuna-card y .solicitud no existen en tu HTML,
   * así que estos estilos no tendrán efecto a menos que los agregues.
   */
  /* .nombre-comuna-card {
    font-size: 12px;
  } */

  /* .solicitud {
    border: 1px solid #ccc;
    color: black;
    border-radius: 10px;
    text-align: center;
    min-height: 90px;
    min-width: 80px;
  } */
}
</style>
