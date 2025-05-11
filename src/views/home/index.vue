<template>
    <div class="container">
        <div class="aside_container" :class="{ fold: asideSettingStore.fold ? true : false }">
            <Aside></Aside>
        </div>
        <div class="main_container" :class="{ fold: asideSettingStore.fold ? true : false }">
            <div class="header_container">
                <Header></Header>
            </div>
            <div class="content_container">
                <router-view v-if="flag"></router-view>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Aside from '@/components/aside/index.vue'
import Header from '@/components/header/index.vue'

//control the fold of aside navigator
import { useAsideSettingStore } from '@/stores/asideSetting';
const asideSettingStore = useAsideSettingStore()

//control the refresh of router-view
import { nextTick, watch, ref } from 'vue'
const flag = ref(true)
watch(() => asideSettingStore.refresh, () => {
    flag.value = false
    nextTick(() => {
        flag.value = true
    })
})

//request user info when this page is mounted
import { useUserStore } from '@/stores/user';
import { onMounted } from 'vue';
const userStore = useUserStore()
onMounted(() => {
    userStore.userInfo()
})
</script>

<style scoped lang="scss">
.container {
    display: flex;

    .aside_container {
        height: 100vh;
        width: $base-aside-width;
        transition: all 0.3s;

        &.fold {
            width: $fold-aside-width;
        }
    }

    .main_container {
        display: flex;
        flex-wrap: wrap;
        width: calc(100% - $base-aside-width);
        transition: all 0.3s;

        &.fold {
            width: calc(100% - $fold-aside-width);
        }

        .header_container {
            display: flex;
            height: $base-header-height;
            width: 100%;
            border-bottom: 1px solid;
            box-sizing: border-box;
        }

        .content_container {
            display: flex;
            width: 100%;
            height: calc(100vh - $base-header-height);
            padding: 20px;
            overflow-y: auto;
        }
    }
}
</style>