<script setup lang="ts">
import { useConferenceData } from '../composables/useConferenceData';
import { useLocalStorage } from '../composables/useLocalStorage';
import {computed} from "vue";
import {RouterLink} from "vue-router";

const {getSessionById} = useConferenceData();
const savedIds = useLocalStorage('myProgram', [] as string[]);
const sessions = computed(() => getSessionById(savedIds.value));
</script>

<template>
    <RouterLink to="/">&larr; All sessions</RouterLink>
    <h1>My Program</h1>

    <div class="main-container">
        <p v-if="sessions.length == 0">Your program is empty.</p>
        <div v-for="session in sessions" :key=session.id class="session">
            <RouterLink :to="'/session/' + session.id">{{ session.title }}</RouterLink>
            <p>{{ session.abstract }}</p>
        </div>
    </div>
</template>

<style scoped>

</style>