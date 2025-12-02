<script setup lang="ts">
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
</script>

<template>
  <ArrayOfCards :repos="repos" />
</template>
