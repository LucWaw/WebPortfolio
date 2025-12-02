<script setup lang="ts">
import { Tabs } from '@ark-ui/vue/tabs'

const value = ref('experiences')
</script>

<template>
  <Tabs.Root v-model="value" class="root">
    <Tabs.List class="header">
      <Tabs.Trigger class="headers" value="experiences">
        Expériences
      </Tabs.Trigger>
      <Tabs.Trigger class="headers" value="formations">
        Formations
      </Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content class="contents" value="experiences">
      <div class="xp-grid">
        <Xp
          url-image="/images/Numeriwan.png"
          xp-text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud id exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim est laborum."
        />
        <hr class="verticalhr">
        <Xp
          url-image="/images/CATS.png"
          xp-text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud id exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim est laborum."
        />
      </div>
    </Tabs.Content>

    <Tabs.Content value="formations">
      <Schools
        url-image="/images/NantesUniv.png"
        xp-text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud id exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim est laborum."
      />

      <hr class="horizontalhr">

      <Schools
        url-image="/images/OpenClassrooms.png"
        xp-text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud id exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim est laborum."
        :reverse="true"
      />
    </Tabs.Content>
  </Tabs.Root>
</template>

<style scoped>
.root {
  font-size: 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.header {
  display: flex;
  gap: 24px;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
}

.headers {
  position: relative;
  background: none;
  color: inherit;
  border: none;
  padding: 8px 12px;
  font: inherit;
  cursor: pointer;
  outline: none;
  transition:
    color 0.15s ease,
    font-weight 0.15s ease;
  font-weight: 500;
  letter-spacing: 0.2px;
}

.headers[data-state='active']::after,
.headers[aria-selected='true']::after {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -8px;
  width: 36px;
  height: 3px;
  border-radius: 2px;
  background-color: #0b61ff;
  transition:
    width 0.18s ease,
    opacity 0.18s ease;
  opacity: 1;
}

/* fallback : make active text bold and slightly darker */
.headers[data-state='active'],
.headers[aria-selected='true'] {
  font-weight: 700;
  color: #062a78; /* couleur légèrement plus marquée */
}

/* hide the pseudo-element for inactive tabs */
.headers::after {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -8px;
  width: 0;
  height: 3px;
  border-radius: 2px;
  background-color: #0b61ff;
  opacity: 0;
  transition:
    width 0.18s ease,
    opacity 0.18s ease;
}

/* hover: animate a small glimpse of the line */
.headers:hover::after {
  width: 20px;
  opacity: 0.4;
}

.xp-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: stretch;
  gap: 40px;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
}

.horizontalhr {
  margin: auto;
  width: 450px;
}

.verticalhr {
  margin: auto;
  width: 1px;
  height: 200px;
}
@media screen and (max-width: 996px) {
  .xp-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .horizontalhr {
    display: none;
  }

  .verticalhr {
    display: none;
  }

  .header {
    gap: 12px;
  }
  .headers {
    padding: 6px 8px;
    font-size: 18px;
  }
  .headers[data-state='active']::after,
  .headers[aria-selected='true']::after {
    width: 28px;
    bottom: -6px;
  }
}
</style>
