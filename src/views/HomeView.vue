<script setup lang="ts"></script>

<template>
  <h1>NNM Vue Component Library</h1>

  <p>
    Welcome to this playground for coming up with ideas of nice-to-have and
    easy-to-work-with components and convenience tools created with Vue. The
    <a href="https://github.com/epursimuove/component-library-vue"
      >source code</a
    >
    can be found at GitHub.
  </p>

  <p>
    The first embryo of this component library saw the light in December 2024.
    Currently the following components and tools can be found:
  </p>

  <ul>
    <li>
      <RouterLink :to="{ name: 'Tabular Data' }">Tabular Data</RouterLink>,
      beautiful tables with sorting, pagination, aggregation and sticky columns.
      Great for displaying, comparing and analysing structured data.
    </li>

    <li>
      <RouterLink :to="{ name: 'List Manager' }">List Manager</RouterLink>,
      automagically creating tables with sorting, pagination, aggregation and
      sticky columns from any list of JSON objects.
    </li>
  </ul>

  <p>Keeping it simple!</p>
</template>
