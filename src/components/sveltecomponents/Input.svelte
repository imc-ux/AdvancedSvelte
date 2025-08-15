<!--
/**
* Summary: Input控件
* Created: 2022/07/06
* Author1: ljh
* Author2:
*/
-->
<script>
  import { TextInput } from "carbon-components-svelte";
  import { Box, Text } from "@/components/sveltecomponents";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  export let value;
  export let maxAscii = null;
  export let restrict = null;
  export let readOnly = false;
  export let inputLabel = "";

  let focus = false;
  let hover = false;

  $: props = {
    ...$$restProps,
  };

  function onInputFocusHandler(e) {
    focus = true;
  }

  function onInputBlurHandler(e) {
    dispatch("blur", { data: value });
    focus = false;
  }

  function onInputMouseenterHandler(params) {
    hover = true;
  }

  function onInputMouseleaveHandler(params) {
    hover = false;
  }

  function onInputChangeHandler(e) {
    dispatch("change", { data: value });
  }

  function onTextFieldChangeHandler(e) {
    console.log(e);
    if (maxAscii) {
      let newValue = getMaxAsciiString(e.detail, maxAscii);
      value = newValue;
    }
    if (restrict) {
      const regExp = new RegExp("[" + restrict + "]*", "g");
      value = e.detail.match(regExp).join("");
    }
    dispatch("input", { data: value });
  }

  function getMaxAsciiString(input, bytes) {
    let result = "";
    let max = 0;
    if (input) {
      for (let i = 0; i < input.length; i++) {
        if (input.charCodeAt(i) >= 32 && input.charCodeAt(i) < 126) max++;
        else max += 2;

        if (max > bytes) break;
        else result += input.substring(i, i + 1);
      }
    }
    return result;
  }
</script>

<Box f={1} style="position:relative;height:30px" verticalAlign="middle">
  {#if inputLabel}
    <Text
      class={value || (!readOnly && focus)
        ? "input-place-holder input-place-holder-move"
        : "input-place-holder common-size"}>{inputLabel}</Text>
  {/if}
  
  <Box f={1} class="input-outer-box transparent-background">
    <TextInput
      style="background-color:rgba(255,255,255,0)"
      bind:value
      on:input={onTextFieldChangeHandler}
      on:focus={onInputFocusHandler}
      on:blur={onInputBlurHandler}
      autocomplete="off"
      readonly={readOnly}
      on:change={onInputChangeHandler}
      on:mouseenter={onInputMouseenterHandler}
      on:mouseleave={onInputMouseleaveHandler}
      {...props} /> 
  </Box>
</Box>

<style>
  :global(.bx--text-input) {
    padding: 0px 5px;
    font-family: "微软雅黑";
    font-size: 14px;
  }
  :global(.common-size) {
    font-size: 17px;
  }
</style>
