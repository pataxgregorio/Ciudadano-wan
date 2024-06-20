<template>
    <q-card :class="$q.dark.isActive ? 'bg-dark' : ''">
        <q-card-section class="text-h6" style="text-align: center;">
            Análisis por Estatus
            <q-btn icon="fa fa-download" class="float-right" @click="saveImage" flat dense>
                <q-tooltip>Descargar Grafica PNG</q-tooltip>
            </q-btn>
        </q-card-section>
        <q-card-section>
            <div ref="gaugeContainer" :option="chartOption" autoresize style="height: 319px; width: 100%;"></div>
        </q-card-section>
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
            }
        };
    },
    watch: {
        chartData4: {
            handler(newChartData) {
                if (newChartData && newChartData.length > 0) {
                    const data = newChartData[0];

                    this.options.series = [
                        {
                            type: 'gauge',
                            radius: '97%', // Adjust radius as needed
                            startAngle: 90,
                            endAngle: -270,
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
                            data: [
                                {
                                    value: data.TOTAL_SOLICITUD,
                                    name: 'Totales',
                                    title: { offsetCenter: ['0%', '-70%'] },
                                    detail: { offsetCenter: ['0%', '-60%'] }
                                },
                                {
                                    value: data.TOTAL_REGISTRADAS,
                                    name: 'Registradas',
                                    title: { offsetCenter: ['-55%', '0%'] },
                                    detail: { offsetCenter: ['-55%', '10%'] }
                                },
                                {
                                    value: data.TOTAL_PROCESADAS,
                                    name: 'Procesadas',
                                    title: { offsetCenter: ['55%', '0%'] },
                                    detail: { offsetCenter: ['55%', '10%'] }
                                },
                                {
                                    value: data.TOTAL_FINALIZADAS,
                                    name: 'Finalizadas',
                                    title: { offsetCenter: ['0%', '40%'] },
                                    detail: { offsetCenter: ['0%', '50%'] }
                                }
                            ]
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
        saveImage() {
            const linkSource = this.chart.getDataURL();
            const downloadLink = document.createElement('a');
            document.body.appendChild(downloadLink);
            downloadLink.href = linkSource;
            downloadLink.target = '_self';
            downloadLink.download = 'GaugeChart.png';
            downloadLink.click();
            document.body.removeChild(downloadLink); // Clean up after download
        }
    }
};
</script>