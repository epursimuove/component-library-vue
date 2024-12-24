<script setup lang="ts">
import { appVersion, vueVersion } from "@/utils/version.ts";

const now: number = Date.now();

const dateTimeFormatYearOnly: Intl.DateTimeFormat = new Intl.DateTimeFormat(
  "sv-SE",
  {
    timeZone: "UTC",
    year: "numeric",
  },
);

const currentYear: string = dateTimeFormatYearOnly.format(now);

const loadedTimestamp: string = new Date(now).toISOString();

const buildTimestamp: string =
  document
    .getElementById("buildTimestamp")
    ?.getAttribute("datetime")
    ?.slice(0, 16) + "Z";
</script>

<template>
  <footer>
    <div>
      <strong>NNM Vue Component Library</strong> <var>{{ appVersion }}</var>
    </div>

    <div>
      App built
      <a href="https://anders.nemonisimors.com/currentTime">
        <time>
          {{ buildTimestamp }}
        </time> </a
      >.
    </div>

    <div>
      <a href="https://github.com/epursimuove/component-library-vue"
        >Source code</a
      >
      at GitHub.
    </div>

    <div>
      Implemented with <a href="https://vuejs.org">Vue</a>&nbsp;<var>{{
        vueVersion
      }}</var
      >.
    </div>

    <div>
      Page loaded
      <a href="https://anders.nemonisimors.com/currentTime">
        <time>
          {{ loadedTimestamp }}
        </time> </a
      >.
    </div>

    <div>
      Copyright &copy; 2024-{{ currentYear }}
      <a href="https://anders.nemonisimors.com">Anders Gustafson</a>. All rights
      reserved.
    </div>

    <div>
      <a href="https://www.nemonisimors.com">
        <em>Nemo nisi mors</em>
        <img
          alt="NNM logo"
          class="logo"
          src="@/assets/LogoNNM_arcs_blue_transparent_background.svg"
          height="16"
        />
      </a>
    </div>
  </footer>
</template>

<style scoped>
footer {
  margin-block-start: 8rem;
  border-block-start: 1px solid var(--color-footer);
  font-size: 0.9rem;
  color: var(--color-footer);

  a {
    color: var(--color-footer);
  }
}
</style>
