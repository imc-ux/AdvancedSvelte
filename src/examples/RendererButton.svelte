<script lang="ts">
  import { Button } from "carbon-components-svelte";

  let currentElement;
  export let kind: any = "primary";
  export let size: any = "small";
  export let params;

  function onBtnClickHandler(e) {
    const event = new CustomEvent("rendererClick", {
      bubbles: true,
      detail: params,
    });
    currentElement.dispatchEvent(event);
  }
</script>

<span bind:this={currentElement}>
  <Button {kind} {size} on:click={onBtnClickHandler} {...$$restProps}>+</Button>
</span>
