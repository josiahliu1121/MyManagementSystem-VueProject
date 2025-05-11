<template>
    <el-form label-width="110px">
        <el-form-item label="SPU Name">
            <el-input placeholder="Please enter spu name" v-model="formData.spuName"></el-input>
        </el-form-item>
        <el-form-item label="SPU Brand">
            <el-select placeholder="please select brand" class="selectBar" v-model="formData.brandId">
                <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
        </el-form-item>
        <el-form-item label="SPU Description">
            <el-input placeholder="Please enter spu name" type="textarea" v-model="formData.description"></el-input>
        </el-form-item>
        <el-form-item label="SPU Image">
            <el-upload v-model:file-list="fileList" action="/api/common/uploadImg" :headers="uploadHeaders"
                list-type="picture-card" :before-upload="beforeUpload" :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove">
                <el-icon>
                    <Plus />
                </el-icon>
            </el-upload>
            <el-dialog v-model="dialogVisible">
                <img w-full :src="dialogImageUrl" alt="Preview Image" class="dialogImage" />
            </el-dialog>
        </el-form-item>
        <el-form-item label="SPU Sales Attr">
            <el-select :placeholder="unselectSaleAttr.length ? `${unselectSaleAttr.length} more to select` : 'None'"
                class="selectBar" v-model="selectedSaleAttr">
                <el-option v-for="item in unselectSaleAttr" :key="item.id" :label="item.name" :value="item" />
            </el-select>
            <el-button type="primary" icon="Plus" @click="addSaleAttr()" :disabled="selectedSaleAttr ? false : true">Add
                sales
                attr</el-button>
            <el-table class="table" border :data="formData.spuSaleAttrList">
                <el-table-column type="index" label="No." align="center" width="80px" />
                <el-table-column label="Attr Name" width="120px" prop="saleAttrName" />
                <el-table-column label="Attr Values">
                    <template #="{ row, $index }">
                        <el-tag v-for="tag in row.saleAttrValueList" :key="tag.id" closable :disable-transitions="false"
                            @close="handleClose(row, tag)" class="tag">
                            {{ tag.saleAttrValueName }}
                        </el-tag>
                        <el-input v-if="row.inputVisible" ref="InputRef" v-model="inputValue" class="tag" size="small"
                            @keyup.enter="handleInputConfirm(row)" @blur="handleInputConfirm(row)" />
                        <el-button v-else class="tag" size="small" @click="showInput(row)">
                            + New Tag
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="Operation" width="100px">
                    <template #="{ row, $index }">
                        <el-button type="primary" icon="Delete" size="small"
                            @click="formData.spuSaleAttrList?.splice($index, 1)"></el-button>
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
import { reqAddSpu, reqBaseSaleAttrList, reqBrandList, reqImageList, reqSaleAttrList, reqUpdataSpu } from '@/api/goods/SPU'
import { ref, onMounted, computed, nextTick } from 'vue'
import type { BaseSaleAttr, Brand, SaleAttr, SaleAttrValue, SpuData, SpuImg } from '@/api/goods/SPU/type'
import { ElMessage } from 'element-plus'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { useUserStore } from '@/stores/user'
import type { InputInstance } from 'element-plus'
import { useCategoryStore } from '@/stores/category'

const $emit = defineEmits(['changeScene'])

const baseSaleAttrList = ref<BaseSaleAttr[]>([])
const brandList = ref<Brand[]>([])
const fileList = ref<UploadUserFile[]>()

const formData = ref<SpuData>({
    spuName: '',
    description: '',
    category3Id: undefined,
    brandId: undefined,
    spuSaleAttrList: [],
    spuImageList: []
})

const emptyForm = () => {
    formData.value = {
        spuName: '',
        description: '',
        category3Id: undefined,
        brandId: undefined,
        spuSaleAttrList: [],
        spuImageList: []
    }
    fileList.value = []
    selectedSaleAttr.value = undefined
}

//function for cancel button
const cancel = () => {
    $emit('changeScene', 0)
    emptyForm()
}

const categoryStore = useCategoryStore()

