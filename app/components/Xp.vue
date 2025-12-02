<script setup lang="ts">
const { urlImage, xpText } = defineProps<{
  urlImage: string
  xpText: string
}>()
</script>

<template>
  <div class="xp">
    <NuxtImg :src="urlImage" alt="Logo" class="xp__img" />

    <div class="xp__text">
      <p>{{ xpText }}</p>
    </div>
  </div>
</template>

<style scoped>
.xp {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px 10px;
}

.xp__img {
  width: 190px;
  height: auto;
  object-fit: contain;
}

.xp__text {
  max-width: 420px;
  text-align: justify;
  font-size: 14px;
  line-height: 1.5;
}

@media screen and (max-width: 996px) {
  .xp {
    flex-direction: column;
    gap: 20px;
  }

  .xp__img {
    width: 140px;
  }
}
</style>
