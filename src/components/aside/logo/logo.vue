<template>
    <div class="logo_container">
        <img src="@/assets/images/logo.png">
        <h1>Management System</h1>
    </div>
</template>

<style scoped lang="scss">
.logo_container {
    display: flex;
    align-items: center;
    height: $logo-height;
    margin: 10px auto;

    img {
        width: 50px;
        height: 50px;
        margin: 0 5px;
    }

    h1 {
        font-size: 20px;
        color: white;
        font-weight: bold;
    }
}
</style>