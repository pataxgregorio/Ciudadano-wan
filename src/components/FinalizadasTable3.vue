<template>
    <div class="q-pa-md">
      <q-table
        :title=titulo
        :rows="rows"
        :columns="columns"
        row-key="name"
        v-model:pagination="pagination"
        @request="onRequest"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="comuna" :props="props">
              {{ props.row.comuna }}
            </q-td>
            <q-td key="medicina" :props="props">
              {{ props.row.medicina }}
            </q-td>
            <q-td key="insumos" :props="props">
              {{ props.row.insumos }}
            </q-td>
            <q-td key="total" :props="props">
              {{ props.row.total }}
            </q-td>
          </q-tr>
        </template>
  
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>
      </q-table>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref } from "vue";
  
  export default defineComponent({
    name: "FinalizadasTable3",
    props: {
      rows: {
        type: Array,
        required: true,
      },
      titulo: {
        type: String,
        required: true,
      },
    },
  
    setup() {
      const columns = [
        { name: "comuna", label: "Comuna", field: "comuna" },
        { name: "medicina", label: "Medicina", field: "medicina" },
        { name: "insumos", label: "Insumos", field: "insumos" },
        { name: "total", label: "Total", field: "total" },
      ];
  
      const pagination = ref({
        page: 1,
        rowsPerPage: 5
      })
  
      const onRequest = (props) => {
        const { page, rowsPerPage } = props.pagination
        // ... aquí puedes implementar la lógica de paginación si es necesario
      }
  
      return { columns, pagination, onRequest };
    },
  });
  </script>