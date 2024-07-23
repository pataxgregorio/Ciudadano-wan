<template>
    <div class="q-pa-md">
        <q-table title="Solicitudes Finalizadas" :rows="rows" :columns="columns" row-key="name">
            <template v-slot:body="props">
                <q-tr :props="props">
                    <q-td key="name" :props="props">
                        {{ props.row.name }}
                    </q-td>
                    <q-td key="value" :props="props">
                        {{ props.row.value }}
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
    name: "FinalizadasTable",
    props: {
        rows: {
            type: Array,
            required: true,
        },
    },

    setup() {
        const columns = [
            { name: "name", label: "Tipo de Solicitud", field: "name" },
            { name: "value", label: "N° Solicitudes Resueltas", field: "value" },
        ];

        return { columns };
    },
});
</script>