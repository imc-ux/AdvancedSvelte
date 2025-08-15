<!--
/**
* Summary: Select控件
* Created: 2023/11/07
* Author1: kangjiaqi
*/
-->

<script>
  import Svelecte from 'svelecte';

  export let selection = null;
  export let value = null;
  export let onSubmit = a => {};
  export let options = [];
  export let labelField = 'name';
  export let valueField = 'code';
  export let placeholder = '--请选择--';
  export let clearable = false;
  export let disabled = false;

  $: props = {
    ...$$restProps,
  };

  function onGetOptions(event) {
    onSubmit(event.detail);
  }
</script>

<Svelecte
  {...props}
  {options}
  bind:readSelection={selection}
  bind:value
  on:change={onGetOptions}
  {placeholder}
  {clearable}
  {disabled}
  {labelField}
  {valueField}
/>

<style>
  :global(.svelecte-control.svelte-17904zl) {
    --sv-color: #161616;
    --sv-min-height: 30px;
    --sv-border-color: #cacaca;
    --sv-active-border: 1px solid #08adaa;
    --sv-placeholder-color: #161616;
    --sv-loader-border: 3px solid #cacaca;
  } 

  :global(.indicator-container.svelte-1l8hgl2) {
    padding: 4px;
  }

  :global(
      .svelecte-control .has-multiSelection .sv-item-content,
      .svelecte-control .sv-dropdown-content .sv-item,
      #dnd-action-dragged-el .sv-item-content
    ) {
    padding: 0px 0px 0px 6px;
  }

  :global(.sv-item) {
    height: 24px;
  }

  :global(.svelecte-control .sv-item-content, #dnd-action-dragged-el .sv-item-content) {
    line-height: 24px;
  }
</style>
