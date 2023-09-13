<!--
/**
* Summary: Input控件
* Created: 2022/07/06
* Author1: ljh
* Author2:
*/
-->
<script>
  import { TextInput } from 'carbon-components-svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  export let value;
  export let maxAscii = null;
  export let restrict = null;
  export let readOnly = false;
  export let placeholder = '';

  $: props = {
    ...$$restProps,
  };

  function onInputBlurHandler(e) {
    dispatch('blur', { data: value });
  }

  function onInputChangeHandler(e) {
    dispatch('change', { data: value });
  }

  function onTextFieldChangeHandler(e) {
    if (maxAscii) {
      let newValue = getMaxAsciiString(e.detail, maxAscii);
      value = newValue;
    }
    if (restrict) {
      const regExp = new RegExp('[' + restrict + ']*', 'g');
      value = e.detail.match(regExp).join('');
    }
    dispatch('input', { data: value });
  }

  function getMaxAsciiString(input, bytes) {
    let result = '';
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

<TextInput
  bind:value
  on:input={onTextFieldChangeHandler}
  {placeholder}
  on:blur={onInputBlurHandler}
  autocomplete="off"
  readonly={readOnly}
  on:change={onInputChangeHandler}
  {...props}
/>

<style>
  :global(.bx--text-input) {
    padding: 0px 5px;
    font-family: 'IBM Plex Mono', 'Menlo', 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', Courier, monospace;
    font-size: 13px;
  }
</style>
