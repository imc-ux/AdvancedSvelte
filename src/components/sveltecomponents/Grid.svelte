<!-- /**
 * Summary: Grid
 * Created: 2021/06/18
 * Author1: liuzhe
 * © 2021 iMarketChina Co.,Ltd. All rights reserved.
 */ -->
<script>
  import { Grid } from 'carbon-components-svelte';

  export let noPadding = true;
  export let wholeWidth = true;

  $: props = {
    ...$$restProps,
    class: [$$restProps.class, noPadding && 'no-padding', wholeWidth && 'whole-width'].filter(Boolean).join(' '),
  };
</script>

<Grid {...props}>
  <slot />
</Grid>

<style>
  :global(.no-padding) {
    padding: 0;
  }
  :global(.whole-width) {
    width: 100%;
  }
</style>
