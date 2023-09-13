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
  :global(.disabled.svelte-15ynnp5.svelte-15ynnp5.svelte-15ynnp5) {
    background: #f4f4f4 !important;
    border-color: #f4f4f4 !important;
    color: #c6c6c6 !important;
  }
</style>
