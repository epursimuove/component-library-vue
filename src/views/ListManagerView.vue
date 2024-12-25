<script setup lang="ts">
import AutomaticTable from "@/components/tabularData/AutomaticTable.vue";
import { ref, type Ref } from "vue";
import type { RowItem } from "@/types/type.ts";

const userTableAsJSON: Ref<string> = ref("");

const userDefinedList: Ref<RowItem[]> = ref([
  { hello: "World", foo: false, bar: 987654321 },
  { hello: "There", foo: true, bar: 123 },
]);

const calculateResult = (): void => {
  if (userTableAsJSON.value.length > 0) {
    // console.log("userTableAsJSON.value", userTableAsJSON.value);
    userDefinedList.value = JSON.parse(userTableAsJSON.value);
  }

  /*
  [
{
"hej": 123,
"hooray": "Nisse",
"hopp": true
},
{
"hej": 456789,
"hooray": "Sara",
"hopp": false
},
{
"hej": 9988,
"hooray": "Jennifer",
"hopp": true
},
{
"hej": 54321,
"hooray": "Oliver",
"hopp": false
}
]
   */
};
</script>

<template>
  <h1>List manager</h1>

  <form>
    <label>User defined list of JSON objects</label>

    <textarea cols="40" rows="15" v-model="userTableAsJSON"></textarea>

    <button type="button" @click="calculateResult">Calculate result</button>
  </form>

  <div v-if="userDefinedList.length > 0">
    <h2>Result</h2>

    <AutomaticTable
      :list="userDefinedList"
      :caption="`User defined list of ${userDefinedList.length} items`"
    />
  </div>
</template>

<style scoped></style>
