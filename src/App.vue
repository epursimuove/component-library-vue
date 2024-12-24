<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import TheFooter from "@/components/TheFooter.vue";
</script>

<template>
  <header>
    <RouterLink :to="{ name: 'Home' }">
      <img
        alt="NNM logo"
        class="logo"
        src="@/assets/LogoNNM_arcs_blue_transparent_background.svg"
        height="32"
      />
    </RouterLink>

    <div class="wrapper">
      <nav>
        <RouterLink :to="{ name: 'Home' }">Home</RouterLink>
        <RouterLink :to="{ name: 'Tabular Data' }">Tabular Data</RouterLink>
        <RouterLink :to="{ name: 'About' }">About</RouterLink>
      </nav>
    </div>
  </header>

  <main>
    <RouterView />
  </main>

  <footer>
    <TheFooter />
  </footer>
</template>

<style scoped>
header {
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.logo {
  display: block;
}

nav {
  & a {
    display: inline-block;
    padding: 0 1rem;
    border-left: 1px solid var(--color-border);

    &:first-of-type {
      border: 0;
      padding-inline-start: 0;
    }

    &.router-link-exact-active {
      color: var(--color-text);
    }

    &.router-link-exact-active:hover {
      background-color: transparent;
    }
  }
}
</style>
