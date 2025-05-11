<template>
    <div class="container">
        <el-card class="top">
            <el-form :inline="true">
                <el-form-item label="Username:">
                    <el-input placeholder="Please enter user name" v-model="searchUserName"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchFunction()">Search</el-button>
                    <el-button @click="resetFunction()">Reset</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card class="content">
            <el-button type="primary" icon="Plus" @click="addUser()" v-button="`btn.user.add`">Add User</el-button>
            <el-button type="danger" icon="Delete" :disabled="multipleSelection.length ? false : true"
                @click="batchDelete()" v-button="`btn.user.delete`">Batch Delete</el-button>
            <!--User table-->
            <el-table border class="table" :data="userArr" @selection-change="handleSelectionChange" row-key="id">
                <el-table-column type="selection" width="55" />
                <el-table-column type="index" label="No." align="center" width="80px" />
                <el-table-column label="ID" width="80px" prop="id" />
                <el-table-column label="Username" min-width="100px" prop="username" />
                <el-table-column label="Name" min-width="100px" prop="name" />
                <el-table-column label="User Role" min-width="100px" prop="roles" />
                <el-table-column label="Create Time" min-width="100px" prop="createTime" />
                <el-table-column label="Update Time" min-width="100px" prop="updateTime" />
                <el-table-column label="Operation" width="300px" fixed="right">
                    <template #="{ row }">
                        <el-button type="primary" size="small" icon="User" @click="distributeRole(row)"
                            v-button="`btn.user.distribute`">Distribute
                            role</el-button>
                        <el-button type="primary" size="small" icon="Edit" @click="updateUser(row)"
                            v-button="`btn.user.edit`">Edit</el-button>
                        <el-popconfirm :title="`Are you sure to delete ${row.name}?`" width="220" icon="Delete"
                            @confirm="deleteUser(row)">
                            <template #reference>
                                <el-button type="primary" size="small" icon="Delete" class="button"
                                    v-button="`btn.user.delete`">Delete</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 30]"
                :background="true" layout="sizes, prev, pager, next, jumper,->, total" :total="total"
                @size-change="handleSizeChange" @current-change="pageQuery()" />
        </el-card>

        <!--drawer to edit user info-->
        <el-drawer v-model="drawer">
            <template #header>
                <h4>{{ userFormData.id ? 'Update User Info' : 'Add User Info' }}</h4>
            </template>
            <template #default>
                <el-form label-width="80px" ref="userFormRef" :rules="userFormRule" :model="userFormData">
                    <el-form-item label="Username" prop="username">
                        <el-input placeholder="Please enter username" v-model="userFormData.username"></el-input>
                    </el-form-item>
                    <el-form-item label="Name" prop="name">
                        <el-input placeholder="Please enter name" v-model="userFormData.name"></el-input>
                    </el-form-item>
                    <el-form-item label="Password" prop="password" v-if="!userFormData.id">
                        <el-input placeholder="Please enter password" v-model="userFormData.password"></el-input>
                    </el-form-item>
                </el-form>
            </template>
            <template #footer>
                <div style="flex: auto">
                    <el-button @click="drawer = false">cancel</el-button>
                    <el-button type="primary" @click="confirmClick">confirm</el-button>
                </div>
            </template>
        </el-drawer>

        <!--drawer to edit user role-->
        <el-drawer v-model="roleDrawer">
            <template #header>
                <h4>Distribute user role</h4>
            </template>
            <template #default>
                <el-form label-width="80px">
                    <el-form-item label="Username">
                        <el-input disabled v-model="userFormData.username"></el-input>
                    </el-form-item>
                    <el-form-item label="Role List">
                        <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
                            Check all
                        </el-checkbox>
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox-group v-model="checkedRole" @change="handleCheckedRoleChange">
                            <el-checkbox v-for="role in allRole" :key="role.id" :label="role.roleName" :value="role">
                                {{ role.roleName }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
            </template>
            <template #footer>
                <div style="flex: auto">
                    <el-button @click="roleDrawer = false">cancel</el-button>
                    <el-button type="primary" @click="saveRole()">confirm</el-button>
                </div>
            </template>
        </el-drawer>
    </div>
</template>

<script lang="ts" setup>
import { reqAddOrUpdateUser, reqAssignRole, reqBatchDeleteUser, reqGetAssignedRole, reqUserPageQuery } from '@/api/user';
import type { RoleData } from '@/api/user/role/type';
import type { AssignRoleRequestData, user } from '@/api/user/type';
import { useUserStore } from '@/stores/user';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';

const currentPage = ref<number>(1)
const pageSize = ref<number>(5)
const total = ref<number>(0)
const userArr = ref<user[]>([])
const multipleSelection = ref<user[]>([])
const searchUserName = ref<string>('')

//user page query
const pageQuery = async () => {
    const result = await reqUserPageQuery(currentPage.value, pageSize.value, searchUserName.value)

    if (result.code === 1) {
        userArr.value = result.data.records
        total.value = result.data.total
    } else {
        ElMessage.error('Fail to get user data')
    }
}

//function for search button
const searchFunction = () => {
    pageQuery();
}

//function for reset button
const resetFunction = () => {
    searchUserName.value = ''
    pageQuery()
}

const handleSizeChange = () => {
    currentPage.value = 1;
    pageQuery();
}

onMounted(() => {
    pageQuery();
})

const handleSelectionChange = (val: user[]) => {
    multipleSelection.value = val
}

//function for batch delete button
const batchDelete = async () => {
    const ids: number[] = multipleSelection.value.map(user => (user.id as number))

    const result = await reqBatchDeleteUser(ids)

    if (result.code === 1) {
        ElMessage.success('User deleted')
        pageQuery()
    } else {
        ElMessage.error(result.msg)
    }
}

//function for delete button in table
const deleteUser = async (row: user) => {
    const ids: number[] = [(row.id as number)]

    const result = await reqBatchDeleteUser(ids)

    if (result.code === 1) {
        ElMessage.success('User deleted')
        pageQuery()
    } else {
        ElMessage.error(result.msg)
    }
}

//drawer to add and edit user info
const drawer = ref<boolean>(false)
const userFormData = ref<user>({
    username: '',
    name: '',
    password: undefined
})

//validator for password
const checkPassword = (rule: any, value: any, callback: any) => {
    //if is update, not need password
    if (userFormData.value.id !== undefined) {
        return callback()
    }

    //password should be longer than 3 words
    if (value.length < 3) {
        return callback(new Error('Password should be longer than 3 words'))
    }

    return callback()
}

const userFormRef = ref<FormInstance>()
const userFormRule = reactive<FormRules<user>>({
    username: [
        { required: true, message: 'Please input name', trigger: 'blur' },
        { min: 3, message: 'Length should be more than 3', trigger: 'blur' }
    ],
    name: [
        { required: true, message: 'Please input name', trigger: 'blur' },
        { min: 3, message: 'Length should be more than 3', trigger: 'blur' }
    ],
    password: [
        { required: true, message: 'Please input password', trigger: 'blur' },
        { validator: checkPassword, trigger: 'blur' }
    ]
})

//function for add button
const addUser = () => {
    userFormData.value = {
        username: '',
        name: '',
        password: undefined
    }

    userFormRef.value?.clearValidate(); // Clears all validation warnings

    drawer.value = true
}

//function for edit button in table
const updateUser = (row: user) => {
    userFormData.value = JSON.parse(JSON.stringify(row))

    userFormRef.value?.clearValidate(); // Clears all validation warnings

    drawer.value = true
}

//function for confirm button in drawer
const userStore = useUserStore()
const confirmClick = async () => {
    await userFormRef.value?.validate()

    const result = await reqAddOrUpdateUser(userFormData.value)

    if (result.code === 1) {
        drawer.value = false;
        ElMessage.success(userFormData.value.id ? 'User updated' : 'User add')

        pageQuery();

        //if user update self info, resend request to get the latest user info
        if (userFormData.value.id === userStore.id) {
            userStore.userInfo();
        }
    } else {
        ElMessage.error(result.msg)
    }
}

//functions and variable for role drawer
const roleDrawer = ref<boolean>(false)
const checkAll = ref<boolean>(false)
const isIndeterminate = ref<boolean>(false)
const allRole = ref<RoleData[]>([])
const checkedRole = ref<RoleData[]>([])

const handleCheckAllChange = (val: boolean) => {
    checkedRole.value = val ? allRole.value : []
    isIndeterminate.value = false
}

const handleCheckedRoleChange = (value: RoleData[]) => {
    const checkedCount = value.length
    checkAll.value = checkedCount === allRole.value.length
    isIndeterminate.value = checkedCount > 0 && checkedCount < allRole.value.length
}

//function for distribute button in table
const distributeRole = async (row: user) => {
    const result = await reqGetAssignedRole((row.id as number))

    if (result.code === 1) {
        allRole.value = result.data.allRoleList;
        checkedRole.value = result.data.assignedRoleList;
        userFormData.value = row;

        //check the status of select all
        handleCheckedRoleChange(checkedRole.value)

        roleDrawer.value = true
    } else {
        ElMessage.error('Fail to get role data')
    }
}

//function for save button in dialog
const saveRole = async () => {
    const data: AssignRoleRequestData = {
        userId: (userFormData.value.id as number),
        roleIds: checkedRole.value.map(role => (role.id as number))
    }

    const result = await reqAssignRole(data)

    if (result.code === 1) {
        pageQuery()
        roleDrawer.value = false
        ElMessage.success('Role assigned')
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
    overflow-y: scroll;

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