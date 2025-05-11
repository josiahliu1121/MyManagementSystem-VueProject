<template>
    <div class="container">
        <CategorySelector class="top" :scene="scene"></CategorySelector>
        <el-card class="card" :body-style="{ width: '100%' }">
            <!--div showing SPU-->
            <div v-show="scene === 0">
                <el-button type="primary" icon="Plus" :disabled="!categoryStore.category3Id" @click="addSPU()"
                    v-button="`btn.spu.add`">Add
                    SPU</el-button>
                <div class="table-container">
                    <el-table class="table" border :data="spuList">
                        <el-table-column type="index" label="No." align="center" width="80px" />
                        <el-table-column label="SPU Name" prop="spuName" />
                        <el-table-column label="SPU Description" prop="description" />
                        <el-table-column label="SPU Operation">
                            <template #="{ row }">
                                <el-button type="primary" icon="Plus" size="small" @click="addSKU(row)"
                                    v-button="`btn.sku.add`"></el-button>
                                <el-button type="primary" icon="Edit" size="small" @click="editSPU(row)"
                                    v-button="`btn.spu.edit`"></el-button>
                                <el-button type="primary" icon="View" size="small" @click="getSkuArr(row)"></el-button>
                                <el-popconfirm :title="`Are you sure to delete ${row.spuName}?`" width="220"
                                    icon="Delete" @confirm="deleteSpu(row)">
                                    <template #reference>
                                        <el-button type="primary" icon="Delete" size="small"
                                            v-button="`btn.spu.delete`"></el-button>
                                    </template>
                                </el-popconfirm>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                        :page-sizes="[5, 10, 20, 30]" :background="true"
                        layout="sizes, prev, pager, next, jumper,->, total" :total="total"
                        @size-change="handleSizeChange" @current-change="pageQuery()" />
                </div>
            </div>
            <spuForm v-show="scene === 1" ref="spuFormComponent" @changeScene="changeScene"></spuForm>
            <skuForm v-show="scene === 2" ref="skuFormComponent" @changeScene="changeScene"></skuForm>
        </el-card>

        <!--dialog to show sku data-->
        <el-dialog v-model="dialogVisible" title="SKU Data" width="800">
            <span v-show="skuArr.length === 0">No sku found</span>

            <el-table border :data="skuArr" v-show="skuArr.length > 0">
                <el-table-column label="SKU Name" prop="skuName" />
                <el-table-column label="Price" prop="price" />
                <el-table-column label="Weight" prop="weight" />
                <el-table-column label="SPU Operation">
                    <template #="{ row }">
                        <img :src="row.skuDefaultImg" style="height: 100px; width: 100px;">
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import CategorySelector from '@/components/categorySelector/index.vue'
import { useCategoryStore } from '@/stores/category';
import { ref, watch, onBeforeUnmount } from 'vue';
import { reqDeleteSpu, reqSPUList } from '@/api/goods/SPU';
import type { Records, SpuData } from '@/api/goods/SPU/type';
import { ElMessage } from 'element-plus';
import spuForm from './spuForm.vue';
import skuForm from './skuForm.vue';
import type { skuData } from '@/api/goods/SKU/type';
import { reqGetSku } from '@/api/goods/SKU';

const categoryStore = useCategoryStore()

const scene = ref<number>(0)

const currentPage = ref<number>(1)
const pageSize = ref<number>(5)
const total = ref<number>(0)
const spuList = ref<Records>([])

onBeforeUnmount(() => {
    categoryStore.reset()
})

watch(() => categoryStore.category3Id, (newValue) => {
    if (newValue !== undefined) {
        pageQuery()
    }
})

const pageQuery = async () => {
    const result = await reqSPUList(currentPage.value, pageSize.value, categoryStore.category3Id)

    if (result.code === 1) {
        spuList.value = result.data.records
        total.value = result.data.total
    } else {
        ElMessage.error(result.msg)
    }
}

const handleSizeChange = () => {
    currentPage.value = 1
    pageQuery()
}

//get scene from child component
const changeScene = (num: number) => {
    scene.value = num
    pageQuery()
}

//add spu button function
const addSPU = () => {
    scene.value = 1
}

const spuFormComponent = ref<any>()

//edit button in table function
const editSPU = (row: SpuData) => {
    scene.value = 1
    spuFormComponent.value.reqSpuData(row)
}

const skuFormComponent = ref<any>()

//add button in table function
const addSKU = (row: SpuData) => {
    scene.value = 2
    skuFormComponent.value.initialForm(row)
}

//function for delete button in table
const deleteSpu = async (row: SpuData) => {
    const result = await reqDeleteSpu((row.id as number))

    if (result.code === 1) {
        ElMessage.success('Spu deleted')
        pageQuery()
    } else {
        ElMessage.error(result.msg)
    }
}

//functions to get and show sku dialog
const skuArr = ref<skuData[]>([])
const dialogVisible = ref<boolean>(false)

//function for view button in table
const getSkuArr = async (row: SpuData) => {
    const result = await reqGetSku((row.id as number));

    if (result.code === 1) {
        skuArr.value = result.data;
        dialogVisible.value = true;
    } else {
        ElMessage.error('Fail to get sku data')
    }
}

onBeforeUnmount(() => {
    categoryStore.reset()
})
</script>

<style scoped lang="scss">
.container {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;

    .top {
        width: 100%;
        display: flex;
        height: min-content;
        margin-bottom: 10px;
    }

    .card {
        width: 100%;
        display: flex;

        .table-container {
            width: 100%;
            box-sizing: border-box;
            padding-bottom: 10px;
            margin-top: 10px;

            .table {
                margin-bottom: 10px;

                .tag {
                    margin: 5px;
                }
            }
        }
    }

    .form {
        width: 300px;
    }

    .table {
        margin: 10px 0;
    }
}
</style>