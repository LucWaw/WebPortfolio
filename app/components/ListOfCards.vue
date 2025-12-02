<script setup lang="ts">
const props = defineProps<{ repos: Repository[] }>()
function truncate(text: string, limit: number): string {
  if (!text)
    return ''
  return text.length > limit ? `${text.slice(0, limit)}...` : text
}

function getFiveCommits(commits?: RepositoryCommit[]) {
  const list = commits ? [...commits] : []

  while (list.length < 5) {
    list.push({
      id: '',
      message: '',
      date: '',
    } as RepositoryCommit)
  }

  return list.slice(0, 5)
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

// Simple date formatting (e.g., 15/02/2025)
function formatDate(dateStr: string) {
  if (!dateStr)
    return ''
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('fr-FR').format(date)
}
</script>

<template>
  <div
    v-for="(repo) in props.repos"
    :key="repo.name"
    class="card"
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

.card {
  position: relative;
  width: 280px;
  height: 500px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  cursor: pointer;
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
</style>
