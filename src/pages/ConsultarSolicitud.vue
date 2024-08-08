<template>
    <div class="q-pa-md column items-center q-gutter-sm">
        <q-input v-model="search" filled type="search" label="Cédula o Número de Solicitud">
            <template v-slot:append>
                <q-icon name="search" />
            </template>
        </q-input>
        <!-- <q-btn push color="primary" label="Buscar" @click="fetchData" /> -->
    </div>

    <div v-for="solicitud in solicitudes" :key="solicitud.id">
        <q-card class="my-card">
            <q-card-section class="form section">
                <div class="seccion-1-ver">
                    <p><span class="negrita">Nro Solicitud: </span>{{ solicitud.id }}</p>
                    <li><span class="negrita">Solicitante:</span> {{ solicitud.solicitante }}</li>
                    <li><span class="negrita">Estatus:</span>
                        <span v-if="solicitud.nombrestatus === 'FINALIZADA'" class="text-green">{{
                            solicitud.nombrestatus
                        }} <q-icon name="fa-solid fa-check" /> </span>

                        <span v-else-if="solicitud.nombrestatus === 'EN ANALISIS'" class="text-yellow">{{
                            solicitud.nombrestatus
                            }} <q-icon name="fa-solid fa-magnifying-glass" /></span>

                        <span v-else-if="solicitud.nombrestatus === 'REGISTRADA'" class="text-yellow">{{
                            solicitud.nombrestatus
                            }}<q-icon name="fa-solid fa-paperclip" /></span>

                        <span v-else-if="solicitud.nombrestatus === 'RECHAZADA'" class="text-red">{{
                            solicitud.nombrestatus
                            }}<q-icon name="fa-solid fa-xmark" /></span>

                        <span v-else-if="solicitud.nombrestatus === 'ANULADA'" class="text-blue">{{
                            solicitud.nombrestatus
                            }}<q-icon name="fa-solid fa-xmark" /></span>

                        <span v-else>{{ solicitud.nombrestatus }}</span>
                    </li>

                    <li><span class="negrita">Fecha:</span> {{ formatDate(solicitud.fecha) }}</li>
                    <p>
                        <span v-if="solicitud.nombretipo === 'MEDICINA'"><span class="negrita">Tipo Solicitud:</span>{{
                            solicitud.nombretipo }} <q-icon name="fa-solid fa-pills" /></span>

                        <span v-else-if="solicitud.nombretipo === 'LABORATORIO'"><span class="negrita">Tipo
                                Solicitud:</span>{{
                                    solicitud.nombretipo }} <q-icon name="fa-solid fa-flask" /></span>
                        <span v-else-if="solicitud.nombretipo === 'ESTUDIO'"><span class="negrita">Tipo
                                Solicitud:</span>{{
                                    solicitud.nombretipo }} <q-icon name="fa-solid fa-clipboard" /></span>

                        <span v-else-if="solicitud.nombretipo === 'INSUMOS'"><span class="negrita">Tipo
                                Solicitud:</span>{{
                                    solicitud.nombretipo }} <q-icon name="fa-solid fa-stethoscope" /></span>

                        <span v-else-if="solicitud.nombretipo === 'CONSULTAS'"><span class="negrita">Tipo
                                Solicitud:</span>{{
                                    solicitud.nombretipo }} <q-icon name="fa-solid fa-hand-holding-heart" /></span>

                        <span v-else-if="solicitud.nombretipo === 'DONACIONES Y AYUDA ECONOMICA'"><span
                                class="negrita">Tipo
                                Solicitud:</span>{{
                                    solicitud.nombretipo }} <q-icon name="fa-solid fa-money-bill" /></span>

                        <span v-else-if="solicitud.nombretipo === 'AYUDAS TECNICAS'"><span class="negrita">Tipo
                                Solicitud:</span>{{
                                    solicitud.nombretipo }} <q-icon name="fa-solid fa-hand" /></span>

                        <span v-else-if="solicitud.nombretipo === 'CIRUGIAS'"><span class="negrita">Tipo
                                Solicitud:</span>{{
                                    solicitud.nombretipo }} <q-icon name="fa-solid fa-pen-fancy" /></span>

                        <span v-else-if="solicitud.nombretipo === 'OFTAMOLOGIA'"><span class="negrita">Tipo
                                Solicitud:</span>{{
                                    solicitud.nombretipo }} <q-icon name="fa-solid fa-glasses" /></span>

                        <span v-else-if="solicitud.nombretipo === 'VISITA SOCIAL'"><span class="negrita">Tipo
                                Solicitud:</span>{{
                                    solicitud.nombretipo }} <q-icon name="fa-solid fa-hands-holding-child" /></span>

                        <span v-else-if="solicitud.nombretipo === 'MATERIALES'"><span class="negrita">Tipo
                                Solicitud:</span>{{
                                    solicitud.nombretipo }} <q-icon name="fa-solid fa-boxes-stacked" /></span>

                        <span v-else-if="solicitud.nombretipo === 'JORNADAS'"><span class="negrita">Tipo
                                Solicitud:</span>{{
                                    solicitud.nombretipo }} <q-icon name="fa-solid fa-person-shelter" /></span>

                        <span v-else-if="solicitud.nombretipo === 'ALTO COSTO'"><span class="negrita">Tipo
                                Solicitud:</span>{{
                                    solicitud.nombretipo }} <q-icon name="fa-solid fa-money-check-dollar" /></span>

                        <span v-else-if="solicitud.nombretipo === 'HURNAS'"><span class="negrita">Tipo
                                Solicitud:</span>{{
                                    solicitud.nombretipo }} <q-icon name="fa-solid fa-rainbow" /></span>

                        <span v-else-if="solicitud.nombretipo === 'FOSAS'"><span class="negrita">Tipo
                                Solicitud:</span>{{
                                    solicitud.nombretipo }} <q-icon name="fa-solid fa-rainbow" /></span>

                        <span v-else-if="solicitud.nombretipo === 'APOYO LOGISTICO'"><span class="negrita">Tipo
                                Solicitud:</span>{{
                                    solicitud.nombretipo }} <q-icon name="fa-solid fa-truck" /></span>

                        <span v-else-if="solicitud.nombretipo === 'DOTACION'"><span class="negrita">Tipo
                                Solicitud:</span>{{
                                    solicitud.nombretipo }} <q-icon name="fa-solid fa-boxes-stacked" /></span>

                        <span v-else-if="solicitud.nombretipo === 'OTROS'"><span class="negrita">Tipo
                                Solicitud:</span>{{
                                    solicitud.nombretipo }} <q-icon name="fa-solid fa-question" /></span>

                        <span v-else class="negrita">Tipo Solicitud:{{ solicitud.nombretipo }}</span>

                    </p>
                    <div class="seccion-1-ver">
                        <div v-for="beneficiario in solicitud.beneficiarios" :key="beneficiario.cedula">
                            <li><span class="negrita">Beneficiario:</span> {{ beneficiario.nombre }}</li>
                            <li><span class="negrita">Cédula:</span> {{ beneficiario.cedula }}</li>
                            <li><span class="negrita">Solicita:</span> {{ beneficiario.solicita }}</li>
                        </div>
                    </div>
                </div>
                <div class="seccion-3-ver">
                    <li><span class="negrita">Comuna:</span> {{ solicitud.comuna }}</li>
                    <LI><span class="negrita">Comunidad:</span> {{ solicitud.comunidad }}</LI>
                    <q-btn push color="primary" label="Ver" @click="verSolicitud(solicitud.id)" />
                </div>
            </q-card-section>
        </q-card>
    </div>

    <div v-if="search !== '' && solicitudes.length === 0">
        <p style="text-align: center;">No se encontraron resultados para "{{ search }}".</p>
    </div>

    <div v-else-if="search === ''">
        <p style="text-align: center;">Ingrese un número de cédula o solicitud para buscar.</p>
    </div>
    <q-dialog v-model="mostrarDialogoSeguimiento">
        <q-card style="width: 80vw; max-width: 800px">
            <q-card-section>
                <div class="text-h6">
                    Seguimiento de la Solicitud {{ solicitudSeleccionada.NumeroSolicitud }}
                </div>
            </q-card-section>

            <q-separator />

            <q-card-section v-if="seguimientoSeleccionado.length > 0" class="seguimiento-section">
                <div v-for="item in seguimientoSeleccionado" :key="item.id" class="seguimiento-card">
                    <div class="section">
                        <div class="seccion-1"
                            style="background-color: black; color: white; width: 100%; text-align: center; height: 20px;">
                            <p class="section-title"><span class="negrita">#</span>{{
                                item.item
                                }}</p>
                        </div>
                    </div>
                    <div class="section">
                        <div class="seccion-1">
                            <p class="section-title"><span class="negrita">Fecha y Hora: </span>{{
                                formatDate(item.fecha) }}
                            </p>
                            <!-- <p>Estatus: {{ item.estatus }}</p> -->
                            <p class="section-title"><span class="negrita">Descripcion: </span> {{ item.asunto }}</p>
                        </div>
                        <div class="seccion-1">
                            <p class="section-title"><span class="negrita">Imagen: </span></p>
                            <a :href="baseUrl + '/' + item.imagen" target="_blank">
                                <q-img :src="baseUrl + '/' + item.imagen" style="height: 100px; max-width: 150px" />
                            </a>
                        </div>
                    </div>
                </div>
            </q-card-section>

            <q-card-section v-else>
                Aún no se ha realizado seguimiento a esta solicitud.
            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
                <q-btn push color="primary" label="Cerrar" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>
