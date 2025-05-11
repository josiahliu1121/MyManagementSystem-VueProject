<template>
    <div class="topContainer">
        <div class="left">
            <span class="lbtn" @click="goHome()">Home</span>
        </div>
        <div class="center">Data Analysis Window</div>
        <div class="right">
            <span class="rbtn">Report</span>
            <span class="time">{{ time }}</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import moment from 'moment';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const time = ref(moment().format('YYYY-MM-DD hh:mm:ss'))
let timer = ref(0)

onMounted(() => {
    timer.value = setInterval(() => {
        //use moment to get time every 1s
        time.value = moment().format('YYYY-MM-DD hh:mm:ss')
    }, 1000)
})

onBeforeUnmount(() => {
    clearInterval(timer.value)
})

//function for home button
const goHome = () => {
    router.push({ name: 'home' });
}
</script>

<style scoped lang="scss">
.topContainer {
    display: flex;
    width: 100%;
    height: 40px;
    color: white;

    .left {
        flex: 2;
        height: 40px;
        border: 1px skyblue solid;
        border-radius: 20px;
        line-height: 40px;
        background-color: rgba(0, 0, 139, 0.5);

        .lbtn {
            float: right;
            border: 1px solid skyblue;
            width: 100px;
            border-radius: 20px;
            line-height: 30px;
            background-color: rgba(0, 127, 139, 0.5);
            text-align: center;
            margin: 5px;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            cursor: pointer;
        }

        .lbtn:hover {
            transform: translateY(-2px);
            /* Move up slightly */
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
            /* Add shadow */
        }
    }

    .center {
        flex: 3;
        height: 60px;
        border: 1px skyblue solid;
        border-radius: 30px;
        line-height: 60px;
        background-color: rgba(0, 0, 139, 0.5);
        text-align: center;
        font-size: 45px;
    }

    .right {
        flex: 2;
        height: 40px;
        border: 1px skyblue solid;
        border-radius: 20px;
        line-height: 40px;
        background-color: rgba(0, 0, 139, 0.5);

        .rbtn {
            float: left;
            border: 1px solid skyblue;
            width: 100px;
            border-radius: 20px;
            line-height: 30px;
            background-color: rgba(0, 127, 139, 0.5);
            text-align: center;
            margin: 5px;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            cursor: pointer;
        }

        .rbtn:hover {
            transform: translateY(-2px);
            /* Move up slightly */
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
            /* Add shadow */
        }

        .time {
            float: right;
            font-size: 20px;
            margin-right: 20px;
        }
    }
}
</style>