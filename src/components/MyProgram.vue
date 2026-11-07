<script setup lang="ts">
import { useConferenceData } from '../composables/useConferenceData';
import {computed} from "vue";

const props = defineProps<{ id: string }>()

const { getSessionById } = useConferenceData();

const session = computed(() => getSessionById(props.id))

</script>

<template>
    <RouterLink to="/program"><button>Back to Program</button></RouterLink>

    <div class="main-container">
        <h1>My Program</h1>
        <p>Welcome to your program page.</p>
        <p>Here you can manage your conference program.</p>
        <div class="program-container">
            <div class="session">
                <h2>{{ session.title }}</h2>
                <p>{{ session.description }}</p>
            </div>
        </div>
        <p>Click the button below to add a new session to your program.</p>
        <button>Add Session</button>
        <button>Remove Session</button>
        <button>Save Program</button>
    </div>
</template>

<style scoped>

</style>