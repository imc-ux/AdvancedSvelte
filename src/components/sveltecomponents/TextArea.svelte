<!-- /**
 * Summary: TextArea
 * Created: 2021/06/18
 * Author1: liuzhe
 * © 2021 iMarketChina Co.,Ltd. All rights reserved.
 */ -->
<script>
  import { TextArea } from "carbon-components-svelte";
  import { createEventDispatcher } from "svelte";
  import { Box, Text } from "@/components/sveltecomponents";

  const dispatch = createEventDispatcher();
  export let value;
  export let readOnly = false;
  export let height = "100px";
  //export let commonTextArea = true;
  export let inputLabel = "";

  let focus = false;
  let hover = false;

  $: props = {
    ...$$restProps,
  };

  function onTextAreaBlurHandler(e) {
    dispatch("blur", { data: e.target.value });
    focus = false;
  }

  function onTextAreaFocusHandler(e) {
    focus = true;
  }

  function onTextAreaClickHandler(e) {
    dispatch("click", { data: e.target.value });
  }

  function onTextAreaInputChangeHandler(e) {
    dispatch("input", { data: e.target.value });
  }

  function onTextAreaHoverHandler(status) {
    if (status === "in") {
      hover = true;
    } else {
      hover = false;
    }
  }
</script>

<Box f={1} style="position:relative;">
  <div
    class={focus || hover
      ? "input-outer-border input-outer-border-hover"
      : "input-outer-border"}
    on:click={onTextAreaClickHandler}
    on:keypress={() => {}} />
  {#if inputLabel}
    <Text
      class={value || focus
        ? "textarea-place-holder textarea-place-holder-move"
        : "textarea-place-holder"}>{inputLabel}</Text>
  {/if}
  <TextArea
    bind:value
    style="height:{height}"
    {...props}
    on:blur={onTextAreaBlurHandler}
    on:focus={onTextAreaFocusHandler}
    on:click={onTextAreaClickHandler}
    readonly={readOnly}
    on:input={onTextAreaInputChangeHandler}
    on:mouseenter={() => onTextAreaHoverHandler("in")}
    on:mouseleave={() => onTextAreaHoverHandler("out")} />
</Box>

<style>
  :global(.bx--text-area) {
    padding: 0px 5px;
    font-family: "微软雅黑";
    font-size: 14px;
    min-height: 29px;
  }

  :global(.commonTextArea) {
    
  }

  ::global(.normalTextArea) {
    background-color: #fff !important;
  }

  :global(.textarea-place-holder) {
    position: absolute;
    line-height: 13px;
    
    z-index: 0;
    margin-left: 5px;
    font-size: 17px;
    padding: 0 10px 0 5px;
    top: 10px;
    transition: 0.2s;
  }

  :global(.textarea-place-holder-move) {
    top: 0;
    font-size: 14px;
    transform: translateY(-55%);
  }

  :global(.transparent-textarea) {
    
  }
</style>
