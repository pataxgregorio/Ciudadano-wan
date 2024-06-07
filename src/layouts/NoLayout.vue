<template>
  <q-layout view="lHh Lpr lFf" class="background-image">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<style>
.margen-top {
  display: flex;
  align-items: center;
}
.background-image {
  background-image: url("/images/main.png");
  background-size: cover; /* Cubre todo el espacio disponible */
  background-position: center;
  background-repeat: no-repeat;
}
@media (max-width: 600px) {
  /* Ajusta el valor según tus necesidades */
  .background-image {
    background-size: fill; /* Contiene la imagen sin deformarla */
    background-position: top; /* Opcional, para alinear la imagen arriba */
  }
}
</style>
<script setup>
import { ref } from "vue";

defineOptions({
  name: "MainLayout",
});

const linksList = [
  {
    title: "Crear Solicitud",
    icon: "event",
    link: "https://quasar.dev",
  },
  {
    title: "Consultar Solicitud",
    icon: "touch_app",
    link: "https://github.com/quasarframework",
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
