<template>
    <div class="innerContainer">
        <div class="title">Sale Count</div>
        <div class="charts" ref="charts"></div>
    </div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts';
import { onMounted, ref, type PropType } from 'vue';

const props = defineProps({
    saleCount1: {
        type: Array as PropType<number[]>, // [count of 5-star, 4-star, 3-star, 2-star, 1-star]
        required: true
    },
    saleCount2: {
        type: Array as PropType<number[]>, // [count of 5-star, 4-star, 3-star, 2-star, 1-star]
        required: true
    }
})

const charts = ref()

onMounted(() => {
    let saleChart = echarts.init(charts.value)

    saleChart.setOption({
        title: {
            text: 'Monthly Sales Count (Last 2 Years)',
            textStyle: { color: '#fff' },
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'cross' }
        },
        legend: {
            data: ['Last Year', 'This Year'],
            textStyle: { color: '#fff' },
            top: 30
        },
        xAxis: {
            type: 'category',
            data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            axisLine: { lineStyle: { color: '#fff' } }
        },
        yAxis: {
            type: 'value',
            axisLine: { lineStyle: { color: '#fff' } },
            splitLine: { lineStyle: { color: '#444' } }
        },
        grid: { left: '5%', right: '5%', bottom: '0', top: '22%', containLabel: true },
        series: [
            {
                name: 'Last Year',
                type: 'line',
                smooth: true,
                data: props.saleCount1,
                lineStyle: { color: '#ff7f50' },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(255, 127, 80, 0.6)' },
                        { offset: 1, color: 'rgba(255, 127, 80, 0.1)' }
                    ])
                }
            },
            {
                name: 'This Year',
                type: 'line',
                smooth: true,
                data: props.saleCount2,
                lineStyle: { color: '#1e90ff' },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(30, 144, 255, 0.6)' },
                        { offset: 1, color: 'rgba(30, 144, 255, 0.1)' }
                    ])
                }
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