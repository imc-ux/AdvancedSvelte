<script lang="ts">
  import { ProgressBar } from 'carbon-components-svelte';

  export let value: string;
  export let maxValue: number = 100;
</script>

<ProgressBar value={Number(value)} max={maxValue} labelText={value + '%'} class="progress-bar " />

<style lang="scss">
  @import '../../styles/theme/var';
  @import '../../styles/theme/mixin';

  :global(.bx--progress-bar__bar) {
    border-radius: 100px !important;
    @include themifyList('background-color', $theme-color);
  }

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
