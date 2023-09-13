<!--
/**
* Summary: MultiSelect控件
* Created: 2022/08/30
* Author1: ljh
* Author2:
*/
-->
<script>
  import { MultiSelect } from "carbon-components-svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  export let selectedIds;
  export let dataProvider;
  export let direction;
  let label = "--请选择--";
  let isOpen;

  $: props = {
    ...$$restProps,
  };

  function onSelectHandler(e) {
    let names = [];
    if (selectedIds && selectedIds.length > 0) {
      for (let i = 0; i < selectedIds.length; i++) {
        let info = dataProvider?.find((v) => v.id === selectedIds[i]);
        names.push(info.name);
      }
      label = names.toString();
    } else {
      label = "--请选择--";
    }
    dispatch("select", {
      event: e,
    });
  }

  function onFocusHandler(e) {
    if (!e.detail.sourceCapabilities) {
      isOpen = false;
    }
  }
</script>

<div title={label}>
  <MultiSelect
    bind:selectedIds
    items={dataProvider}
    {label}
    {...props}
    on:select={onSelectHandler}
    style="outline:none"
    {direction}
    on:blur={onFocusHandler}
    bind:open={isOpen} />
</div>

<style>
  :global(.bx--list-box__field) {
    padding: 0px 0px 0px 5px;
  }

  :global(.bx--list-box:hover) {
    background-color: #fff;
  }

  :global(.bx--list-box--expanded:hover) {
    background-color: #fff;
  }

  :global(.bx--list-box__field) {
    padding: 0px 0px 0px 5px;
  }

  :global(.bx--list-box__menu-icon) {
    right: 0px;
  }

  :global(.bx--list-box__label) {
    font-size: 13px !important;
    margin-right: 19px;
  }

  :global(.bx--list-box__menu-item__option) {
    margin: 0px 0px;
    width: 100%;
  }

  :global(
      .bx--list-box__menu-item__option
        > .bx--form-item
        > .bx--checkbox-label::before
    ) {
    margin: 4px 0.125rem 0.125rem 5px;
  }

  :global(
      .bx--list-box__menu-item__option
        > .bx--form-item
        > .bx--checkbox-label::after
    ) {
    left: 9px;
  }

  :global(.bx--list-box__menu-icon > svg) {
    stroke: #161616 !important;
    width: 14px;
    height: 14px;
    cursor: pointer;
    margin-left: 1px;
  }

  :global(.bx--list-box__menu-icon) {
    cursor: pointer;
  }

  :global(.bx--list-box__field) {
    cursor: pointer;
  }
</style>
