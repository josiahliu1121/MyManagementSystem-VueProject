<template>
    <div class="container">
        <el-card class="top">
            <el-form :inline="true">
                <el-form-item label="Role:">
                    <el-input placeholder="Search role with keyword" v-model="searchRoleName"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search()">Search</el-button>
                    <el-button @click="reset()">Reset</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card class="content">
            <el-button type="primary" icon="Plus" @click="openAddDialog()" v-button="`btn.role.add`">Add
                Role</el-button>
            <!--User table-->
            <el-table border class="table" :data="roleList">
                <el-table-column type="index" label="No." align="center" width="80px" />
                <el-table-column label="ID" width="80px" prop="id" />
                <el-table-column label="Role Name" min-width="100px" prop="roleName" />
                <el-table-column label="Create Time" min-width="100px" prop="createTime" />
                <el-table-column label="Update Time" min-width="100px" prop="updateTime" />
                <el-table-column label="Operation" width="320px" fixed="right">
                    <template #="{ row }">
                        <el-button type="primary" size="small" icon="User" @click="setMenuAccess(row)"
                            v-button="`btn.role.distribute`">Distribute
                            access</el-button>
                        <el-button type="primary" size="small" icon="Edit" @click="openUpdateDialog(row)"
                            v-button="`btn.role.edit`">Edit</el-button>
                        <el-popconfirm :title="`Are you sure to delete ${row.roleName}?`" width="220" icon="Delete"
                            @confirm="deleteRole(row)">
                            <template #reference>
                                <el-button type="primary" size="small" icon="Delete" class="button"
                                    v-button="`btn.role.delete`">Delete</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 30]"
                :background="true" layout="sizes, prev, pager, next, jumper,->, total" :total="total"
                @size-change="handleSizeChange" @current-change="pageQuery()" />
        </el-card>

        <!--dialog for add or update role-->
        <el-dialog v-model="dialogVisible" :title="roleForm.id ? 'Update Role' : 'Add Role'" width="500">
            <el-form :model="roleForm" :rules="roleFormRule" ref="roleFormRef">
                <el-form-item label="Role Name" prop="roleName">
                    <el-input placeholder="Please enter role name" v-model="roleForm.roleName"></el-input>
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

        <!--Distribute menu access drawer-->
        <el-drawer v-model="drawer">
            <template #header>
                <h4>Distribute Menu Access</h4>
            </template>
            <template #default>
                <el-tree style="max-width: 600px" :data="menuList" show-checkbox node-key="id" default-expand-all
                    :props="defaultProps" :default-checked-keys="selectedMenuId" ref="menuTree" />
            </template>
            <template #footer>
                <div style="flex: auto">
                    <el-button @click="drawer = false">cancel</el-button>
                    <el-button type="primary" @click="AssignMenu()">confirm</el-button>
                </div>
            </template>
        </el-drawer>
    </div>
</template>

<script lang="ts" setup>
import { reqGetMenu } from '@/api/user/menu';
import type { MenuData } from '@/api/user/menu/type';
import { reqAddRole, reqAssignMenu, reqDeleteRole, reqRolePageQuery, reqUpdateRole } from '@/api/user/role';
import type { RoleData } from '@/api/user/role/type';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';

const currentPage = ref<number>(1)
const pageSize = ref<number>(5)
const total = ref<number>(0)
const roleList = ref<RoleData[]>([])
const searchRoleName = ref<string>('')

//role page query with keyword search
const pageQuery = async () => {
    const result = await reqRolePageQuery(currentPage.value, pageSize.value, searchRoleName.value)

    if (result.code === 1) {
        roleList.value = result.data.records
        total.value = result.data.total
    } else {
        ElMessage.error('Fail to get role data')
    }
}

const handleSizeChange = () => {
    currentPage.value = 1;
    pageQuery();
}

onMounted(() => {
    pageQuery();
})

//search button at top
const search = () => {
    currentPage.value = 1
    pageQuery()
}

//reset button at top
const reset = () => {
    currentPage.value = 1
    searchRoleName.value = ''
    pageQuery()
}

//function for delete button in table
const deleteRole = async (row: RoleData) => {
    const result = await reqDeleteRole((row.id as number))

    if (result.code === 1) {
        ElMessage.success('Role deleted')
        pageQuery()
    } else {
        ElMessage.error(result.msg)
    }
}

//function and constant for add/update role dialog
const dialogVisible = ref<boolean>(false)
const roleForm = ref<RoleData>({
    roleName: ''
})
const roleFormRule = reactive<FormRules<RoleData>>({
    roleName: [
        { required: true, message: 'Please input role name', trigger: 'blur' }
    ]
})
const roleFormRef = ref<FormInstance>()

//function for add button above table
const openAddDialog = () => {
    roleForm.value = {
        roleName: ''
    }
    roleFormRef.value?.clearValidate()
    dialogVisible.value = true
}

//function for edit button in table
const openUpdateDialog = (row: RoleData) => {
    roleForm.value = JSON.parse(JSON.stringify(row))
    roleFormRef.value?.clearValidate()
    dialogVisible.value = true
}

//function for save button in dialog
const submitForm = async () => {
    await roleFormRef.value?.validate();

    let result = undefined
    if (roleForm.value.id) {
        result = await reqUpdateRole(roleForm.value)
    } else {
        result = await reqAddRole(roleForm.value)
    }

    if (result.code === 1) {
        ElMessage.success('Change saved')
        pageQuery()
    } else {
        ElMessage.error(result.msg)
    }

    dialogVisible.value = false
}

//functions and variable for distribute menu access drawer
const drawer = ref<boolean>(false)
const menuList = ref<MenuData[]>([])
const defaultProps = {
    children: 'children',
    label: 'menuName',
}
const selectedRoleId = ref<number>()
const selectedMenuId = ref<number[]>([])
const menuTree = ref()

//function for distribute button in table
const setMenuAccess = async (row: RoleData) => {
    const result = await reqGetMenu((row.id as number))

    if (result.code === 1) {
        menuList.value = result.data;

        selectedRoleId.value = row.id
        //get selected menu id
        selectedMenuId.value = []
        getSelectedMenuId(result.data, selectedMenuId.value)

        drawer.value = true;
    } else {
        ElMessage.error(result.msg)
    }
}

const getSelectedMenuId = (source: MenuData[], selectedMenuIdList: number[]) => {
    source.forEach(menu => {
        if (menu.selected === true && menu.level === 4) {
            selectedMenuIdList.push((menu.id as number))
        }

        if ((menu.children?.length as number) > 0 && menu.children !== null) {
            getSelectedMenuId((menu.children as MenuData[]), selectedMenuIdList)
        }
    })
}

//function for save button in drawer
const AssignMenu = async () => {
    const selectedMenu = [...menuTree.value.getCheckedKeys(), ...menuTree.value.getHalfCheckedKeys()];

    const result = await reqAssignMenu((selectedRoleId.value as number), selectedMenu)
    if (result.code === 1) {
        ElMessage.success('Menu assigned')
        drawer.value = false
    } else {
        ElMessage.error(result.msg)
    }
}
</script>

<style scoped lang="scss">
.container {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;

    .top {
        width: 100%;
        margin-bottom: 10px;
    }

    .content {
        width: 100%;

        .table {
            margin: 10px 0;
        }
    }
}
</style>