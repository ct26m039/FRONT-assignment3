<script setup lang="ts">
import ConferenceList from "./components/ConferenceList.vue";
</script>

<template>
    <div class="app-container">
        <h1>VibeConnect - Conference App</h1>
        <div class="conference-list-container">
            <h2>Conferences</h2>
            <ConferenceList />
        </div>
    </div>
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