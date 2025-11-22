// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    runtimeConfig: {
        // clé privée (sera accessible seulement côté serveur via useRuntimeConfig())
        githubToken: process.env.GITHUB_API_KEY || "",
        gitlabToken: process.env.GITLAB_API_KEY || "",
        // tout ce qui est sous "public" sera accessible côté client et serveur
        public: {
            githubUser: process.env.NUXT_PUBLIC_GITHUB_USER || "LucWaw",
            gitlabUser: process.env.NUXT_PUBLIC_GITLAB_USER || "LBigeard",
        },
    },
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },
});
