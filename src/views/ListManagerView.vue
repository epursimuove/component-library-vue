<script setup lang="ts">
import AutomaticTable from "@/components/tabularData/AutomaticTable.vue";
import { nextTick, ref, type Ref } from "vue";
import type {
  ColumnConfiguration,
  ColumnConfigurations,
  RowItem,
} from "@/types/type.ts";
import { createDummyUserList } from "@/utils/tabularData.ts";

const userDefinedListExample: Ref<RowItem[]> = ref([
  {
    hello: "World",
    foo: false,
    bar: 987654321,
    pangram: "The quick brown fox jumps over the lazy dog",
  },
  {
    hello: "There",
    foo: true,
    bar: 123,
    pangram: "Yxmördaren Julia Blomqvist på fäktning i Schweiz",
  },
]);

const userDefinedList: Ref<RowItem[]> = ref(createDummyUserList());

const columnConfigurationsList: Ref<RowItem[]> = ref([]);

const userTableAsJSON: Ref<string> = ref(
  JSON.stringify(userDefinedList.value, null, 2),
);

const handleModifiedColumnConfigurations = async (
  columnConfigurations: ColumnConfigurations,
) => {
  console.info(
    `Received updated column configurations`,
    columnConfigurations,
  );

  await nextTick();

  const convertedToArray: RowItem[] = Object.values(columnConfigurations).map(
    (columnConfiguration: ColumnConfiguration) => {
      return columnConfiguration;
    },
  );

  columnConfigurationsList.value = convertedToArray;
};

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
    <div>
      <label for="user-table-as-json">User defined list of JSON objects</label>

      <textarea id="user-table-as-json" cols="40" rows="25" v-model="userTableAsJSON"></textarea>
    </div>

    <div>
      <label for="column-configurations-as-json">Automatically calculated column configurations (JSON)</label>

      <textarea id="column-configurations-as-json" cols="40" rows="25" :value="JSON.stringify(columnConfigurationsList, null, 2)" readonly></textarea>
    </div>


<!--    <pre style="width: 20rem; height: 10rem; overflow: auto;">-->
<!--      {{JSON.stringify(columnConfigurationsList, null, 2)}}-->
<!--    </pre>-->

    <button type="button" @click="calculateResult">Calculate result</button>
  </form>

  <h2>Result</h2>

  <div v-if="columnConfigurationsList.length > 0">

    <AutomaticTable
      :list="columnConfigurationsList"
      :caption="`Configurations for ${columnConfigurationsList.length} columns/properties from user defined list of ${userDefinedList.length} items/objects`"
    />
  </div>

  <div v-if="userDefinedList.length > 0">

    <AutomaticTable
      :list="userDefinedList"
      :caption="`User defined list of ${userDefinedList.length} items`"
      @modifiedColumnConfigurations="handleModifiedColumnConfigurations"
    />
  </div>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;

  & > * {
    display: flex;
    flex-direction: column;
  }
}

@media screen and (min-width: 600px) {

  form {
    flex-direction: row;
    flex-wrap: wrap;
  }
}

</style>
