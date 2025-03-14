<template>
  <q-layout view="lHh Lpr lFf" class="background-image">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          <img src="/images/logoSIA.png" alt="" class="logo-sia-header">
          <!-- <div class="letras">
            <div class="letra-S">S</div>
            <div class="letra-I">I</div>
            <div class="letra-A">A</div>
          </div> -->
        </q-toolbar-title>

        <!-- <q-btn v-if="showVerEstadisticasButton" label="Ver Estadisticas" color="primary" to="/dashboard"
          class="texto-menu" /> -->
        <!-- <q-btn v-if="showVerConsultaButton" label="Consultar Solicitud" color="primary" to="/consulta"
          class="texto-menu" /> -->
        <!-- <q-btn v-if="showVerListadoButton" label="Consulta Comunas" color="primary" to="/buscarcomunas"
          class="texto-menu" /> -->
        <div class="iconos">
          <q-btn color="primary" to="/dashboard" class="texto-menu">
            <q-icon name="dashboard" />
            <p>Dashboard</p>
          </q-btn>
          <q-btn color="primary" to="/consulta" class="texto-menu">
            <q-icon name="search" />
            <p>Buscar</p>
          </q-btn>
          <q-btn color="primary" to="/buscarcomunas" class="texto-menu">
            <q-icon name="location_city" />
            <p>Comunas</p>
          </q-btn>
          <q-btn color="primary" @click="logout" class="texto-menu">
            <q-icon name="logout" />
            <p>Salir</p>
          </q-btn>
        </div>
        <!-- <q-btn label="Cerrar Sesión" color="primary" @click="logout" class="texto-menu" /> -->
      </q-toolbar>
    </q-header>

    <!-- <q-drawer v-model="leftDrawerOpen" side="left" show-if-above :width="250" :breakpoint="700">
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px;">
        <q-list padding>
          <q-item clickable v-ripple :to="{ name: 'dashboard' }">
            <q-item-section avatar>
              <q-icon name="dashboard" />
            </q-item-section>
            <q-item-section>
              Ver Estadísticas
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple :to="{ name: 'consulta' }">
            <q-item-section avatar>
              <q-icon name="search" />
            </q-item-section>
            <q-item-section>
              Consultar Solicitud
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple :to="{ name: 'listado' }">
            <q-item-section avatar>
              <q-icon name="list" />
            </q-item-section>
            <q-item-section>
              Listar Solicitudes
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple :to="{ name: 'buscarcomunas' }">
            <q-item-section avatar>
              <q-icon name="location_city" />
            </q-item-section>
            <q-item-section>
              Reporte Comunas Atendidas
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple @click="logout">
            <q-item-section avatar>
              <q-icon name="logout" />
            </q-item-section>
            <q-item-section>
              Cerrar Sesión
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer> -->

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
const showVerListadoButton = computed(() => route.path !== "/buscarcomunas");


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
.logo-sia-header {
  width: 50px;
}

.letras {
  display: flex;
  font-weight: bold;
  font-size: 25px;
}

.letra-S {
  color: rgb(250, 41, 41);
}

.letra-I {
  color: rgb(47, 47, 247);
}

.letra-A {
  color: rgb(44, 243, 44);
}

.texto-menu {
  font-size: 12px;
  font-weight: bold;
}

.background-image {
  background-image: url("/images/SIAMOBILE1.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.iconos {
  display: flex;
  align-items: center;
}

@media (min-width: 768px) {
  .background-image {
    background-image: url("/images/SIADESK1.jpg");
    background-size: fill;
    background-position: top;
  }
}
</style>
