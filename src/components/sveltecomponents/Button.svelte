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


