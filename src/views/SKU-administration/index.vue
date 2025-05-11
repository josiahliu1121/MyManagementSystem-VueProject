<template>
    <div class="container">
        <el-card class="card" :body-style="{ width: '100%' }">
            <div class="table-container" v-show="scene === 0">
                <el-table class="table" border :data="skuList">
                    <el-table-column type="index" label="No." align="center" width="80px" />
                    <el-table-column label="SKU Name" width="200PX" show-overflow-tooltip prop="skuName" />
                    <el-table-column label="Description" min-width="200PX" show-overflow-tooltip prop="description" />
                    <el-table-column label="Image" width="200PX">
                        <template #="{ row }">
                            <img :src="row.skuDefaultImg" style="height: 100px; width: 100px;">
                        </template>
                    </el-table-column>
                    <el-table-column label="Price" width="200PX" prop="price" />
                    <el-table-column label="Weight" width="200PX" prop="weight" />
                    <el-table-column label="Operation" width="250px" fixed="right">
                        <template #="{ row }">
                            <el-button type="primary" :icon="row.isAvailable === 0 ? 'Top' : 'Bottom'" size="small"
                                @click="changeIsAvailable(row)" v-button="`btn.sku.change`"></el-button>
                            <el-button type="primary" icon="Edit" size="small" @click="updateSku(row)"
                                v-button="`btn.sku.edit`"></el-button>
                            <el-button type="primary" icon="InfoFilled" size="small"
                                @click="openDrawer(row)"></el-button>
                            <el-popconfirm :title="`Are you sure to delete ${row.spuName}?`" width="220" icon="Delete"
                                @confirm="deleteSku(row)">
                                <template #reference>
                                    <el-button type="primary" icon="Delete" size="small"
                                        v-button="`btn.sku.delete`"></el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                    :page-sizes="[5, 10, 20, 30]" :background="true" layout="sizes, prev, pager, next, jumper,->, total"
                    :total="total" @size-change="handleSizeChange" @current-change="pageQuery()" />
            </div>

            <skuForm v-show="scene === 1" ref="skuFormComponent" @changeScene="changeScene"></skuForm>
        </el-card>
    </div>

    <!--Drawer to show sku detail-->
    <el-drawer v-model="drawer">
        <template #header>
            <h4>SKU Detail</h4>
        </template>
        <template #default>
            <el-row :gutter="5" class="row">
                <el-col :span="6">
                    <span>Sku Name</span>
                </el-col>
                <el-col :span="18">
                    <span>{{ selectedSku?.skuName }}</span>
                </el-col>
            </el-row>
            <el-row :gutter="5" class="row">
                <el-col :span="6">
                    <span>Description</span>
                </el-col>
                <el-col :span="18">
                    <span>{{ selectedSku?.description }}</span>
                </el-col>
            </el-row>
            <el-row :gutter="5" class="row">
                <el-col :span="6">
                    <span>Price</span>
                </el-col>
                <el-col :span="18">
                    <span>${{ selectedSku?.price }}</span>
                </el-col>
            </el-row>
            <el-row :gutter="5" class="row">
                <el-col :span="6">
                    <span>Weight</span>
                </el-col>
                <el-col :span="18">
                    <span>{{ selectedSku?.weight }}kg</span>
                </el-col>
            </el-row>
            <el-row :gutter="5" class="row">
                <el-col :span="6">
                    <span>Sku Properties</span>
                </el-col>
                <el-col :span="18">
                    <el-tag v-for="tag in selectedSku?.skuPropertiesValueList" :key="tag.propertiesName" type="primary"
                        class="tag">{{ tag.valueName }}</el-tag>
                </el-col>
            </el-row>
            <el-row :gutter="5" class="row">
                <el-col :span="6">
                    <span>Sale Attr</span>
                </el-col>
                <el-col :span="18">
                    <el-tag v-for="tag in selectedSku?.skuSaleAttrValueList" :key="tag.saleAttrName" type="success"
                        class="tag">{{
                            tag.valueName }}</el-tag>
                </el-col>
            </el-row>
            <el-row :gutter="5" class="row">
                <el-col :span="6">
                    <span>Sale Attr</span>
                </el-col>
                <el-col :span="18">
                    <img :src="selectedSku?.skuDefaultImg" style="height: 100px; width: 100px;">
                </el-col>
            </el-row>
        </template>
    </el-drawer>
</template>

<script lang="ts" setup>
import { reqChangeIsAvailable, reqDeleteSku, reqPageQuery } from '@/api/goods/SKU';
import type { skuData } from '@/api/goods/SKU/type';
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';
import skuForm from '../SPU-administration/skuForm.vue';
import SkuForm from '../SPU-administration/skuForm.vue';

const currentPage = ref<number>(1)
const pageSize = ref<number>(5)
const total = ref<number>(0)
const skuList = ref<skuData[]>([])

const pageQuery = async () => {
    const result = await reqPageQuery(currentPage.value, pageSize.value)

    if (result.code === 1) {
        skuList.value = result.data.records
        total.value = result.data.total
    } else {
        ElMessage.error('Fail to get sku list')
    }
}

const handleSizeChange = () => {
    currentPage.value = 1
    pageQuery()
}

onMounted(() => {
    pageQuery()
})

//function for up or down button in table
const changeIsAvailable = async (row: skuData) => {
    const result = await reqChangeIsAvailable((row.id as number));

    if (result.code === 1) {
        pageQuery();
        ElMessage.success('Operation success')
    } else {
        ElMessage.error(result.msg)
    }
}

//function for info button in table
const drawer = ref<boolean>(false)
const selectedSku = ref<skuData>()

const openDrawer = (row: skuData) => {
    drawer.value = true;
    selectedSku.value = row;
}

//function for delete button in table
const deleteSku = async (row: skuData) => {
    const result = await reqDeleteSku((row.id as number))

    if (result.code === 1) {
        ElMessage.success('Sku deleted')
        pageQuery()
    } else {
        ElMessage.error(result.msg)
    }
}

//function for edit button in table
const scene = ref<number>(0)
const skuFormComponent = ref<any>()

const updateSku = (row: skuData) => {
    scene.value = 1
    skuFormComponent.value.initialForm2(row)
}

//get scene from child component
const changeScene = (num: number) => {
    scene.value = num
    pageQuery()
}
</script>

<style scoped lang="scss">
.container {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;

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
            }
        }
    }

    .row {
        margin-bottom: 10px;

        .tag {
            margin-right: 5px;
        }
    }
}
</style>