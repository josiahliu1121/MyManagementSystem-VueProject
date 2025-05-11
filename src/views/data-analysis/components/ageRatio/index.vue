<template>
    <div class="innerContainer">
        <div class="title">Age Ratio</div>
        <div class="charts" ref="charts"></div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, type PropType } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
    ageRatio: {
        type: Array as PropType<number[]>,
        required: true
    }
});

const charts = ref()

onMounted(() => {
    let myCharts = echarts.init(charts.value)

    myCharts.setOption({
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            right: 'right',
            oriented: 'vertical',
            textStyle: {
                color: 'white',
                fontSize: '16px'
            }
        },
        series: [
            {
                name: 'Age From',
                type: 'pie',
                radius: ['60%', '95%'],
                avoidLabelOverlap: false,
                right: '20%',
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: true,
                    position: 'inside',
                    textStyle: {
                        color: 'white',
                        fontSize: '16px'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: props.ageRatio[0], name: 'Below 18' },
                    { value: props.ageRatio[1], name: '19-25' },
                    { value: props.ageRatio[2], name: '25-40' },
                    { value: props.ageRatio[3], name: '40-60' },
                    { value: props.ageRatio[4], name: 'Above 60' }
                ]
            }
        ],
        grid: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        }
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
        height: 200px;
        margin: 0 5px;
    }
}
</style>