<!--
/**
* Summary: Select控件
* Created: 2023/11/07
* Author1: kangjiaqi
*/
-->

<script>
  import '@brewer/beerui/assets/beer.css';
  import { BeSelect, BeOption } from '@brewer/beerui/be-select';

  export let value = null;
  export let onSubmit = a => {};
  export let options = [];
  export let labelField = 'name';
  export let codeField = 'code';
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

<BeSelect {...props} bind:value on:change={onGetOptions} maxHeight="180px" {placeholder} {clearable} {disabled}>
  {#each options as item, index}
    <BeOption label={item[labelField]} value={item[codeField]} value-key={index} />
  {/each}
</BeSelect>

<style>
  :global(.be-input--suffix .be-input__inner) {
    height: 30px;
  }

  :global(.be-select-dropdown__item.selected) {
    color: #08adaa;
  }

  :global(.be-input__inner:focus) {
    border-color: #08adaa;
    outline: none;
  }

  :global(.be-select-dropdown__item) {
    color: #161616;
    font-size: 13px;
    height: 30px;
    line-height: 30px;
  }

  :global(.be-select-dropdown__item.selected) {
    color: #08adaa;
  }

  :global(.be-input__inner) {
    color: #161616;
    font-size: 13px;
    line-height: 30px;
    border: 1px solid #cacaca;
  }

  :global(.be-input input::-webkit-input-placeholder) {
    color: #161616;
  }

  :global(.be-input input::-moz-placeholder) {
    color: #161616;
  }

  :global(.be-input input:-ms-input-placeholder) {
    color: #161616;
  }

  :global(.be-icon) {
    line-height: 30px;
  }

  :global(.main-advancedSelect > div) {
    width: 100%;
  }
</style>
