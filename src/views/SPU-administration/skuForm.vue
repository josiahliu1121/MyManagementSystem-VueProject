<template>
    <el-form label-width="110px">
        <el-form-item label="SKU Name">
            <el-input v-model="formData.skuName" placeholder="Please enter sku name"></el-input>
        </el-form-item>
        <el-form-item label="Price ($)">
            <el-input-number v-model="formData.price" :min="0" placeholder="Please enter price ($)"
                type="number"></el-input-number>
        </el-form-item>
        <el-form-item label="Weight (kg)">
            <el-input-number v-model="formData.weight" :min="0" placeholder="Please enter weight (kg)"
                type="number"></el-input-number>
        </el-form-item>
        <el-form-item label="SKU Description">
            <el-input v-model="formData.description" placeholder="Please enter description" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="SPU Properties">
            <el-form :inline="true" label-width="80px">
                <el-form-item v-for="item in propertiesList" :key="item.id" :label="item.propName">
                    <el-select v-model="item.selectedPropAndValue" placeholder="Select" style="width: 240px">
                        <el-option v-for="value in item.propValueList" :key="value.id" :label="value.valueName"
                            :value="`${item.propName}:${value.valueName}`" />
                    </el-select>
                </el-form-item>
            </el-form>
        </el-form-item>
        <el-form-item label="Sale Attr">
            <el-form :inline="true" label-width="80px">
                <el-form-item v-for="item in saleAttrList" :key="item.id" :label="item.saleAttrName">
                    <el-select v-model="item.selectedAttrAndValue" placeholder="Select" style="width: 240px">
                        <el-option v-for="value in item.saleAttrValueList" :key="value.id"
                            :label="value.saleAttrValueName"
                            :value="`${item.saleAttrName}:${value.saleAttrValueName}`" />
                    </el-select>
                </el-form-item>
            </el-form>
        </el-form-item>
        <el-form-item label="Image Name">
            <el-table :data="imageList" style="width: 100%" border ref="table" @select="setImg" @select-all="selectAll">
                <el-table-column type="selection" width="55" />
                <el-table-column label="Image">
                    <template #="{ row, $index }">
                        <img :src="row.imgUrl" style="width: 100px; height: 100px;">
                    </template>
                </el-table-column>
                <el-table-column label="Name" prop="imgName" />
                <el-table-column label="Operation">
                    <template #="{ row, $index }">
                        <el-button type="primary" size="small" @click="setImg(null, row)">Set default</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="save()">Save</el-button>
            <el-button @click="cancel()">Cancel</el-button>
        </el-form-item>
    </el-form>

</template>

<script lang="ts" setup>
import { reqPropList } from '@/api/goods/properties';
import type { PropertiesObj } from '@/api/goods/properties/type';
import { reqAddOrUpdateSku } from '@/api/goods/SKU';
import type { skuData } from '@/api/goods/SKU/type';
import { reqImageList, reqSaleAttrList } from '@/api/goods/SPU';
import type { SaleAttr, SpuData, SpuImg } from '@/api/goods/SPU/type';
import { useCategoryStore } from '@/stores/category';
import { ElMessage } from 'element-plus';
import { nextTick, ref } from 'vue';

const $emit = defineEmits(['changeScene'])
const table = ref<any>()

const propertiesList = ref<PropertiesObj[]>([])
const saleAttrList = ref<SaleAttr[]>([])
const imageList = ref<SpuImg[]>([])

const formData = ref<skuData>({
    skuName: '',
    isAvailable: 0,
    spuId: undefined,
    price: undefined,
    weight: undefined,
    description: '',
    skuPropertiesValueList: [],
    skuSaleAttrValueList: [],
    skuDefaultImg: '',
    category1Id: undefined,
    category2Id: undefined,
    category3Id: undefined
})

//function for cancel button
const cancel = () => {
    $emit('changeScene', 0)
}

//function for set default button in table column
const setImg = (selection: any, row: SpuImg) => {
    table.value.clearSelection();
    table.value.toggleRowSelection(row, true);

    formData.value.skuDefaultImg = row.imgUrl
}

//function for select all element of table
const selectAll = () => {
    table.value.clearSelection();
}

