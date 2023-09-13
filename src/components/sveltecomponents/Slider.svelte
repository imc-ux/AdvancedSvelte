<script lang="ts">
  import { Slider } from 'carbon-components-svelte';
  import { createEventDispatcher } from 'svelte';

  export let value: number = 0;
  export let maxValue: number = 100;
  export let minValue: number = 0;
  export let step: number = 1;
  export let hideTextInput: boolean = false;
  export let labelText: string = '';
  let sliderBgColor;

  const dispatch = createEventDispatcher();

  function onSliderChange(e: CustomEvent) {
    dispatch('change', {
      value: e.detail,
    });
    if (value <= 20) {
      sliderBgColor = '#909399';
    } else if (value <= 40) {
      sliderBgColor = '#d2bf7d';
    } else if (value <= 60) {
      sliderBgColor = '#e6a23c';
    } else if (value <= 80) {
      sliderBgColor = '#5cb87a';
    } else if (value <= 100) {
      sliderBgColor = '#2196E3';
    }
  }
</script>

<Slider
  bind:value
  max={maxValue}
  min={minValue}
  {step}
  {labelText}
  {hideTextInput}
  on:change={onSliderChange}
  style="--slider-bb-color:{sliderBgColor}"
/>
