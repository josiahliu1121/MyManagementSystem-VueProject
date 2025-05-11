<template>
    <div class="innerContainer">
        <div class="unit">Unit: people</div>
        <div class="title">Online Player</div>
        <div class="numberScreen">
            <span v-for="(item, index) in formattedOnlinePlayerCount" :key="index" class="number">{{ item }}</span>
        </div>
        <div id="liquidChart" style="width: 270px; height: 270px; margin: 0 auto;"></div>
    </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import * as echarts from "echarts";
import "echarts-liquidfill"; // Import the liquid fill plugin

// Define the prop to accept the value from the parent
const props = defineProps({
    onlinePlayerCount: {
        type: Number,
        required: true
    }
});

// Format the onlinePlayerCount for display
const formattedOnlinePlayerCount = computed(() => {
    return new Intl.NumberFormat().format(props.onlinePlayerCount);
});

// Calculate the percentage based on onlinePlayerCount
const percentage = computed(() => {
    return (props.onlinePlayerCount / 1000000);
});

// Initialize the chart ref and instance
const chart = ref<any>(null);

// Watch for changes in onlinePlayerCount and update the chart
watch(percentage, (newPercentage) => {
    if (chart.value) {
        const option = {
            series: [
                {
                    type: "liquidFill",
                    data: [newPercentage, (newPercentage / 2)], // Update with the new percentage
                    radius: "90%",
                    outline: { show: true }, // Show border
                    backgroundStyle: { color: "#eee" }, // Background color
                    label: {
                        show: true,
                        color: "#000",
                        insideColor: "#fff",
                        fontSize: 24,
                    },
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: "rgba(0, 0, 0, 0.4)",
                    },
                    waveAnimation: true, // Enable wave animation
                },
            ],
        };

        chart.value.setOption(option);
    }
});

// Initialize the chart on mount
onMounted(() => {
    chart.value = echarts.init(document.getElementById("liquidChart") as HTMLDivElement);
});
</script>

<style scoped lang="scss">
.innerContainer {
    background-color: rgba(0, 1, 74, 0.8);
    margin: 20px 10px 10px 20px;
    color: white;
    border: skyblue solid 1px;

    .title {
        font-size: 35px;
        margin: 10px;
        width: fit-content;
        border: skyblue solid 1px;
        padding: 5px;
        border-radius: 20px;
        background-color: rgb(0, 83, 179);
    }

    .unit {
        margin-top: 35px;
        margin-right: 10px;
        float: right;
        font-size: 20px;
    }

    .numberScreen {
        display: flex;
        margin: 10px;
        height: 50px;

        .number {
            flex: auto;
            font-size: 40px;
            line-height: 50px;
            background-color: aqua;
            text-align: center;
            margin: 0 3px;
            border: black 2px solid;
            color: black;
        }
    }
}
</style>