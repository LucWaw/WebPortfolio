<template>
  <header>
    <div class="left">
      <NuxtLink to="/" class="button_base">
        Lucas Bigeard
      </NuxtLink>
    </div>

    <div class="nav">
      <ul>
        <li>
          <NuxtLink
            :to="{ path: '/', hash: '#about' }"
            class="button_page"
          >
            À propos
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/portfolio" class="button_page">
            Projets par technologies
          </NuxtLink>
        </li>
      </ul>
    </div>
    <div class="right" />
  </header>
</template>

<style scoped>
header {
  --_animationStartsAfter: 10vh;
  --_animationDistance: 300px;
  --_surfaceColorStart: var(--background, #fff);
  --_surfaceColorEnd: rgba(255, 255, 255, 0.8);

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 44px 40px;
  border-bottom: solid #cdd5df 1px;
  border-radius: 0 0 20px 20px;
  background-color: var(--_surfaceColorStart);

  position: sticky;
  top: 0;
  z-index: 1000;
  margin-inline: auto;
  width: 100%;

  @supports (animation-timeline: view()) {
    animation: stickyNav linear forwards;
    animation-timeline: scroll();
    animation-range-start: var(--_animationStartsAfter);
    animation-range-end: calc(var(--_animationStartsAfter) + var(--_animationDistance));
  }
}

header .left,
header .right {
  width: 224px;
  flex-shrink: 0;
  @supports (animation-timeline: view()) {
    animation: collapseItem linear forwards;
    animation-timeline: scroll();
    animation-range-start: var(--_animationStartsAfter);
    animation-range-end: calc(var(--_animationStartsAfter) + var(--_animationDistance));
  }
}

header .right {
  width: 224px;
}

@keyframes stickyNav {
  to {
    top: 1rem;
    width: fit-content;
    padding: 1rem 3rem;
    border-radius: 100vw;
    background-color: var(--_surfaceColorEnd);
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
  }
}

@keyframes collapseItem {
  to {
    opacity: 0;
    width: 0;
    margin: 0;
    overflow: hidden;
    transform: scale(0.8);
  }
}

.button_base {
  font-family: Roboto;
  font-style: normal;
  font-weight: 900;
  font-size: 35px;
  line-height: 30px;
  color: var(--blue-1);
  text-decoration: none;
  margin: 0;
  white-space: nowrap;
}

.nav {
  font-family: Roboto, sans-serif;
  font-weight: 500;
  font-size: 28px;
}

.nav > ul {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 60px;
  padding: 0;
  margin: 0;
}

.button_page {
  color: inherit;
  text-decoration: none;
  position: relative;
  display: inline-block;
  white-space: nowrap;
}

.button_page:hover {
  text-decoration: underline;
}

@media screen and (max-width: 996px) {
  header {
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 20px;
    animation: none;
  }

  header .left,
  header .right {
    animation: none;
    width: 100%;
    opacity: 1;
  }

  header .left {
    text-align: center;
  }

  header .right {
    display: none;
  }

  header .nav > ul {
    gap: 10px;
    font-size: 20px;
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
