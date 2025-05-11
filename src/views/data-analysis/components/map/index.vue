<template>
    <div class="innerContainer" ref="map"></div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts'
import worldJSON from './world.json'
import asiaJSON from './asia.json'

const map = ref()

echarts.registerMap('asia', asiaJSON as any)
onMounted(() => {
    let myCharts = echarts.init(map.value)

    myCharts.setOption({
        geo: {
            map: 'asia',
            roam: true,
            zoom: 1.2,
            itemStyle: {
                borderColor: '#00FFFF',
                borderWidth: 0.8,
                areaColor: {
                    type: 'linear',
                    x: 0, y: 0, x2: 1, y2: 1,
                    colorStops: [
                        { offset: 0, color: '#005f73' },
                        { offset: 1, color: '#00b4d8' }
                    ],
                    global: false
                },
                shadowColor: 'rgba(0, 255, 255, 0.5)',
                shadowBlur: 15
            },
            emphasis: {
                itemStyle: {
                    areaColor: '#00FFFF',
                    shadowColor: '#00FFFF',
                    shadowBlur: 20
                },
                label: {
                    show: true,
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#FFFFFF',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    padding: [5, 7],
                    borderRadius: 4
                }
            },
            label: { show: false }
        },
        series: [
            {
                type: 'lines',
                coordinateSystem: 'geo',
                zlevel: 2,
                effect: {
                    show: true,
                    period: 3.5, // Speed of airplane
                    trailLength: 0.1,
                    symbol: 'path://M1705 1546q0 34-35 58-68 43-119 61.5t-164 45.5-251 28-250-27.5-164.5-46T477 1602q-35-24-35-58 0-12 2-21.5t4-15 9.5-12 9.5-8.5l4-3q5-4 13.5-9t16.5-9.5 21.5-9 20.5-7.5q74-26 134.5-42.5t150-33.5 178.5-24v-343q-143-5-244.5-21T705 847t-134-55.5T522 729q-5-3-9.5-8t-9.5-12-4-15-2-21q0-34 35-58 68-43 119-61.5t164-45.5 250.5-28T1429 553t164.5 46T1683 660q35 24 35 58 0 12-2 21t-4 15-9.5 12-9.5 9l-4 3q-5 4-13.5 9t-16.5 9.5-21.5 9-20.5 7.5q-74 26-134.5 42.5t-150 33.5-178.5 24v343q143 5 244.5 21t195 39 134 55.5T1635 1467q5 3 9.5 8t9.5 12 4 15 2 21z', // Airplane icon
                    symbolSize: 15, // Size of the airplane
                    color: 'white'
                },
                lineStyle: {
                    color: '#FF4500', // Orange route line
                    width: 2,
                    opacity: 0.6,
                    curveness: 0.3
                },
                data: [
                    { coords: [[139.6917, 35.6895], [116.4074, 39.9042]] }, // Tokyo → Beijing
                    { coords: [[116.4074, 39.9042], [101.6869, 3.1390]] }, // Beijing → Kuala Lumpur
                    { coords: [[101.6869, 3.1390], [100.5018, 13.7563]] }, // Kuala Lumpur → Bangkok
                    { coords: [[100.5018, 13.7563], [103.8198, 1.3521]] }, // Bangkok → Singapore
                    { coords: [[103.8198, 1.3521], [106.8650, -6.1751]] }, // Singapore → Jakarta
                    { coords: [[106.8650, -6.1751], [120.9842, 14.5995]] }, // Jakarta → Manila
                    { coords: [[120.9842, 14.5995], [127.7669, 35.9078]] }, // Manila → Seoul
                    { coords: [[127.7669, 35.9078], [126.9780, 37.5665]] }, // Seoul → Seoul (internal)
                    { coords: [[126.9780, 37.5665], [114.1694, 22.3193]] }, // Seoul → Hong Kong
                    { coords: [[114.1694, 22.3193], [121.4737, 31.2304]] }, // Hong Kong → Shanghai
                    { coords: [[121.4737, 31.2304], [113.2644, 23.1291]] }, // Shanghai → Guangzhou
                    { coords: [[113.2644, 23.1291], [78.9629, 20.5937]] }, // Guangzhou → India
                    { coords: [[78.9629, 20.5937], [77.1025, 28.7041]] }, // India → New Delhi
                    { coords: [[77.1025, 28.7041], [90.4125, 23.8103]] }, // New Delhi → Dhaka
                    { coords: [[90.4125, 23.8103], [88.3639, 22.5726]] }, // Dhaka → Kolkata
                    { coords: [[88.3639, 22.5726], [72.8777, 19.0760]] }, // Kolkata → Mumbai
                ]
            }
        ]
    });
})
</script>

<style scoped lang="scss">
.innerContainer {
    margin: 30px 10px 10px 20px;
}
</style>