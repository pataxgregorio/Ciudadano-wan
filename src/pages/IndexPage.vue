<template>
  <div class="container q-pa-md">
    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <bar-chart></bar-chart>
    </div>
    <q-card class="my-card">
      <q-card-section>
        <div class="text-h6">CONSULTAR SOLICITUD</div>
        <div class="text-subtitle2">
          INGRESE SU CÉDULA O NÚMERO DE SOLICITUD
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input
          v-model="searchQuery"
          outlined
          dense
          placeholder="Cédula o número de solicitud"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Buscar" color="primary" @click="buscarSolicitud" />
      </q-card-actions>

      <q-card-section v-if="solicitudEncontrada">
        <div class="text-h6">Resultado de la búsqueda:</div>
        <div>{{ solicitudEncontrada }}</div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { ref } from "vue";
import BarChart from "components/BarChart.vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "IndexPage",
  components: { BarChart },
  setup() {
    const searchQuery = ref("");
    const solicitudEncontrada = ref(null);

    const buscarSolicitud = () => {
      // Lógica para buscar la solicitud utilizando searchQuery
      // Actualizar solicitudEncontrada con los resultados
    };

    return {
      searchQuery,
      solicitudEncontrada,
      buscarSolicitud,
    };
  },
});
</script>

<style lang="scss" scoped></style>
