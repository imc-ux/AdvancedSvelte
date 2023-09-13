<script>
  import { Button } from "carbon-components-svelte";
  import { createEventDispatcher } from "svelte";
  import "hover.css";

  const dispatch = createEventDispatcher();

  export let kind = "primary";
  export let size = "small";
  export let icon = undefined;
  export let iconButton = false; // 只显示图标
  let hoverCSS = "";
  const btnCSS = [
    "hvr-wobble-to-top-right",
    "hvr-wobble-bottom",
    "hvr-wobble-skew",
    "hvr-buzz-out",
    "hvr-float-shadow",
    "hvr-sweep-to-right",
    "hvr-shutter-in-vercital",
  ];

  function onBtnClickHandler(e) {
    dispatch("click", {
      event: e,
    });
    e.target.blur();
  }

  function onBtnMouseEnterHandler(e) {
    const count = getRandomNum(0, btnCSS.length - 1);
    if (hoverCSS) {
      e.target.classList.remove(hoverCSS);
    }
    e.target.classList.toggle(btnCSS[count]);
    hoverCSS = btnCSS[count];
  }

  function getRandomNum(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
  }
</script>

{#if iconButton}
  <Button {kind} {size} {icon} on:click={onBtnClickHandler} {...$$restProps} />
{:else}
  <Button
    {icon}
    on:click={onBtnClickHandler}
    on:mouseenter={onBtnMouseEnterHandler}
    {...$$restProps}>
    <slot />
  </Button>
{/if}

<style lang="scss">
  @import "../../styles/theme/var";
  @import "../../styles/theme/mixin";
  @import "hover.css";

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
  :global(.hvr-radial-out) {
    &:before {
      @include themifyListIpt("background-color", $theme-color);
    }
  }
  :global(.hvr-sweep-to-right) {
    &:before {
      @include themifyListIpt("background-color", $theme-color);
    }
  }
  :global(.hvr-underline-from-left) {
    &:before {
      @include themifyListIpt("background-color", $dark-theme-color);
    }
  }
  :global(.hvr-overline-reveal) {
    &:before {
      @include themifyListIpt("background-color", $dark-theme-color);
    }
  }
  :global(.hvr-shutter-in-vercital) {
    &:before {
      @include themifyListIpt("background-color", $dark-theme-color);
    }
  }
</style>
