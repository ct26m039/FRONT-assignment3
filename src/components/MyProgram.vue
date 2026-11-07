<script setup lang="ts">
import { useMyProgram} from "../composables/useMyProgram";
import { RouterLink } from "vue-router";

const { sessions, count, remove, conflicts } = useMyProgram();
</script>

<template>
    <RouterLink to="/">&larr; All sessions</RouterLink>
    <h1>My Program</h1>

    <div class="main-container">
        <p v-if="count === 0">Your program is empty.</p>
        <div v-for="session in sessions" :key="session.id" class="session">
            <RouterLink :to="`/sessions/${session.id}`">{{ session.title }}</RouterLink>
            <p>{{ session.abstract }}</p>
            <button @click="remove(session.id)">Remove</button>
        </div>
    </div>
    <div v-if="conflicts.length > 0" class="warning">
        <p>⚠️ Time conflicts in your program:</p>
        <ul>
            <li v-for="[a, b] in conflicts" :key="a.id + b.id">
                {{ a.title }} ↔ {{ b.title }} ({{ a.startTime }})
            </li>
        </ul>
    </div>
</template>

<style scoped>

</style>