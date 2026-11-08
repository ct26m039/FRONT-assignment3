<script setup lang="ts">
import { RouterLink } from 'vue-router';
import conferences from '../assets/data/conference-data.json';

const sessions = conferences.sessions;
</script>

<template>
    <div>
        <RouterLink to="/program">Your Program</RouterLink>
    </div>
    <div>
        <ul>
            <li v-for="session in sessions" :key="session.id">
                <RouterLink :to="`/sessions/${session.id}`">{{ session.title }}</RouterLink>
            </li>
        </ul>
    </div>
</template>

<style scoped>
    li {
        list-style-type: none;
        margin: 10px;
        color: #2d2d2d;
    }
</style>