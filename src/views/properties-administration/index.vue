<template>
    <div class="container">
        <CategorySelector class="top" :scene="scene"></CategorySelector>
        <el-card class="card" :body-style="{ width: '100%' }">
            <!--div showing properties-->
            <div v-show="scene === 0">
                <el-button type="primary" icon="Plus" :disabled="!categoryStore.category3Id" @click="addProperties()"
                    v-button="`btn.properties.add`">Add
                    Properties</el-button>
                <div class="table-container">
                    <el-table class="table" border :data="categoryStore.propertiesList">
                        <el-table-column type="index" label="No." align="center" width="80px" />
                        <el-table-column label="Properties" width="160px" prop="propName" />
                        <el-table-column label="Properties values">
                            <template #="{ row }">
                                <el-tag type="primary" v-for="(propValue, index) in row.propValueList"
                                    :key="propValue.id" class="tag">{{
                                        propValue.valueName }}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="Operation" width="160px">
                            <template #="{ row }">
                                <el-button type="primary" icon="Edit" class="button" @click="editProperties(row)"
                                    v-button="`btn.properties.edit`"></el-button>
                                <el-popconfirm :title="`Are you sure to delete ${row.propName}?`" width="220"
                                    icon="Delete" @confirm="deleteProp(row.id)">
                                    <template #reference>
                                        <el-button type="primary" icon="Delete" class="button"
                                            v-button="`btn.properties.delete`"></el-button>
                                    </template>
                                </el-popconfirm>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>

            <!--div edit properties-->
            <div v-show="scene === 1">
                <el-form class="form">
                    <el-form-item label="Name">
                        <el-input placeholder="Properties Name" v-model="data.propName"></el-input>
                    </el-form-item>
                </el-form>
                <el-button icon="Plus" type="primary" @click="addPropertiesValue()" :disabled="!data.propName">Add
                    Value</el-button>
                <el-button @click="scene = 0">Cancel</el-button>
                <el-table class="table" border :data="data.propValueList">
                    <el-table-column type="index" label="No." align="center" width="80px" />
                    <el-table-column label="Properties Value">
                        <template #="{ row }">
                            <el-input v-model="row.valueName"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="Operation">
                        <template #="{ row, $index }">
                            <el-button type="primary" icon="Delete" @click="deleteValue($index)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button type="primary" @click="saveChanges()">Save</el-button>
                <el-button @click="scene = 0">Cancel</el-button>
            </div>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import CategorySelector from '@/components/categorySelector/index.vue'
import { useCategoryStore } from '@/stores/category';
import { reactive, ref, onBeforeUnmount } from 'vue';
import type { PropertiesObj } from '@/api/goods/properties/type';
import { reqSaveOrUpdate, reqDeleteProp } from '@/api/goods/properties';
import { ElMessage } from 'element-plus';

const categoryStore = useCategoryStore()

const scene = ref<number>(0)

const data = reactive<PropertiesObj>({
    id: undefined,
    propName: '',
    categoryId: categoryStore.category3Id,
    categoryLevel: 3,
    propValueList: []
})

//add properties button function
const addProperties = () => {
    scene.value = 1
    //clear data
    Object.assign(data, {
        id: undefined,
        propName: '',
        categoryId: categoryStore.category3Id,
        categoryLevel: 3,
        propValueList: []
    })
}

//add value button function
const addPropertiesValue = () => {
    data.propValueList.push({
        valueName: '',
        propId: data.id
    })
}

//change button function
const saveChanges = async () => {
    const result = await reqSaveOrUpdate(data)

    if (result.code === 1) {
        scene.value = 0

        //request new properties data
        categoryStore.getPropList()

        ElMessage.success(data.id ? 'Properties Updated' : 'Properties Added')
    } else {
        ElMessage.error('Request fail')
    }
}

const deleteValue = (index: number) => {
    data.propValueList.splice(index, 1)
}

//edit button function
const editProperties = (row: PropertiesObj) => {
    Object.assign(data, JSON.parse(JSON.stringify(row)))

    scene.value = 1
}

//delete properties button
const deleteProp = async (id: number) => {
    const result = await reqDeleteProp(id)

    if (result.code === 1) {
        ElMessage.success('Properties deleted')
        categoryStore.getPropList()
    } else {
        ElMessage.error('Properties delete fail')
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