<script setup lang="ts">
const config = useRuntimeConfig();
const githubUser = config.public.githubUser; // accessible côté client
const gitlabUser = config.public.gitlabUser; // accessible côté client

const { data: repos, pending, error } = await useFetch("/api/repos"); // appel au backend
</script>

<template>
    <main class="repos">
        <h1>Dépôts publics de {{ githubUser }} et {{ gitlabUser }}</h1>

        <div v-if="pending">Chargement…</div>
        <div v-else-if="error">Erreur: {{ error.message || error }}</div>

        <ul v-else class="repo-list">
            <li v-for="r in repos" :key="r.name" class="repo-card">
                <!-- Nom -->
                <h2 class="repo-title">{{ r.name }}</h2>

                <!-- Image du repo -->
                <div v-if="r.image" class="repo-image">
                    <img :src="r.image" :alt="`Image du projet ${r.name}`" />
                </div>

                <!-- Langages -->
                <div
                    class="repo-languages"
                    v-if="r.languages && r.languages.length"
                >
                    <h3>Langages :</h3>
                    <ul>
                        <li v-for="lang in r.languages" :key="lang">
                            {{ lang }}
                        </li>
                    </ul>
                </div>

                <!-- 5 derniers commits -->
                <div class="repo-commits" v-if="r.lastFivecommitsList?.length">
                    <h3>5 derniers commits :</h3>
                    <ul>
                        <li
                            v-for="c in r.lastFivecommitsList"
                            :key="c.date + c.message"
                        >
                            <strong
                                >{{
                                    new Date(c.date).toLocaleString()
                                }}
                                :</strong
                            >
                            {{ c.message.slice(0, 20)
                            }}{{ c.message.length > 20 ? "…" : "" }}
                        </li>
                    </ul>
                </div>
            </li>
        </ul>
    </main>
</template>

<style scoped>
.repos {
    max-width: 900px;
    margin: auto;
    padding: 2rem;
}

.repo-list {
    list-style: none;
    padding: 0;
    display: grid;
    gap: 2rem;
}

.repo-card {
    border: 1px solid #ddd;
    padding: 1.5rem;
    border-radius: 8px;
}

.repo-image img {
    width: 120px;
    height: auto;
    border-radius: 6px;
    object-fit: cover;
}

.repo-title {
    margin-bottom: 0.5rem;
}

.repo-languages ul,
.repo-commits ul {
    padding-left: 20px;
}
</style>
