<!-- /**
 * Summary: TextArea
 * Created: 2021/06/18
 * Author1: liuzhe
 * © 2021 iMarketChina Co.,Ltd. All rights reserved.
 */ -->
<script>
  import { TextArea } from "carbon-components-svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  export let value;
  export let readOnly = false;
  export let height = "100px";

  $: props = {
    ...$$restProps,
  };

  function onTextAreaBlurHandler(e) {
    dispatch("blur", { data: e.target.value });
  }

  function onTextAreaClickHandler(e) {
    dispatch("click", { data: e.target.value });
  }

  function onTextAreaInputChangeHandler(e) {
    dispatch("input", { data: e.target.value });
  }
</script>

<TextArea
  bind:value
  style="height:{height}"
  {...props}
  on:blur={onTextAreaBlurHandler}
  on:click={onTextAreaClickHandler}
  readonly={readOnly}
  on:input={onTextAreaInputChangeHandler} />

<style>
  :global(.bx--text-area) {
    padding: 0px 5px;
    font-family: "IBM Plex Mono", "Menlo", "DejaVu Sans Mono",
      "Bitstream Vera Sans Mono", Courier, monospace;
    font-size: 13px;
    min-height: 29px;
  }
</style>
