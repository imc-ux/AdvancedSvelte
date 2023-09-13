<!-- /**
 * Summary: Box
 * Created: 2021/06/18
 * Author1: liuzhe
 * © 2021 iMarketChina Co.,Ltd. All rights reserved.
 */ -->
<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let flexDisplay = true;
  export let column = false;
  export let horizontalAlign = "left";
  export let verticalAlign = "stretch";
  export let width = "auto";
  export let height = "auto";
  export let f = 0;

  let classes = [];

  $: props = {
    ...$$restProps,
    class: [
      $$restProps.class,
      flexDisplay && "flex-display",
      column && "flex-column",
    ]
      .filter(Boolean)
      .join(" "),
    style: `${getJustifyComtent(horizontalAlign)};${getAlignItems(
      verticalAlign
    )};${getWidthOrHeight("width", width)};${getWidthOrHeight(
      "height",
      height
    )};${$$restProps.style};${getFlexGrow(f)}`,
  };

  function getFlexGrow(f) {
    return `flex-grow:${f}`;
  }

  function getJustifyComtent(hor) {
    switch (hor) {
      case "left":
        return "justify-content:flex-start";
      case "center":
        return "justify-content:space-between";
      case "right":
        return "justify-content:flex-end";
      case "compact":
        return "justify-content:center";
      case "space-around":
        return "justify-content:space-around";
    }
  }

  function getAlignItems(ver) {
    switch (ver) {
      case "top":
        return "align-items:flex-start";
      case "middle":
        return "align-items:center";
      case "bottom":
        return "align-items:flex-end";
      case "baseline":
        return "align-items:baseline";
      case "stretch":
        return "align-items:stretch";
    }
  }

  function getWidthOrHeight(type, value) {
    switch (typeof value) {
      case "string":
        return `${type}:${value}`;
      case "number":
        return `${type}:${value}px`;
      default:
        break;
    }
  }

  function onDivClickHandler(e) {
    dispatch("click", {
      event: e,
    });
  }
</script>

<div on:click={onDivClickHandler} {...props}>
  <slot />
</div>

<style lang="scss">
  .flex-display {
    display: flex;
  }

  .flex-column {
    flex-direction: column;
  }
</style>
