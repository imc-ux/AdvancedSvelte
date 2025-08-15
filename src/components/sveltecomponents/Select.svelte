<!--
/**
* Summary: Select控件
* Created: 2022/07/06
* Author1: ljh
* Author2:
*/
-->
<script>
  import "@/styles/core/white.css";
  import { Select, SelectItem, Box } from "carbon-components-svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  export let selected;

  export let dataProvider = [];
  export let labelField = "";
  export let codeField = "";

  function onChangeHandler(e) {
    dispatch("change", { data: selected });
  }
</script>

<Select bind:selected {...$$restProps} on:change={onChangeHandler}>
  {#if dataProvider.length > 0}
    {#each dataProvider as data}
      <SelectItem value={data[codeField]} text={data[labelField]} />
    {/each}
  {/if}
</Select>

<style>
  
</style>
