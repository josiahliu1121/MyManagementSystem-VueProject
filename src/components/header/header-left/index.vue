<template>
    <div class="container">
        <el-icon @click="changeIcon()">
            <component :is="asideSettingStore.fold ? 'Expand' : 'Fold'"></component>
        </el-icon>
        <el-breadcrumb separator-icon="ArrowRight">
            <el-breadcrumb-item v-for="(item, index) in $route.matched" :key="index" v-show="item.meta.title"
                :to="item.path">
                <el-icon>
                    <component :is="item.meta.icon"></component>
                </el-icon>
                <span>{{ item.meta.title }}</span>
            </el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script lang="ts" setup>
//aside expand and fold
import { useAsideSettingStore } from '@/stores/asideSetting';
const asideSettingStore = useAsideSettingStore()

const changeIcon = () => {
    asideSettingStore.changeFold()
}

//breadcrumb display
import { useRoute } from 'vue-router';
const $route = useRoute()
</script>

<style scoped lang="scss">
.container {
    margin: 0 5px;
    display: flex;
    align-items: center;

    .el-icon {
        margin-right: 5px;
    }
}
</style>