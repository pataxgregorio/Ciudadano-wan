<template>
    <q-page>
        <div class="filtrado">
            <div class="fechas">
                <input type="date" v-model="fechaDesde">
                <input type="date" v-model="fechaHasta">
                <button @click="filtrar" class="btn">Filtrar</button>
            </div>
            <div class="Comunas">
                <p>comunas: </p>
                <select v-model="selectedComunaId">
                    <option v-for="comuna in comunas" :key="comuna.id" :value="comuna.id">
                        {{ comuna.codigo }}
                    </option>
                </select>
                <button @click="filtrar" class="btn">Filtrar</button>

            </div>
        </div>
        <div class="q-pa-md">
            <q-table flat bordered title="Tabla" dense :rows="solicitudesRows" :columns="columns" row-key="name" />
        </div>
        <div class="botones">
            <q-btn color="black" @click="filtrarPorEstado(1)">
                <li>Registradas</li>
            </q-btn>
            <q-btn color="black" @click="filtrarPorEstado(5)">
                <li>Finalizadas</li>
            </q-btn>
            <q-btn color="black" @click="filtrarPorEstado(2)">
                <li>En Análisis</li>
            </q-btn>
        </div>
        <q-btn class="imprimir" color="black" label="Imprimir" @click="imprimir"></q-btn>
    </q-page>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const getComunas = async () => {
    const response = await axios.get('http://192.168.0.120:7000/getComunas');
    return response.data;
};

export default {
    setup() {
        const comunas = ref([]);
        const solicitudesRows = ref([]);
        const selectedComunaId = ref(null);
        const fechaDesde = ref(null);
        const fechaHasta = ref(null);

        const columns = [
            { name: "solicitud_salud_id", label: "Nro Solicitud", field: "solicitud_salud_id" },
            { name: "nombre", label: "Nombre Solicitante", field: "nombre" },
            { name: "cedula", label: "Cédula", field: "cedula" },
            { name: "fechaNacimiento", label: "Edad", field: "fechaNacimiento" },
            { name: "direccion", label: "Dirección", field: "direccion" },
        ];

        async function filtrarPorEstado(status) {
            await filtrar({ status });
        }

        async function imprimir(params = {}) {
            try {
                const queryParams = {
                    fechaDesde: fechaDesde.value,
                    fechaHasta: fechaHasta.value,
                    status: params.status || null,
                    comuna_id: selectedComunaId.value,
                };

                const response = await axios.get('http://localhost:7000/solicitud/imprimirWAN', {
                    params: queryParams
                });

                // Abre la URL en una nueva ventana o pestaña (esto descargará el PDF)
                window.open(response, '_blank');
            } catch (error) {
                console.error("Error al imprimir:", error);
            }
        }

        async function filtrar(params = {}) {
            try {
                const queryParams = {
                    fechaDesde: fechaDesde.value,
                    fechaHasta: fechaHasta.value,
                    status: params.status || null,
                    comuna_id: selectedComunaId.value,
                };

                const response = await axios.get('http://localhost:7000/solicitud/getSolicitudesWAN', {
                    params: queryParams
                });

                solicitudesRows.value = response.data;
            } catch (error) {
                console.error("Error obteniendo datos:", error);
            }
        }

        onMounted(async () => {
            const response = await getComunas();
            comunas.value = [
                { id: null, codigo: 'Seleccionar Comuna' },
                ...response
            ]
            console.log(comunas.value);
        });

        const options = comunas;

        return {
            options,
            comunas,
            selectedComunaId,
            solicitudesRows,
            columns,
            filtrar,
            filtrarPorEstado,
            fechaDesde,
            fechaHasta,
            imprimir
        };
    }
};
</script>
<style>
@media screen and (max-width: 599px) {
    .botones li {
        width: 50px;
        height: 15px;
    }
}

.Comunas {
    flex-direction: column;
}

.filtrado {
    display: flex;
    align-items: center;
    justify-content: right;
    margin-top: 10px;
    gap: 10px;
}

.filtrado button {
    margin-right: 5px;
}

.botones {
    display: flex;
    list-style: none;
    gap: 50px;
    justify-content: center;
}

.botones li {
    width: 150px;
    height: 30px;
    text-align: center;
    font-size: 18px;
}

.imprimir {
    margin: 20px 0px 0px 20px;
}
</style>
