<template>
    <div class="aside">
        <logo></logo>
        <el-scrollbar class="scrollbar">
            <el-menu background-color="#001529" text-color="#fff" :default-active="$route.path" @select="handleSelect"
                :collapse="asideSettingStore.fold">
                <navigator :route-list="routeList"></navigator>
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script lang="ts" setup>
import logo from './logo/logo.vue';
import navigator from './navigator/navigator.vue';
import { useRouter, useRoute } from 'vue-router';
import { constantRoutes } from '@/router/routes';
import { useAsideSettingStore } from '@/stores/asideSetting';
import { useUserStore } from '@/stores/user';
import { computed } from 'vue';
const asideSettingStore = useAsideSettingStore()

const userStore = useUserStore()
const routeList = computed(() => [...constantRoutes, ...userStore.userRoute]);

const $router = useRouter()
const $route = useRoute()
const handleSelect = (key: string) => {
    $router.push(key)
}
</script>

<style lang="scss" scoped>
.aside {
    display: flex;
    flex-wrap: wrap;
    background-color: #001529;

    .scrollbar {
        height: calc(100vh - 20px - $logo-height);
        width: 100%;

        .el-menu {
            border-right: none;
        }
    }
}
</style>