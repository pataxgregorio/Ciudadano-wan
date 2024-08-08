<template>
    <q-layout view="lHh Lpr lFf">
        <div class="q-pa-md column items-center q-gutter-sm">
            <q-input v-model="search" filled type="search" label="Cédula o Número de Solicitud">
                <template v-slot:append>
                    <q-icon name="search" />
                </template>
            </q-input>
            <q-btn push color="primary" label="Buscar" @click="fetchData" />
        </div>

        <div class="q-pa-md column items-center">
            <q-table v-if="solicitudes.length > 0" flat bordered :rows="solicitudes" :columns="mobileColumns"
                row-key="id" :pagination="{ rowsPerPage: 0 }" class="responsive-table" style="text-align: center;">
                <template v-slot:body-cell-acciones="props">
                    <q-td :props="props" class="text-center">
                        <q-btn size="sm" color="primary" label="Ver" @click="verSolicitud(props.row.id)" />
                    </q-td>
                </template>
            </q-table>

            <div v-else-if="search !== ''">
                No se encontraron resultados para "{{ search }}".
            </div>

            <div v-else>
                Ingresa un número de cédula o solicitud para buscar.
            </div>

        </div>

        <div class="q-pa-md column items-center">
            <q-table v-if="mostrarDenunciaReclamo" flat bordered :rows="denunciados" :columns="columnsDenunciado"
                row-key="id" :pagination="{ rowsPerPage: 0 }" class="responsive-table" style="text-align: center;">
                <template v-slot:body-cell-acciones="props">
                    <q-td :props="props" class="text-center">
                        <q-btn size="sm" color="primary" label="Ver Seguimiento"
                            @click="verSeguimiento(props.row.idsolicitud)" />
                    </q-td>
                </template>
            </q-table>
        </div>

        <q-dialog v-model="mostrarDialogoSeguimiento">
            <q-card style="width: 80vw; max-width: 800px">
                <q-card-section>
                    <div class="text-h6">Seguimiento de la Solicitud {{ solicitudSeleccionada.NumeroSolicitud }}</div>
                </q-card-section>

                <q-separator />

                <q-card-section v-if="seguimientoSeleccionado.length > 0">
                    <q-table flat bordered :rows="seguimientoSeleccionado" :columns="columnsSeguimiento">
                        <template v-slot:body-cell-imagen="props">
                            <q-td :props="props">
                                <a :href="'156.235.91.67:8081' + props.row.imagen" target="_blank">
                                    <q-img :src="'156.235.91.67:8081' + props.row.imagen"
                                        style="height: 100px; max-width: 150px" />
                                </a>
                            </q-td>
                        </template>
                    </q-table>
                </q-card-section>

                <q-card-section v-else>
                    Aún no se ha realizado seguimiento a esta solicitud.
                </q-card-section>

                <q-separator />

                <q-card-actions align="right">
                    <q-btn flat label="Cerrar" color="primary" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-layout>
</template>

<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const search = ref('');
const solicitudes = ref([]);
const denunciados = ref([]);
const mostrarDialogoSeguimiento = ref(false);
const mostrarDenunciaReclamo = ref(false);
const seguimientoSeleccionado = ref([]);
const solicitudSeleccionada = ref({});
const tipoSolicitud = ref(null);
const idSolicitud = ref(null);

// Definición de columns ANTES de mobileColumns
const columns = [
    { name: 'id', label: 'Numero de Solicitud', field: 'id', sortable: true },
    { name: 'solicitante', label: 'Solicitante', field: 'solicitante', sortable: true },
    { name: 'nombretipo', label: 'Tipo de Solicitud', field: 'nombretipo' },
    { name: 'Analista', label: 'Analista', field: 'analista' },
    { name: 'comuna', label: 'Comuna', field: 'comuna' },
    { name: 'nombrestatus', label: 'Estatus', field: 'nombrestatus' },
    { name: 'acciones', label: 'Acciones' } // Nueva columna para el botón "Ver"
];

const columnsDenunciado = [
    { name: 'cedula', label: 'Cedula', field: 'cedula', sortable: true },
    { name: 'nombre', label: 'Nombre', field: 'nombre', sortable: true },
    { name: 'testigo', label: 'Testigo', field: 'testigo' },
    { name: 'acciones', label: 'Acciones' } // Nueva columna para el botón "Ver"

];

