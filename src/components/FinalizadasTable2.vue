<template>
    <div class="q-pa-md">
      <q-table :title=titulo :rows="rows" :columns="columns" row-key="name">
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="nombre" :props="props">
              {{ props.row.nombre }}
            </q-td>
            <q-td key="cantidad_entrada" :props="props">
              {{ props.row.cantidad_entrada }}
            </q-td>
            <q-td key="fecha" :props="props">
              {{ props.row.fecha }}
            </q-td>
            <q-td key="tipoentrada" :props="props">
              {{ props.row.tipoentrada }}
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
  import { defineComponent } from "vue";
  
  export default defineComponent({
    name: "FinalizadasTable2",
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
        { name: "nombre", label: "Nombre", field: "nombre" },
        { name: "cantidad_entrada", label: "Cantidad Entrada", field: "cantidad_entrada" },
        { name: "fecha", label: "Fecha", field: "fecha" },
        { name: "tipoentrada", label: "Tipo de Entrada", field: "tipoentrada" },
      ];
      return { columns };
    },
  });
  </script>