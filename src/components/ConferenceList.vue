<script setup lang="ts">
import conferences from '../assets/data/conference-data.json';

const sessions = conferences.sessions;
</script>

<template>
    <div>
        <ul>
            <li v-for="session in sessions" :key="session.id">
                {{ session.title }}
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