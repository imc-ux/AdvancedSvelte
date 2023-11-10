<!--
/**
* Summary: MultiSelect控件
* Created: 2023/11/08
* Author1: kangjiaqi
*/
-->

<script>
  import '@brewer/beerui/assets/beer.css';
  import { BeSelect, BeOption } from '@brewer/beerui/be-select';
  import { onMount } from 'svelte';

  let value = [];
  export let options = [];
  export let onSubmit = a => {};
  export let labelField = 'name';
  export let codeField = 'code';
  export let placeholder = '--请选择--';
  export let clearable = false;
  export let disabled = false;

  $: props = {
    ...$$restProps,
  };

  onMount(() => {
    if (value.length === 0) {
    }
  });

  function onGetOptions(event) {
    onSubmit(event.detail);
  }
</script>

<BeSelect {...props} bind:value on:change={onGetOptions} maxHeight="180px" {placeholder} {clearable} {disabled} multiple>
  {#each options as item, index}
    <BeOption label={item[labelField]} value={item[codeField]} value-key={index} />
  {/each}
</BeSelect>

<style>
  :global(.be-svg) {
    color: #08adaa !important;
  }

  :global(.be-select__tags) {
    background-color: #fff;
    color: #161616;
    border: 1px solid #cacaca;
    border-radius: 4px;
    min-width: 200px;
    width: 100%;
    min-height: 30px;
    max-height: 30px;
  }

  :global(.be-select__tags .be-tag-suffix-icon) {
    height: 30px;
  }

  :global(.be-select__tags .be-tag-suffix) {
    right: 15px;
  }

  :global(.be-select-dropdown__item.is-multiple .be-icon-inner) {
    top: 3px;
  }
</style>