const mobileColumns = $q.screen.lt.sm ? [
    // Columnas para pantallas pequeñas
    { name: 'id', label: 'Nro Solicitud', field: 'id', sortable: true },
    { name: 'solicitante', label: 'Solicitante', field: 'solicitante', sortable: true },
    { name: 'Analista', label: 'Analista', field: 'analista' },
    { name: 'comuna', label: 'Comuna', field: 'comuna' },
    { name: 'nombrestatus', label: 'Estatus', field: 'nombrestatus' },
    { name: 'acciones', label: '' }, // Columna solo para el botón
] : columns; // Usa las columnas originales para pantallas más grandes

const columnsSeguimiento = [
    { name: 'item', label: 'Item', field: 'item' },
    { name: 'fecha', label: 'Fecha y Hora', field: row => formatDate(row.fecha) },
    { name: 'asunto', label: 'Analisis', field: 'asunto' },
    {
        name: 'imagen',
        label: 'Evidencia',
        field: (row) => `${row.imagen}`, // Campo para la URL completa
    }, // Columna para la imagen
];

const formatDate = (fechaISO) => {
    const fecha = new Date(fechaISO);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const año = fecha.getFullYear();
    const hora = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');

    return `${dia}-${mes}-${año} ${hora}:${minutos}`;
};

const fetchData = async () => {
    try {
        const response = await axios.get('http://156.235.91.67:8081/solicitud/list2', {
            params: { params: search.value }
        });
        // Ensure fetchData is called before accessing tipoSolicitud.value

        solicitudes.value = response.data;
        if (solicitudes.value.length > 0) { // Check if solicitudes is not empty
            tipoSolicitud.value = solicitudes.value; // Assign the first solicitud
        } else {
            tipoSolicitud.value = null; // Handle the case where no solicitudes are found
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        // Manejo de errores (mostrar notificación al usuario, etc.)
    }
};

const verSolicitud = async (id) => {
    try {
        idSolicitud.value = id;
        await fetchData();
        const arraySolicitud = tipoSolicitud.value = solicitudes.value.find(solicitud => solicitud.id === id);
        tipoSolicitud.value.nombretipo = arraySolicitud.nombretipo;
        if (
            tipoSolicitud.value.nombretipo === 'DENUNCIA' ||
            tipoSolicitud.value.nombretipo === 'RECLAMO' ||
            tipoSolicitud.value.nombretipo === 'QUEJAS'
        ) {
            mostrarDenunciaReclamo.value = true;
            const response = await axios.get(
                `http://156.235.91.67:8081/solicitud/list3`,
                {
                    params: { params: id },
                }
            );
            const denunciadosData = JSON.parse(response.data[0].denunciado);

            // Add idsolicitud to each denunciado object
            denunciados.value = denunciadosData.map(denunciado => ({
                ...denunciado,
                idsolicitud: id // Add the id as idsolicitud
            }));
        } else {
            const response = await axios.get(`seguimiento/list2`, {
                params: { params: id }
            });
            mostrarDenunciaReclamo.value = false;
            solicitudSeleccionada.value = response.data[0] || {};
            seguimientoSeleccionado.value = JSON.parse(solicitudSeleccionada.value.Seguimiento || '[]');
            mostrarDialogoSeguimiento.value = true;

        }
    } catch (error) {
        console.error("Error fetching data:", error);
        // Manejo de errores (mostrar notificación al usuario, etc.)
    }
};

const verSeguimiento = async (id) => {
    try {
        await fetchData(); // Ensure fetchData is called before accessing tipoSolicitud.value
        const response = await axios.get(`seguimiento/list2`, {
            params: { params: id }
        });
        solicitudSeleccionada.value = response.data[0] || {};
        seguimientoSeleccionado.value = JSON.parse(solicitudSeleccionada.value.Seguimiento || '[]');
        mostrarDialogoSeguimiento.value = true;
    } catch (error) {
        console.error("Error fetching data:", error);
        // Manejo de errores (mostrar notificación al usuario, etc.)
    }
};

watch(fetchData, (newValue) => {
    // Este watch se ejecutará cada vez que se llame a fetchData
    if (newValue) {
        // Si fetchData devuelve true (o cualquier valor truthy), ocultamos la tabla
        mostrarDenunciaReclamo.value = false;
    }
});

</script>

<style>
template {
    background-image: "/images/main.png";
}

.responsive-table {
    /* Ajustes generales */
    width: 100%;
    background-color: rgba(255, 255, 255, 0.3);
    /* Fondo blanco con 80% de opacidad */

    /* Estilos para móviles */
    @media (max-width: 370px) {
        font-size: 14px;

        th,
        td {
            padding: 8px;
        }

        .q-table__card {
            box-shadow: none;
        }
    }
}
</style>