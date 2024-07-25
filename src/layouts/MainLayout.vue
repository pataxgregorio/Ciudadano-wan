<template>
  <q-layout view="lHh Lpr lFf" class="background-image">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title> Atencion al Ciudadano </q-toolbar-title>

        <q-btn v-if="showVerEstadisticasButton" label="Ver Estadisticas" color="primary" to="/dashboard" />
        <q-btn v-if="showVerConsultaButton" label="Consultar Solicitud" color="primary" to="/consulta" />
        <q-btn v-if="showVerListadoButton" label="Listar Solicitudes" color="primary" to="/listado" />
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
const showVerListadoButton = computed(() => route.path !== "/listado");


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
  background-image: url("/images/mobile.jpg");
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