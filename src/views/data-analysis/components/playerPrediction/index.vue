<template>
    <div class="innerContainer">
        <div class="title">Active Player (1 week)</div>
        <div class="charts" ref="charts"></div>
    </div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts';
import { onMounted, ref, watch, type PropType } from 'vue';

const props = defineProps({
    predictedPlayerCount: {
        type: Array as PropType<number[]>,
        required: true
    }
});

const charts = ref();
let myChart: echarts.ECharts | null = null;

onMounted(() => {
    if (!charts.value) return;
    myChart = echarts.init(charts.value);
    updateChart();
});

// Watch for changes in props.predictedPlayerCount
watch(() => props.predictedPlayerCount, updateChart, { deep: true });

function updateChart() {
    if (!myChart) return;

    myChart.setOption({
        grid: {
            left: '2%',
            right: '2%',
            bottom: 0,
            top: '5%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisLabel: { color: '#ffffff' }
        },
        yAxis: {
            type: 'value',
            axisLabel: { color: '#ffffff' }
        },
        series: [
            {
                name: 'player prediction',
                type: 'line',
                stack: 'Total',
                smooth: true,
                lineStyle: { width: 0 },
                showSymbol: false,
                label: { show: true, position: 'top' },
                areaStyle: {
                    opacity: 0.8,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgb(128, 255, 165)' },
                        { offset: 1, color: 'rgb(1, 191, 236)' }
                    ])
                },
                data: props.predictedPlayerCount
            }
        ]
    });
}
</script>

<style scoped lang="scss">
.innerContainer {
    background-color: rgba(0, 1, 74, 0.8);
    margin: 10px 10px 20px 20px;
    border: skyblue solid 1px;
    color: white;

    .title {
        font-size: 35px;
        margin: 10px;
        width: fit-content;
        border: skyblue solid 1px;
        padding: 5px;
        border-radius: 20px;
        background-color: rgb(0, 83, 179);
    }

    .charts {
        height: 170px;
    }
}
</style>