<script setup lang="ts">
import type { PropertyType, PropertyValue } from "@/types/type.ts";
import { getFlagEmoji, toFixed } from "@/utils/util.ts";

const props = defineProps<{
  propertyName: string;
  propertyType: PropertyType;
  propertyValue: PropertyValue;
}>();
</script>

<template>
  <td :class="props.propertyType">
    <template v-if="props.propertyType === 'boolean'">
      <template v-if="propertyValue">&checkmark;</template>
    </template>

    <template v-else-if="props.propertyType === 'positiveInteger'">
      <template v-if="propertyValue">{{ propertyValue }}</template>
    </template>

    <template v-else-if="props.propertyType === 'timestamp'">
      <span>{{ (propertyValue as string).slice(0, 10) }}</span>
      <span class="meta">{{ (propertyValue as string).slice(10, 11) }}</span>
      <span>{{ (propertyValue as string).slice(11, 19) }}</span>
      <span class="meta">{{ (propertyValue as string).slice(19) }}</span>
    </template>

    <template v-else-if="props.propertyType === 'countryCode'">
      {{ getFlagEmoji(propertyValue as string) }} {{ propertyValue }}
    </template>

    <template v-else-if="props.propertyType === 'percentage'">
      <template v-if="propertyValue"
        >{{ toFixed((propertyValue as number) * 100) }}%</template
      >
    </template>

    <template v-else-if="props.propertyType === 'promille'">
      <template v-if="propertyValue"
        >{{ toFixed((propertyValue as number) * 1000) }}&permil;</template
      >
    </template>

    <template v-else>
      {{ propertyValue }}
      <!--          {{rowItem[propertyName]}}-->
    </template>
  </td>
</template>

<style scoped>
.meta {
  color: rgb(230, 230, 230);
}
/*
td {

  &.countryFlag {
    font-size: 2.5rem;
  }
}
 */
</style>
