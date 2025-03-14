<template>
    <q-card :class="$q.dark.isActive ? 'bg-dark' : ''">
        <q-card-section class="text-h6" style="text-align: center;">
            Indicadores Gestión de Casos Atendidos en Valor Porcentual (%)
        </q-card-section>
        <q-card-section>
            <div ref="gaugeContainer" :option="chartOption" autoresize style="height: 319px; width: 100%;">
            </div>
        </q-card-section>
        <div class="indicadores">
            <p><span class="Cuadrado" style="color: #5B7AD8;"><q-icon name="fa-solid fa-square" /></span>Totales:
                {{ totalSolicitudes }}</p>
            <p><span class="Cuadrado" style="color: #9FE080;"><q-icon name="fa-solid fa-square" /></span>En Analisis:
                {{ totalProcesadas }}</p>
            <p><span class="Cuadrado" style="color: #FEDB5F;"><q-icon name="fa-solid fa-square" /></span>Rechazadas:
                {{ totalRechazadas }}</p>
            <p><span class="Cuadrado" style="color: #FD6F6F;"><q-icon name="fa-solid fa-square" /></span>Finalizadas:
                {{ totalFinalizadas }}</p>
        </div>
    </q-card>
</template>

<script>
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { GaugeChart } from 'echarts/charts';
import { useQuasar } from 'quasar';

echarts.use([GaugeChart, CanvasRenderer]);
export default {
    name: "GaugeChart",
    props: {
        chartData4: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            chart: null,
            $q: useQuasar(),
            options: {
                series: []
            },
            totalSolicitudes: null
        }
    },
    computed: {
        chartOption() {
            return this.options
        },
    },
    watch: {
        chartData4: {
            handler(newChartData) {
                if (newChartData && newChartData.length > 0) {
                    const data = newChartData[0];
                    const maxVal = data.TOTAL_SOLICITUD;
                    this.totalSolicitudes = data.TOTAL_SOLICITUD;
                    this.totalProcesadas = data.TOTAL_PROCESADAS;
                    this.totalRechazadas = data.TOTAL_RECHAZADAS;
                    this.totalFinalizadas = data.TOTAL_FINALIZADAS;

                    this.options.series = [
                        {
                            type: 'gauge',
                            radius: '97%',
                            startAngle: 90,
                            endAngle: -360,
                            pointer: {
                                show: false
                            },
                            progress: {
                                show: true,
                                overlap: false,
                                roundCap: true,
                                clip: false,
                                itemStyle: {
                                    borderWidth: 1,
                                    borderColor: '#464646'
                                }
                            },
                            axisLine: {
                                lineStyle: {
                                    width: 30
                                }
                            },
                            splitLine: {
                                show: false,
                                distance: 0,
                                length: 10
                            },
                            axisTick: {
                                show: false
                            },
                            axisLabel: {
                                show: false
                            },
                            title: {
                                fontSize: 14
                            },
                            detail: {
                                width: 50,
                                height: 14,
                                fontSize: 14,
                                color: 'inherit',
                                formatter: '{value}',
                                offsetCenter: ['0%', '-20%']
                            },
                            data: [{
                                value: Math.round((data.TOTAL_SOLICITUD / data.TOTAL_SOLICITUD)* 100),
                                name: 'Solicitudes Totales',
                                title: { offsetCenter: ['0%', '-67%'] },
                                detail: { valueAnimation: true, offsetCenter: ['0%', '-57%'] }
                            }, {
                                value: Math.round((data.TOTAL_PROCESADAS / data.TOTAL_SOLICITUD)* 100), // Normalizar al valor máximo
                                name: 'En Análisis',
                                title: { offsetCenter: ['-55%', '0%'] },
                                detail: { valueAnimation: true, offsetCenter: ['-55%', '10%'] }
                            },
                            {
                                value: Math.round((data.TOTAL_RECHAZADAS / data.TOTAL_SOLICITUD)* 100), // Normalizar al valor máximo
                                name: 'Rechazadas',
                                title: { offsetCenter: ['55%', '0%'] },
                                detail: { valueAnimation: true, offsetCenter: ['55%', '10%'] }
                            },
                            {
                                value: Math.round((data.TOTAL_FINALIZADAS / data.TOTAL_SOLICITUD)* 100), // Normalizar al valor máximo
                                name: 'Finalizadas',
                                title: { offsetCenter: ['0%', '40%'] },
                                detail: { valueAnimation: true, offsetCenter: ['0%', '50%'] }
                            }]
                        }
                    ];
                } else {
                    this.options.series = [];
                }

                if (this.chart) {
                    this.chart.setOption(this.options);
                }
            },
            deep: true,
            immediate: true
        }
    },

    mounted() {
        this.initChart();
    },
    methods: {
        initChart() {
            this.chart = echarts.init(this.$refs.gaugeContainer);
            this.chart.setOption(this.options);
        },
    }
};
</script>

<style>
.indicadores {
    display: flex;
    justify-content: center;
    gap: 40px;
    width: 100%;
}

.Cuadrado {
    height: 50px;
    width: 50px;
}
</style>