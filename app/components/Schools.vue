<script setup lang="ts">
const { urlImage, xpText, reverse } = defineProps<{
  urlImage: string
  xpText: string
  reverse?: boolean
}>()
</script>

<template>
  <div class="school" :class="{ reverse }">
    <div class="school__image">
      <NuxtImg :src="urlImage" alt="Logo formation" />
    </div>

    <div class="school__text">
      <p>{{ xpText }}</p>
    </div>
  </div>
</template>

<style scoped>
.school {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;

  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 20px;
}

.school.reverse {
  flex-direction: row-reverse;
}

.school__image img {
  width: 190px;
  height: auto;
  object-fit: contain;
}

/* Texte */
.school__text {
  max-width: 480px;
  text-align: justify;
  font-size: 14px;
  line-height: 1.55;
}

@media screen and (max-width: 996px) {
  .school {
    flex-direction: column;
    text-align: center;
    gap: 25px;
    padding: 25px 10px;
  }

  .school.reverse {
    flex-direction: column;
  }

  .school__image img {
    width: 140px;
  }

  .school__text {
    max-width: 420px;
    font-size: 14px;
    text-align: justify;
  }
}

@media (max-width: 500px) {
  .school__image img {
    width: 120px;
  }
}
</style>
