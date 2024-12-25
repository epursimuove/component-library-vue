<script setup lang="ts">
import {
  createDummyNumberList,
  createDummyUserList,
  dummyConfigurationList,
  dummyTabularData,
} from "@/utils/tabularData.ts";
import AutomaticTable from "@/components/tabularData/AutomaticTable.vue";
import { ref, type Ref } from "vue";
import type { RowItem } from "@/types/type.ts";

const theList: Ref<RowItem[]> = ref(dummyTabularData);

const theConfigurationList: Ref<RowItem[]> = ref(dummyConfigurationList);

const dummyListOfNumbers: Ref<RowItem[]> = ref(createDummyNumberList());

const reorderList = () => {
  const randomIndex: number = Math.floor(
    Math.random() * dummyTabularData.length,
  );
  theList.value = dummyTabularData.slice(randomIndex);
};
</script>

<template>
  <h1>Tabular data</h1>

  <AutomaticTable :list="theConfigurationList" />

  <button @click="reorderList">Create new original list from parent</button>

  <AutomaticTable
    :list="theList"
    :caption="`Dummy list of ${theList.length} hardcoded users`"
  />

  <AutomaticTable
    :list="dummyListOfNumbers"
    :caption="`Dummy list of ${dummyListOfNumbers.length} numbers`"
  />

  <AutomaticTable
    :list="createDummyNumberList(500)"
    caption="Dummy list of first 500 numbers"
  />

  <AutomaticTable
    :list="createDummyUserList()"
    :caption="`Dummy list of randomly created users`"
  />

  <AutomaticTable
    :list="[
      { countryName: 'Sweden', countryCode: 'SE' },
      { countryName: 'Finland', countryCode: 'FI' },
      { countryName: 'Norway', countryCode: 'NO' },
      { countryName: 'Denmark', countryCode: 'DK' },
      { countryName: 'Iceland', countryCode: 'IS' },
      { countryName: 'France', countryCode: 'FR' },
      { countryName: 'Germany', countryCode: 'DE' },
      { countryName: 'Poland', countryCode: 'PL' },
      { countryName: 'Great Britain', countryCode: 'GB' },
      { countryName: 'Ireland', countryCode: 'IE' },
      { countryName: 'Italy', countryCode: 'IT' },
      { countryName: 'Spain', countryCode: 'ES' },
      { countryName: 'Portugal', countryCode: 'PT' },
    ]"
    :caption="`Countries`"
  />
</template>

<style scoped></style>
