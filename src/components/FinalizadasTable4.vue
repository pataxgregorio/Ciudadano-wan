<template>
  <div class="q-pa-md">
    <q-table
      :title="titulo"
      :rows="rows2"
      :columns="columns"
      row-key="solicitud_id"
      v-model:pagination="pagination"
      @request="onRequest"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="solicitud_id" :props="props">{{
            props.row.solicitud_id
          }}</q-td>
          <q-td key="nombre" :props="props">{{ props.row.nombre }}</q-td>
          <q-td key="fecha" :props="props">{{ props.row.fecha }}</q-td>
          <q-td key="cantidad" :props="props">{{ props.row.cantidad }}</q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  name: "FinalizadasTable4",
  props: {
    rows2: {
      type: Array,
      required: true,
    },
    titulo: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const columns = [
      { name: "solicitud_id", label: "Solicitud ID", field: "solicitud_id" },
      { name: "nombre", label: "Nombre", field: "nombre" },
      { name: "fecha", label: "Fecha", field: "fecha" },
      { name: "cantidad", label: "Cantidad", field: "cantidad" },
    ];

    const pagination = ref({
      page: 1,
      rowsPerPage: 5,
    });

    const onRequest = (props) => {
      const { page, rowsPerPage } = props.pagination;
      // ... aquí puedes implementar la lógica de paginación si es necesario
    };

    // Watcher para actualizar la tabla cuando cambien los datos de las filas
    watch(
      () => props.rows2.value,
      (newRows) => {
        console.log("rows2 ha cambiado:", newRows);
        // Aquí puedes actualizar la tabla con las nuevas filas si es necesario
      }
    );

    return { columns, pagination, onRequest };
  },
});
</script>
