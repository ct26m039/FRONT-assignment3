<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
    <RouterView />
</template>

<style scoped>
    h1 {
        font-size: 2em;
        color: #850c54;
        text-align: center;
    }

    h2 {
        color: #2d2d2d;
    }

    .app-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #dedede;
    }

    .conference-list-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #dedede;
    }
</style>