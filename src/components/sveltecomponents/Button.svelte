<!--
/**
 * Summary: Button控件
 * Created: 2022/04/26
 * Author1: lixiaozheng
 * Author2:
 */
-->
<script>
  import { Button } from "carbon-components-svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let kind = "primary";
  export let size = "small";
  export let icon = undefined;
  export let iconButton = false; // 只显示图标

  function onBtnClickHandler(e) {
    dispatch("click", {
      event: e,
    });
  }
</script>

{#if iconButton}
  <Button {kind} {size} {icon} on:click={onBtnClickHandler} {...$$restProps} />
{:else}
  <Button {kind} {size} {icon} on:click={onBtnClickHandler} {...$$restProps}>
    <slot />
  </Button>
{/if}

<style lang="scss">
  @import "../../styles/theme/var";
  @import "../../styles/theme/mixin";

  :global(.button-normal) {
    border: 1px solid #08adaa;
    @include themifyList("border-color", $theme-color);
    @include themifyList("color", $theme-color);
    background-color: #fff;
    margin-bottom: 3px;
    height: 30px;
    min-height: 0rem;
    &:hover {
      color: #fff !important;
      @include themifyListIpt("background-color", $theme-color);
      border: 1px solid #08adaa;
      @include themifyListIpt("border-color", $theme-color);
    }
    &:focus {
      background-color: #fff;
      @include themifyList("color", $theme-color);
      box-shadow: inset 0 0 0 1px #fff;
      border: 1px solid #08adaa;
      @include themifyList("border-color", $theme-color);
    }
    &:active {
      border: 1px solid #08adaa;
      @include themifyList("border-color", $theme-color);
      @include themifyList("color", $theme-color);
      background-color: #fff;
    }
  }
</style>
