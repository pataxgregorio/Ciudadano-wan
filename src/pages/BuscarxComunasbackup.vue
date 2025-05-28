<template>
  <div class="container">
    <div class="header">
      <div class="logo">
        <img src="/images/logo.png" alt="" width="200px" />
      </div>
      <div class="titulo">
        <p class="titulo-header">Reporte Solicitudes</p>
      </div>
      <div class="logo">
        <img src="/images/logoSIA.png" alt="" width="200px" />
      </div>
    </div>
    <section class="content">
      <div class="tituloComunas">Resumen de Solicitudes por Comunas:</div>
      <div class="resumenComunas">
        <div class="solicitudes">
          <div
            v-for="solicitud in solicitudesxcomunas"
            :key="solicitud.id"
            class="solicitud"
          >
            <a
              href="/#/buscarcomunas"
              @click.prevent="verSolicitudes(solicitud.id, solicitud.comuna)"
            >
              <p class="nombre-comuna-card">
                <strong>{{ solicitud.comuna }}</strong>
              </p>
              <p class="total-comuna-card">{{ solicitud.TOTAL_SOLICITUD }}</p>
            </a>
          </div>
        </div>
      </div>
    </section>

    <q-dialog v-model="mostrarModal">
      <q-card class="card-solicitudes">
        <q-card-section class="card-solicitudes-modal">
          <div class="text-h6">
            Solicitudes de la Comuna: <strong> {{ comunaNombre }} </strong>
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="solicitudes-modal">
            <q-card
              v-for="solicitudes in solicitudes"
              :key="solicitudes.id"
              class="my-card"
            >
              <q-card-section class="form section" style="margin-top: 10px">
                <div class="seccion-1-ver">
                  <li>
                    <span class="negrita">Tipo de Solicitud:</span>
                    {{ solicitudes.tipo_subsolicitud }}
                  </li>
                  <li>
                    <span class="negrita">Total:</span> {{ solicitudes.total }}
                  </li>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
1;
import axios from "axios";

export default {
  data() {
    return {
      comunas: [],
      solicitudesxcomunas: [],
      comunaSeleccionada: null,
      mostrarModal: false,
      comunaId: null,
      solicitudes: [],
    };
  },
  async mounted() {
    try {
      const response = await axios.get("http://156.235.91.67:4000/getComunas");
      const responseSolicitudes = await axios.get(
        "http://156.235.91.67:4000/getSolicitudporComunasWAN"
      );
      this.comunas = response.data;
      this.solicitudesxcomunas = responseSolicitudes.data;
    } catch (error) {
      console.error("Error al obtener las comunas:", error);
    }
  },
  methods: {
    verSolicitudes(id, comunaNombre) {
      this.comunaId = id;
      this.mostrarModal = true;
      this.comunaNombre = comunaNombre;

      axios
        .get(
          `http://156.235.91.67:4000/solicitudComunaTotalResumen/?id=${this.comunaId}`
        )
        .then((response) => {
          this.solicitudes = response.data;
        })
        .catch((error) => {
          console.error(
            "Error al obtener los detalles de la solicitud:",
            error
          );
        });
    },
  },
};
</script>

<style>
.container {
  max-width: 80%;
  margin: 0 auto 0 auto;
  align-items: center;
  background-color: white;
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

@media (min-width: 768px) {
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
    margin-bottom: 20px;
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
}
</style>
