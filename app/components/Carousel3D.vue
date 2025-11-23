<template>
    <section class="portfolio_carousel">
        <div v-if="error">Erreur de chargement</div>

        <div v-else-if="pending || !repos">Chargement...</div>
        <div v-else class="carousel-container">
            <button class="nav-arrow left" @click="prev">‹</button>

            <div class="carousel-track">
                <div
                    v-for="(repo, i) in repos"
                    :key="repo.name"
                    class="card"
                    :class="getCardClass(i)"
                    @click="goTo(i)"
                >
                    <div class="calc"></div>

                    <div class="infos">
                        <img
                            class="logo_gitplatform"
                            :src="getPlatformLogo(repo.isGitHub)"
                            alt="Plateforme Logo"
                            v-if="getPlatformLogo(repo.isGitHub)"
                        />

                        <div class="text">
                            <h3>{{ truncate(repo.name, 16) }}</h3>

                            <ul class="commits">
                                <li
                                    v-for="(commit, cIndex) in getFiveCommits(
                                        repo.lastFivecommitsList
                                    )"
                                    :key="cIndex"
                                    :class="{ empty: !commit }"
                                >
                                    <span class="date" v-if="commit">
                                        {{ formatDate(commit.date) }}
                                    </span>
                                    {{
                                        commit
                                            ? truncate(commit.message, 40)
                                            : ""
                                    }}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <img :src="repo.image" :alt="repo.name" class="bg-img" />
                </div>
            </div>

            <button class="nav-arrow right" @click="next">›</button>
        </div>

        <div v-if="repos && repos.length" class="dots">
            <div
                class="dot"
                v-for="(_, i) in repos"
                :key="i"
                :class="{ active: i === currentIndex }"
                @click="goTo(i)"
            ></div>
        </div>
    </section>
</template>

<script setup lang="ts">
function truncate(text: string, limit: number): string {
    if (!text) return "";
    return text.length > limit ? text.slice(0, limit) + "..." : text;
}

import { ref, onMounted, onUnmounted } from "vue";

// --- 1. Data ---
const {
    data: repos,
    pending,
    error,
} = useFetch<Repository[]>("/api/reposGits", {
    key: "reposGits-data",
    lazy: true,
    server: false,
});

// --- 2. Carousel State ---
const currentIndex = ref(0);
const isMobile = ref(false);

// --- 3. Class Logic ---
const getCardClass = (index: number) => {
    if (!repos.value) return "";

    const total = repos.value.length;
    // Circular offset calculation
    const offset = (index - currentIndex.value + total) % total;

    if (offset === 0) return "center";
    if (offset === 1) return "right-1";
    if (offset === total - 1) return "left-1";

    // If not mobile, also show cards at depth 2
    if (!isMobile.value) {
        if (offset === 2) return "right-2";
        if (offset === total - 2) return "left-2";
    }

    return "hidden";
};

// --- 4. NAVIGATION ---
const next = () => {
    if (!repos.value) return;
    currentIndex.value = (currentIndex.value + 1) % repos.value.length;
};

const prev = () => {
    if (!repos.value) return;
    const total = repos.value.length;
    currentIndex.value = (currentIndex.value - 1 + total) % total;
};

const goTo = (index: number) => {
    console.log("Go to index:", index);
    if (index == currentIndex.value) {
        // Guard access to repos.value and the repo's url
        const repo = repos.value?.[index];
        const url = repo?.url;
        if (url) {
            window.open(url, "_blank");
        } else {
            // URL or repo not available
            console.warn("Repository URL is not available for index", index);
        }
        return;
    }
    if (!repos.value) return;
    currentIndex.value = index;
};

// --- 5. Utilitaries ---
const getPlatformLogo = (isGithub: boolean): string => {
    if (isGithub) return "/images/GitHub.svg";
    else return "/images/GitLab.svg";
};

const getFiveCommits = (commits: Array<any>) => {
    const result = [...commits];
    while (result.length < 5) {
        result.push(null);
    }
    return result.slice(0, 5);
};

// Simple date formatting (e.g., 2025-10-12)
const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return dateStr.split("T")[0];
};

// --- 6. EVENTS (Responsive + Keyboard) ---
const checkMobile = () => {
    if (typeof window !== "undefined") {
        isMobile.value = window.innerWidth <= 996;
    }
};

const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
};

onMounted(() => {
    checkMobile();
    window.addEventListener("resize", checkMobile);
    document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
    window.removeEventListener("resize", checkMobile);
    document.removeEventListener("keydown", handleKeydown);
});
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
        sans-serif;
}

.portfolio_carousel {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
}

.carousel-container {
    width: 100%;
    max-width: 1200px;
    height: 450px;
    position: relative;
    perspective: 1000px;
    margin-top: 80px;
}