//function for save button
const save = async () => {
    //collect data into form
    formData.value.skuPropertiesValueList = propertiesList.value.reduce((prev: any, current: any) => {
        if (current.selectedPropAndValue) {
            let [propertiesName, valueName] = current.selectedPropAndValue.split(':');
            prev.push({
                propertiesName,
                valueName
            })
        }
        return prev;
    }, [])

    formData.value.skuSaleAttrValueList = saleAttrList.value.reduce((prev: any, current: any) => {
        if (current.selectedAttrAndValue) {
            let [saleAttrName, valueName] = current.selectedAttrAndValue.split(':');
            prev.push({
                saleAttrName,
                valueName
            })
        }
        return prev;
    }, [])

    const result = await reqAddOrUpdateSku(formData.value);
    if (result.code === 1) {
        ElMessage.success('Sku added')
        $emit('changeScene', 0);
    } else {
        ElMessage.error(result.msg)
    }
}

//send request to get data for form display, will be exposed
const categoryStore = useCategoryStore()

//initial form for add sku
const initialForm = async (spu: SpuData) => {
    emptyForm();

    const propertiesReqResult = await reqPropList(categoryStore.category1Id, categoryStore.category2Id, categoryStore.category3Id);
    const saleAttrReqResult = await reqSaleAttrList((spu.id as number));
    const imageReqResult = await reqImageList((spu.id as number));

    if (propertiesReqResult.code === 1 && saleAttrReqResult.code === 1 && imageReqResult.code === 1) {
        propertiesList.value = propertiesReqResult.data;
        saleAttrList.value = saleAttrReqResult.data;
        imageList.value = imageReqResult.data;

        formData.value.spuId = spu.id;
        formData.value.category1Id = categoryStore.category1Id;
        formData.value.category2Id = categoryStore.category2Id;
        formData.value.category3Id = categoryStore.category3Id;
    } else {
        ElMessage.error('Data request fail')
    }
}

//initial form for update sku
const initialForm2 = async (sku: skuData) => {
    formData.value = sku;

    const propertiesReqResult = await reqPropList(sku.category1Id, sku.category2Id, sku.category3Id);
    const saleAttrReqResult = await reqSaleAttrList((sku.spuId as number));
    const imageReqResult = await reqImageList((sku.spuId as number));

    if (propertiesReqResult.code === 1 && saleAttrReqResult.code === 1 && imageReqResult.code === 1) {
        propertiesList.value = propertiesReqResult.data;
        saleAttrList.value = saleAttrReqResult.data;
        imageList.value = imageReqResult.data;
    } else {
        ElMessage.error('Data request fail')
    }

    //select the default img
    nextTick(() => {
        const selectedImg = imageList.value.find(img => img.imgUrl === sku.skuDefaultImg);
        if (selectedImg) {
            table.value.toggleRowSelection(selectedImg, true);
        }
    });

    //fill the selected properties value
    propertiesList.value = propertiesList.value.map(newProperties => {
        const source = sku.skuPropertiesValueList.find(prop => prop.propertiesName === newProperties.propName);
        if (source) {
            return { ...newProperties, selectedPropAndValue: `${source.propertiesName}:${source.valueName}` }
        }
        return newProperties;
    })

    //fill the selected attr value
    saleAttrList.value = saleAttrList.value.map(newAttr => {
        const source = sku.skuSaleAttrValueList.find(attr => attr.saleAttrName === newAttr.saleAttrName);
        if (source) {
            return { ...newAttr, selectedAttrAndValue: `${source.saleAttrName}:${source.valueName}` }
        }
        return newAttr;
    })
}

defineExpose({ initialForm, initialForm2 })

const emptyForm = () => {
    formData.value = {
        skuName: '',
        isAvailable: 0,
        spuId: undefined,
        price: undefined,
        weight: undefined,
        description: '',
        skuPropertiesValueList: [],
        skuSaleAttrValueList: [],
        skuDefaultImg: '',
        category1Id: undefined,
        category2Id: undefined,
        category3Id: undefined
    }

    propertiesList.value = [];
    saleAttrList.value = [];
    imageList.value = [];
}
</script>

<style scoped lang="scss"></style>