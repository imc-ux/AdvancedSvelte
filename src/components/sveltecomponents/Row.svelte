<!-- /**
 * Summary: Row
 * Created: 2021/06/18
 * Author1: liuzhe
 * © 2021 iMarketChina Co.,Ltd. All rights reserved.
 */ -->
<script>
  import { Row } from 'carbon-components-svelte';

  export let noMargin = true;

  $: props = {
    ...$$restProps,
    class: [$$restProps.class, noMargin && 'no-margin'].filter(Boolean).join(' '),
  };
</script>

<Row {...props}>
  <slot />
</Row>

<style>
  :global(.no-margin) {
    margin: 0;
  }
</style>
