<template>
    <el-card :body-style="{ width: '100%' }">
        <el-form inline>
            <el-form-item label="First category" class="item">
                <el-select placeholder="category1" v-model="categoryStore.category1Id" @change="c1Change()"
                    :disabled="scene === 1">
                    <el-option v-for="(c1, index) in categoryStore.category1Arr" :key="c1.id" :label="c1.name"
                        :value="c1.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="Second category" class="item">
                <el-select placeholder="category2" v-model="categoryStore.category2Id" @change="c2Change()"
                    :disabled="scene === 1">
                    <el-option v-for="(c2, index) in categoryStore.category2Arr" :key="c2.id" :label="c2.name"
                        :value="c2.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="Third category" class="item">
                <el-select placeholder="category3" v-model="categoryStore.category3Id" :disabled="scene === 1">
                    <el-option v-for="(c3, index) in categoryStore.category3Arr" :key="c3.id" :label="c3.name"
                        :value="c3.id" />
                </el-select>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script lang="ts" setup>
import { onMounted, defineProps } from 'vue';
import { useCategoryStore } from '@/stores/category';
import { ElMessage } from 'element-plus';

//disable select when scene === 1
defineProps(['scene']);

const categoryStore = useCategoryStore()

onMounted(() => {
    try {
        categoryStore.getCategory1()
    } catch (error) {
        ElMessage.error((error as Error).message)
    }
})

const c1Change = () => {
    categoryStore.getCategory2()
    categoryStore.category2Id = undefined
    categoryStore.category3Id = undefined
}

const c2Change = () => {
    categoryStore.getCategory3()
    categoryStore.category3Id = undefined
}
</script>

<style scoped lang="scss">
.item {
    width: 200px;
}
</style>