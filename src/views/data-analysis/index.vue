<template>
    <div class="screen">
        <div class="container" ref="container">
            <div class="top">
                <Top />
            </div>
            <div class="content">
                <div class="left">
                    <OnlinePlayer class="onlinePlayer" :online-player-count="onlinePlayerCount"></OnlinePlayer>
                    <SexRatio v-if="dataLoaded" :male-ratio="sexRatio" :female-ratio="100 - sexRatio" class="sexRatio">
                    </SexRatio>
                    <AgeRatio v-if="dataLoaded" :age-ratio="ageRatio" class="ageRatio"></AgeRatio>
                </div>
                <div class="center">
                    <Map class="map"></Map>
                    <PlayerPrediction :predicted-player-count="predictedPlayerCount" class="playerPrediction">
                    </PlayerPrediction>
                </div>
                <div class="right">
                    <Review :review-counts="reviewCounts" class="review"></Review>
                    <SaleCount v-if="dataLoaded" :sale-count1="saleCount1" :sale-count2="saleCount2" class="saleCount">
                    </SaleCount>
                    <Download v-if="dataLoaded" :download-count="downloadCount" class="download"></Download>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';
import Top from './components/top/index.vue'
import OnlinePlayer from './components/onlinePlayer/index.vue'
import SexRatio from './components/sexRatio/index.vue'
import AgeRatio from './components/ageRatio/index.vue'
import Map from './components/map/index.vue'
import PlayerPrediction from './components/playerPrediction/index.vue'
import Review from './components/review/index.vue'
import SaleCount from './components/saleCount/index.vue'
import Download from './components/download/index.vue'
import { useUserStore } from '@/stores/user';
import { reqInitialData } from '@/api/data';
import { ElMessage } from 'element-plus';

const container = ref()

onMounted(() => {
    container.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
})

//get scale for container
function getScale(w = 1920, h = 1080) {
    const ww = window.innerWidth / w;
    const wh = window.innerHeight / h;
    return ww < wh ? ww : wh;
}

window.onresize = () => {
    container.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
}

const userStore = useUserStore()
const socket = ref<WebSocket | null>(null);
const dataLoaded = ref(false); // Controls when to pass data
const onlinePlayerCount = ref<number>(0);
const sexRatio = ref<number>(50);
const ageRatio = ref<number[]>([]);
const predictedPlayerCount = ref<number[]>([])
const reviewCounts = ref<number[]>([])
const saleCount1 = ref<number[]>([])
const saleCount2 = ref<number[]>([])
const downloadCount = ref<number[]>([])

onMounted(async () => {
    //get initial data to display
    const result = await reqInitialData();

    if (result.code === 1) {
        sexRatio.value = result.data.sexRatio
        ageRatio.value = result.data.ageRatio
        predictedPlayerCount.value = result.data.predictedPlayerCount
        reviewCounts.value = result.data.reviewCount
        saleCount1.value = result.data.saleCount1
        saleCount2.value = result.data.saleCount2
        downloadCount.value = result.data.downloadCount
    } else {
        ElMessage.error('Fail to get data from server')
    }

    dataLoaded.value = true; // Only render the child when data is ready

    //build web socket connection with server
    const token = userStore.token

    socket.value = new WebSocket(`ws://localhost:8080/ws?token=${token}`); // Connect to WebSocket

    socket.value.onopen = () => {
        console.log("WebSocket connected");
    };

    socket.value.onmessage = (event) => {
        const data = JSON.parse(event.data);
        onlinePlayerCount.value = data.onlinePlayerCount;
    };

    socket.value.onerror = (error) => {
        console.error("WebSocket error: ", error);
    };

    socket.value.onclose = () => {
        console.log("WebSocket closed");
    };
});

onUnmounted(() => {
    if (socket.value) {
        socket.value.close();
    }
});
</script>

<style scoped lang="scss">
.screen {
    width: 100vw;
    height: 100vh;
    background-image: url('/src/assets/images/data_analysis_bg.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;

    .container {
        width: 1920px;
        height: 1080px;
        position: fixed;
        left: 50%;
        top: 50%;
        transform-origin: left top;

        .top {
            width: 100%;
            height: 40px;
        }

        .content {
            display: flex;

            .left {
                flex: 1;
                display: flex;
                flex-flow: column;
                height: 1040px;

                .onlinePlayer {
                    flex: 1.5;
                }

                .sexRatio {
                    flex: 1;
                }

                .ageRatio {
                    flex: 1;
                }
            }

            .center {
                flex: 2;
                display: flex;
                flex-flow: column;
                height: 1040px;

                .map {
                    flex: 3;
                }

                .playerPrediction {
                    flex: 1;
                }
            }

            .right {
                flex: 1;
                display: flex;
                flex-flow: column;
                height: 1040px;

                .review {
                    flex: 1;
                }

                .saleCount {
                    flex: 1;
                }

                .download {
                    flex: 1;
                }
            }
        }
    }
}
</style>