<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';
import { useQuasar } from 'quasar';

const baseUrl = 'http://156.235.91.67:8081';
const search = ref('');
const solicitudes = ref([]);
const denunciados = ref([]);
const mostrarDialogoSeguimiento = ref(false);
const mostrarDenunciaReclamo = ref(false);
const seguimientoSeleccionado = ref([]);
const solicitudSeleccionada = ref({});
const tipoSolicitud = ref(null);
const idSolicitud = ref(null);

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

        solicitudes.value = response.data.map(solicitud => ({
            ...solicitud,
            beneficiarios: JSON.parse(solicitud.beneficiario)
        }));
    } catch (error) {
        console.error("Error fetching data:", error);
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

            denunciados.value = denunciadosData.map(denunciado => ({
                ...denunciado,
                idsolicitud: id
            }));
        } else {
            const response = await axios.get(`http://156.235.91.67:8081/seguimiento/list2`, {
                params: { params: id }
            });
            mostrarDenunciaReclamo.value = false;
            solicitudSeleccionada.value = response.data[0] || {};
            seguimientoSeleccionado.value = JSON.parse(solicitudSeleccionada.value.Seguimiento || '[]');
            mostrarDialogoSeguimiento.value = true;
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

watch(fetchData, (newValue) => {
    if (newValue) {
        mostrarDenunciaReclamo.value = false;
    }
});

</script>

<style>
.section {
    display: flex;
    justify-content: space-between;
}

.negrita {
    font-weight: bold;
}

.my-card {
    max-width: 97%;
    margin: 0 auto 0 auto;
    margin-top: 20px;
}

.seccion-1-ver {
    display: flex;
    flex-direction: column;
}

.seccion-1-ver li {
    list-style: none;
}

.seccion-3-ver li {
    list-style: none;
}

.seccion-2-ver {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.seccion-3-ver p {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    max-width: 120px;
}



.background-image {
    background-image: url("/images/siamobile.jpg");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

@media (max-width: 768px) {
    .seccion-1-ver {
        max-width: 200px;
    }

    .seccion-3-ver {
        max-width: 120px;
    }
}

@media (min-width: 768px) {

    .background-image {
        background-image: url("/images/siadesktop.jpg");
        background-size: fill;
        background-position: top;
    }
}

.seguimiento-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.seguimiento-card {
    border: 1px solid #ccc;
    padding: 16px;
    border-radius: 4px;
}
</style>