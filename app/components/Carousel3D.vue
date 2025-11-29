<script setup lang="ts">
import { computed, ref } from 'vue'

function truncate(text: string, limit: number): string {
  if (!text)
    return ''
  return text.length > limit ? `${text.slice(0, limit)}...` : text
}

// --- 1. Data ---

const {
  data: githubRepos,
  status: githubStatus,
  error: githubError,
} = useAsyncData<Repository[]>('github-repos', async () => {
  const res = await $fetch('/api/github-repos')
  return res.data
})

const {
  data: gitlabRepos,
  status: gitlabStatus,
  error: gitlabError,
} = useAsyncData<Repository[]>('gitlab-repos', async () => {
  const res = await $fetch('/api/gitlab-repos')
  return res.data
})

const repos = computed(() => {
  const allRepos = ([] as Repository[]).concat(gitlabRepos.value ?? [], githubRepos.value ?? [])
  return allRepos
})

// --- 2. Carousel State ---
const currentIndex = ref(0)

// --- 3. Class Logic ---
function getCardClass(index: number) {
  if (!repos.value)
    return ''

  const total = repos.value.length
  const offset = (index - currentIndex.value + total) % total

  if (offset === 0)
    return 'center'
  if (offset === 1)
    return 'right-1'
  if (offset === total - 1)
    return 'left-1'
  if (offset === 2)
    return 'right-2'
  if (offset === total - 2)
    return 'left-2'

  return 'hidden'
}

// --- 4. NAVIGATION ---
function next() {
  if (!repos.value)
    return
  currentIndex.value = (currentIndex.value + 1) % repos.value.length
}

function prev() {
  if (!repos.value)
    return
  const total = repos.value.length
  currentIndex.value = (currentIndex.value - 1 + total) % total
}

function goTo(index: number) {
  if (!repos.value)
    return
  currentIndex.value = index
}

function openRepo(url?: string) {
  if (url) {
    window.open(url, '_blank')
  }
}

function getPlatformLogo(provider: string): string {
  if (provider === 'GitHub')
    return '/images/GitHub.svg'
  if (provider === 'GitLab')
    return '/images/GitLab.svg'
  return ''
}

function getFiveCommits(commits?: RepositoryCommit[]) {
  const result = [...(commits || [])]
  return result.slice(0, 5)
}

// Simple date formatting (e.g., 15/02/2025)
function formatDate(dateStr: string) {
  if (!dateStr)
    return ''
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('fr-FR').format(date)
}

onKeyStroke('ArrowLeft', () => {
  prev()
})

onKeyStroke('ArrowRight', () => {
  next()
})
</script>

<template>
  <section class="portfolio_carousel">
    <div v-if="githubError || gitlabError">
      Erreur de chargement
    </div>

    <div v-else-if="githubStatus === 'pending' || gitlabStatus === 'pending' || !repos">
      Chargement...
    </div>
    <div v-else class="carousel-container">
      <button class="nav-arrow left" @click="prev">
        ‹
      </button>

      <div class="carousel-track">
        <div
          v-for="(repo, i) in repos"
          :key="repo.name"
          class="card"
          :class="getCardClass(i)"
          @click="goTo(i)"
        >
          <div class="calc" />

          <div class="infos">
            <NuxtImg
              v-if="getPlatformLogo(repo.provider)"
              class="logo_gitplatform"
              :src="getPlatformLogo(repo.provider)"
              alt="Plateforme Logo"
            />
            <button class="open-btn" @click.stop="openRepo(repo.url)">
              Voir le dépôt
            </button>
            <div class="text">
              <h3>{{ truncate(repo.name, 16) }}</h3>

              <ul class="commits">
                <li
                  v-for="commit in getFiveCommits(
                    repo.lastFivecommitsList,
                  )"
                  :key="commit.id"
                  :class="{ empty: !commit }"
                >
                  <span v-if="commit" class="date">
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

          <NuxtImg
            :src="repo.image"
            :alt="repo.name"
            class="bg-img"
          />
        </div>
      </div>

      <button class="nav-arrow right" @click="next">
        ›
      </button>
    </div>

    <div v-if="repos && repos.length" class="dots">
      <div
        v-for="(_, i) in repos"
        :key="i"
        class="dot"
        :class="{ active: i === currentIndex }"
        @click="goTo(i)"
      />
    </div>
  </section>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
* .open-btn {
  background: rgba(255, 255, 255, 0.95);
  border: none;
  color: #222;
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 8px;
  margin-bottom: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.25s ease;
  align-self: start;
}

.open-btn:hover {
  background: white;
  transform: scale(1.05);
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
  pointer-events: none;
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
  pointer-events: auto;
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
  opacity: 1;
  pointer-events: auto;
  cursor: default;
}

.card.center .infos {
  opacity: 1;
  pointer-events: auto;
}

.card.center .calc {
  display: block;
}

.card.center .bg-img {
  filter: none;
}

.card.center .text {
  opacity: 1;
}

.card.left-1 {
  z-index: 5;
  transform: translateX(-200px) scale(0.9) translateZ(-100px);
  opacity: 0.9;
}
.card.left-1 .bg-img {
  filter: grayscale(30%);
}

.card.right-1 {
  z-index: 5;
  transform: translateX(200px) scale(0.9) translateZ(-100px);
  opacity: 0.9;
}
.card.right-1 .bg-img {
  filter: grayscale(30%);
}

.card.left-2 {
  z-index: 1;
  transform: translateX(-400px) scale(0.8) translateZ(-300px);
  opacity: 0.7;
}
.card.left-2 .bg-img {
  filter: grayscale(30%);
}

.card.right-2 {
  z-index: 1;
  transform: translateX(400px) scale(0.8) translateZ(-300px);
  opacity: 0.7;
}
.card.right-2 .bg-img {
  filter: grayscale(30%);
}

.card.hidden {
  opacity: 0;
  pointer-events: none;
}

.card .text {
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: end;
}

.card .text h3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
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
  list-style: none;
  padding: 0;
  max-height: 150px;
  overflow: hidden;
}

.card .commits li {
  min-height: 18px;

  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  word-break: break-all;
  font-family: Roboto, sans-serif;
  font-weight: 300;
  font-size: 12px;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 4px;
}

.card .commits .date {
  font-weight: bold;
  color: #dcdcdc;
  margin-right: 5px;
}

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

@media screen and (max-width: 996px) {
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
