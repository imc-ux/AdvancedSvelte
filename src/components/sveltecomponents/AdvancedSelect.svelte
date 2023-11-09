<script>
  import Select from 'svelte-select';
  export let options = [];
  export let value = null;
  export let onSubmit = a => {};
  export let optionIdentifier = 'code';
  export let labelIdentifier = 'name';
  export let disabled = false;

  function onGetOptions(event) {
    onSubmit(event.detail);
  }

  $: props = {
    ...$$restProps,
  };
</script>

<Select
  {...props}
  containerStyles="position:static;"
  items={options}
  itemId={optionIdentifier}
  label={labelIdentifier}
  {value}
  on:change={onGetOptions}
  clearable={false}
  {disabled}
  placeholder="--请选择--"
  showChevron={true}
/>

<style lang="scss">
  @import '../../styles/theme/var';
  @import '../../styles/theme/mixin';

  :global(input.svelte-15ynnp5.svelte-15ynnp5.svelte-15ynnp5) {
    cursor: pointer;
  }

  :global(.svelte-select.focused) {
    border: 1px solid #08adaa !important;
    @include themifyListIpt('border-color', $theme-color);
  }

  :global(.svelte-select:hover) {
    border: 1px solid #08adaa !important;
    @include themifyListIpt('border-color', $theme-color);
  }

  :global(.svelte-select-list) {
    border: 1px solid #08adaa !important;
    @include themifyListIpt('border-color', $theme-color);
    border-radius: 0% !important;
    font-size: 13px;
  }

  :global(.svelte-select) {
    border-radius: 0% !important;
    padding: 0px 0px 0px 5px !important;
  }

  :global(.item) {
    cursor: pointer !important;
    padding-left: 5px !important;
  }

  :global(.item.first) {
    border-radius: 0% !important;
  }

  :global(.item.hover:not(.active)) {
    color: #fff !important;
    @include themifyListIpt('background-color', $theme-color);
  }

  :global(.item.svelte-15ynnp5.active:hover) {
    color: #fff !important;
  }

  :global(.item.active) {
    @include themifyListIpt('color', $theme-color);
    background-color: #fff !important;
  }

  :global(.pop-select) {
    @include themifyList('color', $theme-color);
  }

  :global(.selected-item) {
    font-size: 13px !important;
    width: 100%;
    padding: 0px !important;
  }

  :global(.chevron) {
    width: 16px !important;
    height: 16px !important;
    cursor: pointer !important;
  }

  :global(.indicators) {
    width: 19px;
    cursor: pointer !important;
  }

  :global(.svelte-15ynnp5::-webkit-input-placeholder) {
    font-size: 13px;
    color: #000;
  }

  :global(.svelte-select-list > .list-item) {
    font-size: 13px !important;
  }
</style>
