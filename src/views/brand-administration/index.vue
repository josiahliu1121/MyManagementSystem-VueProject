<template>
    <el-card class="container" :body-style="{ width: '100%' }">
        <el-button class="button" type="primary" icon="Plus" @click="addButton()" v-button="`btn.brand.add`">Add
            Brand</el-button>
        <el-scrollbar class="table-container">
            <el-table class="table" :data="records" border>
                <el-table-column type="index" label="No." align="center" width="80px" />
                <el-table-column prop="name" label="Brand" />
                <el-table-column label="Logo">
                    <template #="{ row }">
                        <img :src="row.logoUrl" style="width: 150px; height: 150px;" />
                    </template>
                </el-table-column>
                <el-table-column label="Operation">
                    <template #="{ row }">
                        <el-button type="primary" icon="Edit" class="button" @click="updateButton(row)"
                            v-button="`btn.brand.edit`"></el-button>
                        <el-popconfirm :title="`Are you sure to delete ${row.name}?`" width="220" icon="Delete"
                            @confirm="deleteBrand(row)">
                            <template #reference>
                                <el-button type="primary" icon="Delete" class="button"
                                    v-button="`btn.brand.delete`"></el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 30]"
                :background="true" layout="sizes, prev, pager, next, jumper,->, total" :total="total"
                @size-change="handleSizeChange" @current-change="pageQuery()" />
        </el-scrollbar>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="data.id ? 'Update brand' : 'Add brand'" width="700" class="dialog">
        <el-form label-width="60" class="form" :rules="rules" ref="formRef" :model="data">
            <el-form-item label="Name" prop="name">
                <el-input placeholder="Please enter brand name" v-model="data.name"></el-input>
            </el-form-item>
            <el-form-item label="Logo">
                <el-upload class="avatar-uploader" action="/api/common/uploadImg" :show-file-list="false"
                    :headers="uploadHeaders" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                    <img v-if="data.logoUrl" :src="data.logoUrl" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false" class="button">
                    Cancel
                </el-button>
                <el-button type="primary" @click="submitForm(formRef)" class="button">
                    Confirm
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { reqPageQuery, reqDeleteBrand } from '@/api/goods/brand';
import type { BrandPageQueryData, Records } from '@/api/goods/brand/type';

const currentPage = ref<number>(1)
const pageSize = ref<number>(5)
const total = ref<number>(0)
const records = ref<Records>([])
const formRef = ref<FormInstance>();

//send page query request
const pageQuery = async () => {
    const result: BrandPageQueryData = await reqPageQuery(currentPage.value, pageSize.value);
    total.value = result.data.total
    records.value = result.data.records
}
const handleSizeChange = () => {
    currentPage.value = 1
    pageQuery()
}

//send request to get brand data
onMounted(async () => {
    pageQuery()
})

const addButton = () => {
    data.id = undefined
    data.name = ''
    data.logoUrl = ''

    formRef.value?.clearValidate("name")
    dialogVisible.value = true
}

const updateButton = (row: Brand) => {
    Object.assign(data, row)

    formRef.value?.clearValidate("name")
    dialogVisible.value = true
}

const deleteBrand = async (row: Brand) => {
    if (row.id) {
        const result = await reqDeleteBrand(row.id)
        if (result.code === 1) {
            ElMessage.success('Brand deleted')
            pageQuery()
        } else {
            ElMessage.error(result.msg)
        }
    }

}

//code for dialog
import { reactive, computed } from 'vue';
import { ElMessage } from 'element-plus'
import type { Brand } from '@/api/goods/brand/type';
import type { UploadProps, FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '@/stores/user';
import { reqSaveBrand, reqUpdateBrand } from '@/api/goods/brand';
const dialogVisible = ref<boolean>(false)

const data = reactive<Brand>({
    id: undefined,
    name: '',
    logoUrl: ''
})

const rules = reactive<FormRules>({
    name: [
        { required: true, message: 'Brand name is required', trigger: 'blur' },
    ],
});

const userStore = useUserStore()

// Dynamically bind headers with the token
const uploadHeaders = computed(() => ({
    token: userStore.token // Adjust the token format as required by your backend
}));

const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile
) => {
    data.logoUrl = response.data
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
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

//confirm button function
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            reqUpdateOrSave()
        }
    })
}

const reqUpdateOrSave = async () => {
    let result;
    if (data.id) {
        //update 
        result = await reqUpdateBrand(data)
    } else {
        //add
        result = await reqSaveBrand(data)
    }

    if (result.code === 1) {
        ElMessage.success(data.id ? 'Brand updated' : 'Brand added')
        dialogVisible.value = false
        pageQuery()
    } else {
        ElMessage.error(result.msg)
    }
}
</script>

<style scoped lang="scss">
.container {
    width: 100%;
    overflow-y: auto;

    .button {
        padding: 0 10px;
    }

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

.dialog {
    .form {
        width: 80%;
    }

    .button {
        padding: 0 10px;
    }
}

.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>