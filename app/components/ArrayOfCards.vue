<script setup lang="ts">
const props = defineProps<{ repos: Repository[] }>()
</script>

<template>
  <div class="container">
    <ListOfCards :repos="props.repos" />
  </div>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
}
</style>
