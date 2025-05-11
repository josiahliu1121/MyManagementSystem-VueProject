<template>
    <div class="login-container">
        <el-row>
            <el-col :span="12" :xs="0"></el-col>
            <el-col :span="12" :xs="24">
                <el-form class="login-form" :model="loginForm" :rules="formRules" ref="loginFormRef">
                    <h1>Hello</h1>
                    <h2>Welcome to My Management System</h2>
                    <el-form-item prop="username">
                        <el-input v-model="loginForm.username" :prefix-icon="User" placeholder="username"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" v-model="loginForm.password" :prefix-icon="Lock" show-password
                            placeholder="password"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="login-button" type="primary" size="default" @click="submitForm()"
                            :loading="loading">Login</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import type { loginForm } from '@/api/user/type'
import { User, Lock } from '@element-plus/icons-vue';
import { useUserStore } from '@/stores/user';
import { ElNotification, type FormInstance, type FormRules } from 'element-plus';
import { useRouter } from 'vue-router';

const $userStore = useUserStore()
const $router = useRouter()
const loading = ref(false)

const loginFormRef = ref<FormInstance>()
const loginForm = reactive<loginForm>({
    username: 'admin',
    password: '123'
})
const formRules = reactive<FormRules<loginForm>>({
    username: [{ required: true, message: 'Please input username', trigger: 'blur' }],
    password: [{ required: true, message: 'Please input password', trigger: 'blur' }]
})

const submitForm = async () => {
    if (!loginFormRef.value) return
    await loginFormRef.value.validate((valid) => {
        if (valid) {
            login()
        }
    })
}

async function login() {
    try {
        loading.value = true

        await $userStore.login(loginForm)

        $router.push({ name: 'home' })

        ElNotification({
            type: 'success',
            message: 'Welcome Back'
        })
    } catch (error) {
        ElNotification({
            type: 'error',
            message: (error as Error).message
        })
    } finally {
        loading.value = false
    }
}
</script>

<style scoped lang="scss">
.login-container {
    background-image: url('@/assets/images/login_background.png');
    width: 100%;
    height: 100vh;
    background-size: cover;

    .login-form {
        position: relative;
        background-color: rgba(125, 122, 122, 0.5);
        top: 30vh;
        padding: 20px;
        width: 80%;
        margin: 0 auto;
        border-radius: 20px;
        box-shadow: 0px 0px 10px;
    }

    h1 {
        font-size: 40px;
        color: white;
    }

    h2 {
        font-size: 20px;
        color: white;
        margin: 10px 0;
    }

    .login-button {
        width: 100%;
    }

}
</style>