.carousel-track {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.card {
    position: absolute;
    width: 280px;
    height: 500px;
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    cursor: pointer;
    opacity: 0;
}

.card img.bg-img {
    object-position: top center;
    height: calc(100% + 25px);
    transform: translateY(-25px);
    width: 100%;
    object-fit: cover;
    transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.card .calc {
    position: absolute;
    width: 100%;
    height: 100%;

    /* Changement ici : */
    background: linear-gradient(
        to bottom,
        transparent 0%,
        rgba(78, 24, 146, 0.1) 30%,
        rgba(78, 24, 146, 0.8) 60%,
        rgba(78, 24, 146, 1) 100%
    );

    display: none;
    z-index: 20;
    pointer-events: none;
}

.card .logo_gitplatform {
    width: 40px;
    height: 40px;
    margin-bottom: 12px;
    z-index: 45;

    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
}

.card .infos {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: end;
    z-index: 40;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
}

.card.center {
    z-index: 10;
    transform: scale(1.1) translateZ(0);
    opacity: 1; /* Force l'affichage */
    pointer-events: auto;
}

.card.center .infos {
    opacity: 1; /* Affiche le texte */
    pointer-events: auto;
}

.card.center .calc {
    display: block; /* Affiche le dégradé violet */
}

.card.center .bg-img {
    filter: none;
}

.card.center .text {
    opacity: 1;
}

/* LEFT 1 */
.card.left-1 {
    z-index: 5;
    transform: translateX(-200px) scale(0.9) translateZ(-100px);
    opacity: 0.9;
}
.card.left-1 .bg-img {
    filter: grayscale(30%);
}

/* RIGHT 1 */
.card.right-1 {
    z-index: 5;
    transform: translateX(200px) scale(0.9) translateZ(-100px);
    opacity: 0.9;
}
.card.right-1 .bg-img {
    filter: grayscale(30%);
}

/* LEFT 2 */
.card.left-2 {
    z-index: 1;
    transform: translateX(-400px) scale(0.8) translateZ(-300px);
    opacity: 0.7;
}
.card.left-2 .bg-img {
    filter: grayscale(30%);
}

/* RIGHT 2 */
.card.right-2 {
    z-index: 1;
    transform: translateX(400px) scale(0.8) translateZ(-300px);
    opacity: 0.7;
}
.card.right-2 .bg-img {
    filter: grayscale(30%);
}

/* HIDDEN */
.card.hidden {
    opacity: 0;
    pointer-events: none;
}

/* -- TYPOGRAPHIE INTERNE -- */
.card .text {
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: end;
}

.card .text h3 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1; /* number of lines to show */
    line-clamp: 1;
    word-break: break-all;
    -webkit-box-orient: vertical;
    font-family: Roboto, sans-serif;
    font-weight: 900;
    font-size: 26px;
    line-height: 30px;
    margin-bottom: 10px;
    overflow: hidden;
}

.card .commits {
    list-style: none; /* Enlève les puces */
    padding: 0;
    max-height: 150px; /* Limite la hauteur */
    overflow: hidden;
}

.card .commits li {
    min-height: 18px;

    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1; /* number of lines to show */
    line-clamp: 1;
    -webkit-box-orient: vertical;
    word-break: break-all;
    font-family: Roboto, sans-serif;
    font-weight: 300;
    font-size: 12px; /* Un peu plus petit pour les commits */
    line-height: 1.4;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 4px;
}

.card .commits .date {
    font-weight: bold;
    color: #dcdcdc;
    margin-right: 5px;
}

/* -- NAVIGATION DOTS -- */
.dots {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 100px;
    padding-bottom: 5px;
}

.dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(8, 42, 123, 0.2);
    cursor: pointer;
    transition: all 0.3s ease;
}

.dot.active {
    background: rgb(8, 42, 123);
    transform: scale(1.2);
}

/* -- ARROWS -- */
.nav-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(8, 42, 123, 0.6);
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 20;
    transition: all 0.3s ease;
    font-size: 1.5rem;
    border: none;
    outline: none;
    padding-bottom: 4px;
}

.nav-arrow:hover {
    background: rgba(0, 0, 0, 0.8);
    transform: translateY(-50%) scale(1.1);
}
.nav-arrow.left {
    left: 20px;
    padding-right: 3px;
}
.nav-arrow.right {
    right: 20px;
    padding-left: 3px;
}

/* -- MEDIA QUERIES -- */
@media (max-width: 996px) {
    .carousel-container {
        width: 100%;
        max-width: 1200px;
        height: 450px;
        position: relative;
        perspective: 1000px;
        margin-top: 0px;
    }

    .card {
        width: 200px;
        height: 280px;
    }

    .card .text h3 {
        font-size: 20px;
        line-height: 24px;
    }
    .card .commits li {
        font-size: 10px;
    }

    .card.left-2 {
        transform: translateX(-250px) scale(0.8) translateZ(-300px);
    }
    .card.left-1 {
        transform: translateX(-120px) scale(0.9) translateZ(-100px);
    }
    .card.right-1 {
        transform: translateX(120px) scale(0.9) translateZ(-100px);
    }
    .card.right-2 {
        transform: translateX(250px) scale(0.8) translateZ(-300px);
    }

    .dots {
        /* separate the dots in two groups one on top of the other */
        width: 90%;
        flex-wrap: wrap;
        gap: 15px;
        margin-top: 0px;
    }

    .nav-arrow {
        background: rgba(8, 42, 123, 0.8);
    }
}
</style>
