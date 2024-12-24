<script setup lang="ts">
import {
  appName,
  appVersion,
  piniaVersion,
  vueRouterVersion,
  vueVersion,
} from "@/utils/version.ts";
</script>

<template>
  <div class="version-info">
    <h1>Version information</h1>

    <dl>
      <dt>App: {{ appName }}</dt>
      <dd>
        <var>{{ appVersion }}</var>
      </dd>

      <dt>Vue</dt>
      <dd>
        <var>{{ vueVersion }}</var>
      </dd>

      <dt>Vue router</dt>
      <dd>
        <var>{{ vueRouterVersion }}</var>
      </dd>

      <dt>Pinia</dt>
      <dd>
        <var>{{ piniaVersion }}</var>
      </dd>
    </dl>

    <div>
      App: {{ appName }} <var>{{ appVersion }}</var>
    </div>
    <div>
      Vue: <var>{{ vueVersion }}</var>
    </div>
    <div>
      Vue router: <var>{{ vueRouterVersion }}</var>
    </div>
    <div>
      Pinia: <var>{{ piniaVersion }}</var>
    </div>
  </div>
</template>

<style scoped>
.version-info {
  background-color: lightgoldenrodyellow;

  h1 {
    font-size: 1.05rem;
    font-weight: bold;
  }
}
</style>
