<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import Input from '@/components/sveltecomponents/Input.svelte';
  import RENDERER_EVENT from '@/constant/Renderer';

  export let params;
  export let value = params.value ?? '';
  export let title = '';
  export let inputValue = value;
  let isEdited: boolean = false;

  onMount(() => {});
  $: props = {
    class: 'label-input',
    ...$$restProps,
  };

  function onMouseEnterHandler(e) {
    const textWidth = e.target.scrollWidth;
    const containerWidth = e.target.offsetWidth;
    if (value) {
      if (textWidth > containerWidth) title = value;
      else title = '';
    }
  }

  function onInputFocusHandler() {
    isEdited = true;
    document.getElementById('input')?.focus();
  }

  function onInputChangeHandler(e) {
    inputValue = e.detail.data;
    isEdited = false;
    value = inputValue;
    const event = {
      type: RENDERER_EVENT.Renderer_Lable_Input,
      value: inputValue,
      detail: params,
    };
    params?.api?.dispatchEvent(event);
  }
</script>

{#if !isEdited}
  <p
    {title}
    {...props}
    on:mouseenter={onMouseEnterHandler}
    on:click={onInputFocusHandler}
    style="height:35px;display:flex;flex-direction:column;justify-content:center"
  >
    {value}
  </p>
{:else}
  <Input id="input" bind:value={inputValue} {...props} on:blur={onInputChangeHandler} />
{/if}
