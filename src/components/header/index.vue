<template>
    <div class="header">
        <headerLeft></headerLeft>
        <headerRight></headerRight>
    </div>
</template>

<script lang="ts" setup>
import headerLeft from './header-left/index.vue'
import headerRight from './header-right/index.vue'
</script>

<style scoped lang="scss">
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}
</style>