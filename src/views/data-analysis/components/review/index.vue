<template>
    <div class="innerContainer">
        <div class="title">Review</div>
        <div class="charts" ref="chartRef"></div>
    </div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts';
import { onMounted, ref, watch, type PropType } from 'vue';

const props = defineProps({
    reviewCounts: {
        type: Array as PropType<number[]>, // [count of 5-star, 4-star, 3-star, 2-star, 1-star]
        required: true
    }
});

const chartRef = ref();
let myChart: echarts.ECharts | null = null;

onMounted(() => {
    if (!chartRef.value) return;
    myChart = echarts.init(chartRef.value);
    updateChart();
});

// Watch for changes in reviewCounts and update chart
watch(() => props.reviewCounts, updateChart, { deep: true });

function updateChart() {
    if (!myChart) return;

    myChart.setOption({
        grid: { left: '5%', right: '10%', bottom: '0', top: '2%', containLabel: true },
        xAxis: {
            type: 'value',
            show: false
        },
        yAxis: {
            type: 'category',
            data: ['1 ★', '2 ★', '3 ★', '4 ★', '5 ★'], // Unicode star icon (★)
            axisLabel: {
                color: '#fff',
                fontSize: 16,
                fontWeight: 'bold',
                rich: {
                    star: {
                        fontSize: 18, // Larger star icon
                        color: 'gold' // Golden star
                    }
                },
                formatter: function (value: any) {
                    return `{star|★} ${value.replace('★', '')}`;
                }
            },
            axisLine: { show: false },
            axisTick: { show: false }
        },
        series: [
            {
                name: 'Reviews',
                type: 'bar',
                data: props.reviewCounts, // Use prop data dynamically
                label: {
                    show: true,
                    position: 'right', // Inside the bar
                    color: '#fff', // White text
                    fontSize: 14, // Bigger text
                    fontWeight: 'bold', // Bold text
                    backgroundColor: 'rgba(0,0,0,0.2)', // Semi-transparent black background
                    padding: [4, 8], // Padding around text
                    borderRadius: 5, // Rounded corners
                    textShadowBlur: 4, // Text shadow
                    textShadowColor: 'rgba(0, 0, 0, 0.8)' // Shadow color
                },
                itemStyle: {
                    color: (params: any) => {
                        const colors = ['#8B0000', '#FF4500', '#00BFFF', '#FFA500', '#FFD700']; // Colors for each rating
                        return colors[params.dataIndex];
                    },
                    borderRadius: 20,
                    shadowBlur: 10, // Bar shadow
                    shadowColor: 'rgba(0, 0, 0, 0.3)' // Shadow color
                }
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
        height: 240px;
    }
}
</style>