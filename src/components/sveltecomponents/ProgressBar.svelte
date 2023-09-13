<script lang="ts">
  import { ProgressBar } from 'carbon-components-svelte';
  import { onMount } from 'svelte';

  export let value: string;
  let progressBarBgColor: string;
  export let maxValue: number = 100;

  onMount(() => {
    onBackgoundColorChange();
  });

  function onBackgoundColorChange() {
    if (Number(value) <= 20) {
      progressBarBgColor = '#909399';
    } else if (Number(value) <= 40) {
      progressBarBgColor = '#d2bf7d';
    } else if (Number(value) <= 60) {
      progressBarBgColor = '#e6a23c';
    } else if (Number(value) <= 80) {
      progressBarBgColor = '#5cb87a';
    } else if (Number(value) <= 100) {
      progressBarBgColor = '#2196E3';
    }
  }
</script>

<ProgressBar
  value={Number(value)}
  max={maxValue}
  labelText={value + '%'}
  style="--progressbar-background-color:{progressBarBgColor}"
  class="progress-bar-flex"
/>

<style lang="scss">
  @import '../../styles/theme/var';
  @import '../../styles/theme/mixin';

  :global(.bx--progress-bar__bar) {
    border-radius: 100px !important;
    background-color: var(--progressbar-background-color);
    // @include themifyList('background-color', $theme-color);
  }

  :global(.progress-bar-flex) {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
  }

  :global(.bx--progress-bar__label) {
    margin-bottom: 0px;
    width: 50px;
    display: flex;
    justify-content: flex-end;
  }

  // :global(.bx--progress-bar-backgroung-color){

  // }

  :global(.svelte-progress-bar) {
    position: absolute !important;
  }

  :global(.svelte-progress-bar-leader) {
    transform: translate(0px, -4px) !important;
  }

  :global(.progress-bar) {
    display: flex;
    flex-flow: row-reverse;
    justify-content: space-between;
  }

  :global(.progress-bar > .bx--progress-bar__label) {
    height: 26px;
    line-height: 26px;
    margin-bottom: 0px;
    margin-left: 3px;
  }

  :global(.progress-bar > .bx--progress-bar__track) {
    margin-top: 9px;
    flex: 1;
    max-width: 80%;
    border-radius: 100px !important;
    overflow: hidden;
  }
</style>
