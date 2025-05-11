<template>
    <div class="innerContainer">
        <div class="title">Download Count</div>
        <div class="charts" ref="charts"></div>
    </div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts';
import { onMounted, ref, type PropType } from 'vue';

const props = defineProps({
    downloadCount: {
        type: Array as PropType<number[]>, // [count of 5-star, 4-star, 3-star, 2-star, 1-star]
        required: true
    }
})

const charts = ref()

onMounted(() => {
    let downloadChart = echarts.init(charts.value)

    const max = Math.max(...props.downloadCount)

    downloadChart.setOption({
        tooltip: {},
        radar: {
            center: ['50%', '50%'], // Adjust the X and Y position
            radius: '75%', // Adjust the radar chart size
            indicator: [
                { name: 'iOS', max: max },
                { name: 'Android', max: max },
                { name: 'PC', max: max },
                { name: 'Mac', max: max },
                { name: 'Xbox', max: max },
                { name: 'PS5', max: max }
            ],
            splitLine: { lineStyle: { color: '#444' } },
            axisLine: { lineStyle: { color: '#fff' } },
            name: { textStyle: { color: '#fff' } }
        },
        series: [
            {
                name: 'Download Count',
                type: 'radar',
                data: [
                    {
                        value: props.downloadCount,
                        name: 'Total',
                        areaStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: 'rgba(138, 43, 226, 0.6)' },
                                { offset: 1, color: 'rgba(138, 43, 226, 0.1)' }
                            ])
                        },
                        lineStyle: { color: '#8a2be2' }
                    }
                ]
            }
        ]
    })
})
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
        height: 240px;
    }
}
</style>