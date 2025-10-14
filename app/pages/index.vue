<script setup lang="ts">
const config = useRuntimeConfig();
const githubUser = config.public.githubUser; // accessible côté client

const { data: repos, pending, error } = await useFetch("/api/github/repos"); // appel au backend
</script>

<template>
    <main>
        <h1>Dépôts publics de {{ githubUser }}</h1>

        <div v-if="pending">Chargement…</div>
        <div v-else-if="error">Erreur: {{ error.message || error }}</div>
        <ul v-else>
            <li v-for="r in repos" :key="r.name">
                <a
                    :href="r.html_url"
                    target="_blank"
                    rel="noopener noreferrer"
                    >{{ r.name }}</a
                >
            </li>
        </ul>
    </main>
</template>
