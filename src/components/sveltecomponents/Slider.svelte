<script lang="ts">
  import { Slider } from 'carbon-components-svelte';
  import { createEventDispatcher } from 'svelte';

  export let value: number = 0;
  export let maxValue: number = 100;
  export let minValue: number = 0;
  export let step: number = 1;
  export let hideTextInput: boolean = false;
  export let labelText: string = '';

  const dispatch = createEventDispatcher();

  function onSliderChange(e: CustomEvent) {
    dispatch('change', {
      value: e.detail,
    });
  }
</script>

<Slider bind:value max={maxValue} min={minValue} {step} {labelText} {hideTextInput} on:change={onSliderChange} />
