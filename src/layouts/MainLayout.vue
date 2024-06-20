<template>
  <q-layout view="lHh Lpr lFf" class="background-image">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title> Atencion al Ciudadano </q-toolbar-title>

        <q-btn v-if="showVerEstadisticasButton" label="Ver Estadisticas" color="primary" to="/dashboard" />
        <q-btn v-if="showVerConsultaButton" label="Consultar Solicitud" color="primary" to="/consulta" />
        <q-btn label="Cerrar Sesión" color="primary" @click="logout" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const showVerEstadisticasButton = computed(() => route.path !== "/dashboard");
const showVerConsultaButton = computed(() => route.path !== "/consulta");


function logout() {
  localStorage.removeItem("token");

  router.push("/");
}

defineOptions({
  name: "MainLayout",
});


const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
<style>
.margen-top {
  display: flex;
  align-items: center;
}

.background-image {
  background-image: url("/images/main.png");
  background-size: cover;
  /* Cubre todo el espacio disponible */
  background-position: center;
  background-repeat: no-repeat;
}

@media (max-width: 600px) {

  /* Ajusta el valor según tus necesidades */
  .background-image {
    background-size: fill;
    /* Contiene la imagen sin deformarla */
    background-position: top;
    /* Opcional, para alinear la imagen arriba */
  }
}
</style>