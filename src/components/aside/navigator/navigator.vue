<template>
    <template v-for="(item, index) in routeList" :key="item.path">
        <!--No children-->
        <el-menu-item :index="item.path" v-if="item.meta.hidden === false && !item.children">
            <el-icon>
                <component :is="item.meta.icon"></component>
            </el-icon>
            <span>{{ item.meta.title }}</span>
        </el-menu-item>
        <!--1 children-->
        <template v-if="item.meta.hidden === false && item.children?.length === 1">
            <el-menu-item :index="item.children[0].path" v-if="item.children[0].meta.hidden === false">
                <el-icon>
                    <component :is="item.children[0].meta.icon"></component>
                </el-icon>
                <span>{{ item.children[0].meta.title }}</span>
            </el-menu-item>
        </template>
        <!--multiple children-->
        <el-sub-menu :index="item.path" v-if="item.meta.hidden === false && (item.children?.length ?? 0) > 1">
            <template #title>
                <el-icon>
                    <component :is="item.meta.icon"></component>
                </el-icon>
                <span>{{ item.meta.title }}</span>
            </template>
            <navigator :routeList="item.children"></navigator>
        </el-sub-menu>
    </template>
</template>

<script lang="ts" setup>
defineProps<{ routeList: Array<any> }>()
</script>