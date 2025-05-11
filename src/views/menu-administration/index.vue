<template>
    <div class="outer">
        <el-card class="container">
            <el-table :data="menuList" row-key="id" border default-expand-all>
                <el-table-column prop="menuName" label="Menu Name" min-width="200px" />
                <el-table-column prop="code" label="Code" min-width="200px" />
                <el-table-column prop="updateTime" label="Update Time" min-width="200px" />
                <el-table-column label="Operation" fixed="right" width="300px">
                    <template #="{ row }">
                        <el-button v-if="row.level < 4" type="primary" size="small" icon="Plus" style="width: 110px;"
                            @click="addMenu(row)" v-button="`btn.menu.add`">{{
                                row.level < 3 ? 'Add Menu' : 'Add Function' }} </el-button>
                                <el-button type="primary" size="small" icon="Edit" :disabled="row.level === 1"
                                    @click="editMenu(row)" v-button="`btn.menu.edit`">Edit</el-button>
                                <el-popconfirm :title="`Are you sure to delete ${row.menuName}?`" width="220"
                                    icon="Delete" @confirm="deleteMenu(row)">
                                    <template #reference>
                                        <el-button type="primary" size="small" icon="Delete" class="button"
                                            :disabled="row.level === 1" v-button="`btn.menu.delete`">Delete</el-button>
                                    </template>
                                </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!--dialog for add or update menu-->
        <el-dialog v-model="dialogVisible"
            :title="(menuForm.id ? 'Update' : 'Add') + (menuForm.level > 3 ? ' Function' : ' Menu')" width="500">
            <el-form :model="menuForm" :rules="menuFormRule" ref="menuFormRef" label-width="100px">
                <el-form-item label="Menu Name" prop="menuName">
                    <el-input placeholder="Please enter role name" v-model="menuForm.menuName"></el-input>
                </el-form-item>
                <el-form-item label="Code" prop="code">
                    <el-input placeholder="Please enter role name" v-model="menuForm.code"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitForm()">Confirm</el-button>
                    <el-button @click="dialogVisible = false">
                        Cancel
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { reqAddMenu, reqDeleteMenu, reqGetAllMenu, reqUpdateMenu } from '@/api/user/menu';
import type { MenuData } from '@/api/user/menu/type';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';

const menuList = ref<MenuData[]>([])

const getMenuList = async () => {
    const result = await reqGetAllMenu();

    if (result.code === 1) {
        menuList.value = result.data;
    } else {
        ElMessage.error('Fail to get menu data')
    }
}

onMounted(() => {
    getMenuList();
})

//function for delete button in table
const deleteMenu = async (row: MenuData) => {
    const result = await reqDeleteMenu((row.id as number))

    if (result.code === 1) {
        ElMessage.success('Menu Deleted')
        getMenuList()
    } else {
        ElMessage.error(result.msg)
    }
}

//variable and functions for add or update dialog
const dialogVisible = ref<boolean>(false)
const menuForm = ref<MenuData>({
    menuName: '',
    code: '',
    pid: 0,
    level: 1,
})
const menuFormRule = reactive<FormRules>({
    menuName: [
        { required: true, message: 'Please input menu name', trigger: 'blur' }
    ],
    code: [
        { required: true, message: 'Please input menu code', trigger: 'blur' }
    ]
})
const menuFormRef = ref<FormInstance>()

//function for add button in table
const addMenu = (row: MenuData) => {
    menuForm.value = {
        menuName: '',
        code: '',
        pid: (row.id as number),
        level: row.level + 1,
    }

    menuFormRef.value?.clearValidate()

    dialogVisible.value = true
}

//function for edit button in table
const editMenu = (row: MenuData) => {
    menuForm.value = JSON.parse(JSON.stringify(row))

    menuFormRef.value?.clearValidate()

    dialogVisible.value = true
}

//function for save button in dialog
const submitForm = async () => {
    await menuFormRef.value?.validate();

    let result = undefined;
    if (menuForm.value.id) {
        result = await reqUpdateMenu(menuForm.value);
    } else {
        result = await reqAddMenu(menuForm.value);
    }

    if (result.code === 1) {
        ElMessage.success(menuForm.value.id ? 'Menu is updated' : 'Menu is added');
        getMenuList();
        dialogVisible.value = false;
    } else {
        ElMessage.error(result.msg)
    }
}
</script>

<style scoped lang="scss">
.outer {
    width: 100%;

    .container {
        width: 100%;
    }
}
</style>