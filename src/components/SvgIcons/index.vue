<template>
    <svg :style="{ width, height }">
        <use :xlink:href="prefix + name" :fill="color"></use>
    </svg>
</template>

<script lang="ts" setup>
defineProps({
    prefix: {
        type: String,
        default: '#icon-'
    },
    name: String,
    color: {
        type: String,
        default: ''
    },
    width: {
        type: String,
        default: '16px'
    },
    height: {
        type: String,
        default: '16px'
    }
})
</script>