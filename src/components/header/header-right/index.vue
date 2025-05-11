<template>
    <div class="container">
        <el-button icon="Refresh" circle @click="refresh()" />
        <el-button icon="FullScreen" circle @click="fullScreen()" />
        <el-button icon="Setting" circle @click="drawer = true" />
        <img :src="userStore.avatar">
        <el-dropdown>
            <span class="el-dropdown-link">
                {{ userStore.username }}
                <el-icon class="el-icon--right">
                    <arrow-down />
                </el-icon>
            </span>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item @click="logOut()">Log out</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>

    <!--setting drawer-->
    <el-drawer v-model="drawer">
        <template #header>
            <h4>Setting</h4>
        </template>
        <template #default>
            <el-form>
                <el-form-item label="Primary color">
                    <el-color-picker v-model="color" show-alpha :predefine="predefineColors"
                        @change="changePrimaryColor()" />
                </el-form-item>
                <el-form-item label="Dark mode">
                    <el-switch v-model="darkMode" class="mt-2" style="margin-left: 24px" inline-prompt
                        active-icon="Moon" inactive-icon="Sunny" size="large" @change="enableDarkMode()" />
                </el-form-item>
            </el-form>
        </template>
    </el-drawer>
</template>

<script lang="ts" setup>
import { useAsideSettingStore } from '@/stores/asideSetting';
const asideSettingStore = useAsideSettingStore()

const refresh = () => {
    asideSettingStore.refresh = !asideSettingStore.refresh
}

const fullScreen = () => {
    //return true if it is full screen and false if not
    const full = document.fullscreenElement
    if (!full) {
        document.documentElement.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
}

//read user info to display
import { useUserStore } from '@/stores/user';
import { ref } from 'vue';
const userStore = useUserStore()

//log out function
import { useRouter } from 'vue-router';
const $router = useRouter()
const logOut = () => {
    userStore.logOut()
    $router.push({ name: 'login' })
}

//variables and functions for setting drawer
const drawer = ref<boolean>(false)
const color = ref('#409eff')
const predefineColors = ref([
    '#ff4500',
    '#ff8c00',
    '#ffd700',
    '#90ee90',
    '#00ced1',
    '#1e90ff',
    '#c71585',
    'rgba(255, 69, 0, 0.68)',
    'rgb(255, 120, 0)',
    'hsv(51, 100, 98)',
    'hsva(120, 40, 94, 0.5)',
    'hsl(181, 100%, 37%)',
    'hsla(209, 100%, 56%, 0.73)',
    '#c7158577',
])
const darkMode = ref<boolean>(false)

//function for switch
const enableDarkMode = () => {
    //get html
    const html = document.documentElement;
    //give html class name 'dark'
    darkMode.value ? html.className = 'dark' : html.className = '';
}

//function for color picker
const changePrimaryColor = () => {
    // Target the root HTML element
    const el = document.documentElement;

    // Set new primary color
    el.style.setProperty('--el-color-primary', color.value);

};
</script>

<style scoped lang="scss">
.container {
    margin: 0 10px;
    display: flex;
    align-items: center;

    img {
        width: 24px;
        height: 24px;
        margin: 0 10px;
        border-radius: 50%;
        border: 1px solid;
    }
}
</style>