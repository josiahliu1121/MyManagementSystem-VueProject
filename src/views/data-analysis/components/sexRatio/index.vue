<template>
    <div class="innerContainer">
        <div class="title">Sex Ratio</div>
        <div class="iconContainer">
            <SvgIcon class="icon" name="male" color="skyblue" width="100px" height="100px"></SvgIcon>
            <SvgIcon class="icon" name="female" color="pink" width="100px" height="100px"></SvgIcon>
        </div>
        <div class="chart" ref="chart"></div>
        <div class="label">
            <span>male: {{ maleRatio }}%</span>
            <span>female:{{ femaleRatio }} %</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import SvgIcon from '@/components/SvgIcons/index.vue'
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts'

const props = defineProps({
    maleRatio: {
        type: Number,
        required: true
    },
    femaleRatio: {
        type: Number,
        required: true
    }
})

const chart = ref()

onMounted(() => {
    let myCharts = echarts.init(chart.value);

    myCharts.setOption({
        xAxis: {
            show: false,
            min: 0,
            max: 100
        },
        yAxis: {
            type: 'category',
            show: false
        },
        series: [
            {
                type: 'bar',
                data: [100],
                barWidth: 20,
                itemStyle: {
                    color: 'pink',
                    borderRadius: 20
                }
            },
            {
                type: 'bar',
                data: [props.maleRatio],
                barWidth: 20,
                barGap: '-100%',
                z: 100,
                itemStyle: {
                    color: 'skyblue',
                    borderRadius: 20
                }
            },
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
    margin: 10px 10px 10px 20px;
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

    .iconContainer {
        margin: 5px;
        display: flex;
        justify-content: center;

        .icon {
            margin: 0 20px;
        }
    }

    .chart {
        height: 5cqb;
        margin-top: 20px;
        margin-left: 30px;
        margin-right: 30px;
    }

    .label {
        display: flex;
        justify-content: space-between;
        margin: 0 40px;
        font-size: 18px;
    }
}
</style>