//function for save button
const save = async () => {
    formData.value.category3Id = categoryStore.category3Id;

    formData.value.spuImageList = fileList.value?.map(item => ({
        id: undefined,
        spuId: formData.value.id,
        imgName: item.name,
        imgUrl: ((item.response as any)?.data) || item.url
    })) || null; // Fallback to `null` if `fileList.value` is undefined

    let result = null;

    if (formData.value.id) {
        result = await reqUpdataSpu(formData.value)
    } else {
        //add category id
        formData.value.category3Id = categoryStore.category3Id

        result = await reqAddSpu(formData.value)
    }

    if (result.code === 1) {
        ElMessage.success(formData.value.id ? 'Spu updated' : 'Spu added')
        $emit('changeScene', 0)
        emptyForm()
    } else {
        ElMessage.error(result.msg)
    }
}

//run when edit button in parent is click
const reqSpuData = async (spu: SpuData) => {
    formData.value = spu;

    const saleAttrListResult = await reqSaleAttrList((spu.id as number));
    const imgListResult = await reqImageList((spu.id as number))
    if (saleAttrListResult.code === 1 && imgListResult.code === 1) {
        formData.value.spuSaleAttrList = saleAttrListResult.data;

        formData.value.spuImageList = imgListResult.data;
        fileList.value = imgListResult.data.map((item: SpuImg) => ({
            name: item.imgName,
            url: item.imgUrl
        }))
    } else {
        ElMessage.error('Fail to get Spu Data')
    }
}

defineExpose({ reqSpuData })

onMounted(async () => {
    const brandListResult = await reqBrandList()
    const baseSaleAttrListResult = await reqBaseSaleAttrList()
    if (brandListResult.code === 1 && baseSaleAttrListResult.code === 1) {
        brandList.value = brandListResult.data;
        baseSaleAttrList.value = baseSaleAttrListResult.data;
    } else {
        ElMessage.error('Fail to get base data')
    }
})

//upload image wall
const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
    console.log(uploadFile, uploadFiles)
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
    dialogImageUrl.value = uploadFile.url!
    dialogVisible.value = true
}

// Dynamically bind headers with the token
const userStore = useUserStore()
const uploadHeaders = computed(() => ({
    token: userStore.token // Adjust the token format as required by your backend
}));

const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']; // List of allowed formats

    if (!allowedTypes.includes(rawFile.type)) {
        ElMessage.error('Logo picture must be in JPG, PNG, GIF, or WEBP format!');
        return false;
    } else if (rawFile.size / 1024 / 1024 > 10) {
        ElMessage.error('Logo picture size cannot exceed 10MB!');
        return false;
    }
    return true;
};

//input attr value functions
const inputValue = ref('')
const InputRef = ref<InputInstance>()

const handleClose = (row: SaleAttr, tag: SaleAttrValue) => {
    row.saleAttrValueList.splice(row.saleAttrValueList.indexOf(tag), 1)
}

const showInput = (row: SaleAttr) => {
    row.inputVisible = true
    nextTick(() => {
        InputRef.value!.input!.focus()
    })
}

const handleInputConfirm = (row: SaleAttr) => {
    if (inputValue.value) {
        row.saleAttrValueList.push({
            spuId: formData.value.id,
            baseSaleAttrId: row.baseSaleAttrId,
            saleAttrValueName: inputValue.value,
            saleAttrName: row.saleAttrName
        })
    }
    row.inputVisible = false
    inputValue.value = ''
}

//calculate unselect base attr
const unselectSaleAttr = computed(() => {
    let unselectAttr = baseSaleAttrList.value.filter(item => {
        return formData.value.spuSaleAttrList?.every(item1 => {
            return item.name != item1.saleAttrName
        })
    })
    return unselectAttr;
})

const selectedSaleAttr = ref<BaseSaleAttr>()

//add sale attr button
const addSaleAttr = () => {
    //push data into formDATA
    formData.value.spuSaleAttrList?.push({
        spuId: formData.value.id,
        baseSaleAttrId: selectedSaleAttr.value?.id,
        saleAttrName: selectedSaleAttr.value?.name,
        saleAttrValueList: []
    })

    selectedSaleAttr.value = undefined;
}
</script>

<style scoped lang="scss">
.selectBar {
    width: 200px;
    margin-right: 10px;
}

.table {
    margin-top: 10px;
}

.dialogImage {
    height: 100%;
    width: 100%;
}

.tag {
    margin: 0 2px;
}
</style>