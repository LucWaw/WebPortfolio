<script setup lang="ts">
const { urlImage, xpText } = defineProps<{ urlImage: string, xpText: string }>()
</script>

<template>
  <NuxtImg :src="urlImage" alt="Logo entreprise" />
  <p>{{ xpText }}</p>
</template>
