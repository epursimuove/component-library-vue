<script setup lang="ts">
const props = defineProps<{
  loading: boolean;
}>();
</script>

<template>
  <div class="currently-loading" v-if="props.loading">LOADING...</div>
</template>

<style scoped>
.currently-loading {
  background-color: rgb(250, 250, 250, 50%);
  font-size: 3rem;

  position: absolute;
  left: 0;
  top: 0;
  height: 100vh;
  width: 100vw;

  display: flex;

  align-items: center;
  justify-content: center;
}
</style>
