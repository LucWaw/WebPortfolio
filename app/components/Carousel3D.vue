<template>
    <section class="portfolio_carousel">
        <div v-if="pending">Chargement...</div>
        <div v-else-if="error">Erreur de chargement</div>

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
                            :src="getPlatformLogo(repo.image)"
                            alt="Plateforme Logo"
                            v-if="getPlatformLogo(repo.image)"
                        />

                        <div class="text">
                            <h3>{{ repo.name }}</h3>

                            <ul class="commits">
                                <li
                                    v-for="(
                                        commit, cIndex
                                    ) in repo.lastFivecommitsList"
                                    :key="cIndex"
                                >
                                    <span class="date">{{
                                        formatDate(commit.date)
                                    }}</span>
                                    {{ commit.message.slice(0, 40) }}...
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
import { ref, onMounted, onUnmounted } from "vue";
// Import de ton type Repository (ajuste le chemin si besoin)
import type { Repository } from "./Repo";

// --- 1. DONNÉES ---
const {
    data: repos,
    pending,
    error,
} = await useFetch<Repository[]>("/api/repos");

// --- 2. ÉTAT DU CAROUSEL ---
const currentIndex = ref(0);
const isMobile = ref(false);

// --- 3. LOGIQUE DES CLASSES (C'est ce qui fait marcher ton CSS) ---
const getCardClass = (index: number) => {
    if (!repos.value) return "";

    const total = repos.value.length;
    // Calcul de la distance circulaire
    const offset = (index - currentIndex.value + total) % total;

    if (offset === 0) return "center";
    if (offset === 1) return "right-1";
    if (offset === total - 1) return "left-1";

    // Si pas mobile, on affiche aussi les cartes en profondeur 2
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
    currentIndex.value = index;
};

// --- 5. UTILITAIRES ---
const getPlatformLogo = (url: string) => {
    if (!url) return null;
    const lower = url.toLowerCase();
    // Assure-toi que ces images existent bien dans ton dossier public/images/
    if (lower.includes("github")) return "/images/GitHub.svg";
    if (lower.includes("gitlab")) return "/images/Gitlab.svg";
    return "/images/GitHub.svg"; // Fallback
};

// Formattage simple de la date (ex: 2025-10-12)
const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return dateStr.split("T")[0];
};

// --- 6. EVENTS (Responsive + Clavier) ---
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
/* J'ai collé ICI ton CSS original qui fonctionnait.
   J'ai juste ajouté 'scoped' pour la sécurité VueJS.
*/

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
    /* overflow: hidden; Empêche le scroll horizontal indésirable */
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
    height: 380px;
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    cursor: pointer;
    /* Important : par défaut, les cartes sont cachées si elles n'ont pas de classe positionnelle */
    opacity: 0;
    pointer-events: none;
}

.card img.bg-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* Le calque violet */
.card .calc {
    position: absolute;
    width: 100%;
    height: 100%;

    /* Changement ici : */
    background: linear-gradient(
        to bottom,
        transparent 0%,
        rgba(78, 24, 146, 0.1) 30%,
        /* Légère teinte pour casser la luminosité */ rgba(78, 24, 146, 0.8) 60%,
        /* Devient sombre juste derrière le logo */ rgba(78, 24, 146, 1) 100%
            /* Totalement opaque en bas pour le texte */
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

    /* Ajout : Ombre portée blanche/noire pour détacher le logo du fond */
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
    opacity: 0; /* Caché par défaut */
    pointer-events: none;
    transition: opacity 0.3s ease;
}

/* -- ETATS ACTIFS (Gérés par Vue via :class) -- */

/* CENTER : Carte active */
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
    font-family: Roboto, sans-serif;
    font-weight: 900;
    font-size: 26px;
    line-height: 30px;
    margin-bottom: 10px;
}

.card .commits {
    list-style: none; /* Enlève les puces */
    padding: 0;
    max-height: 150px; /* Limite la hauteur */
    overflow: hidden;
}

.card .commits li {
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
    margin-top: 60px;
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
    .card {
        width: 200px;
        height: 280px;
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
}
</style>
