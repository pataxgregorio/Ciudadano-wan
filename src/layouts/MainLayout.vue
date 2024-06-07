<template>
  <q-layout view="lHh Lpr lFf" class="background-image">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title> Atencion al Ciudadano </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      class="margen-top"
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

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
import EssentialLink from "components/EssentialLink.vue";

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
