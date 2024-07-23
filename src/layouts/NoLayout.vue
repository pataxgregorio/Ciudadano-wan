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
