<!-- /**
 * Summary: Column
 * Created: 2021/06/18
 * Author1: liuzhe
 * © 2021 iMarketChina Co.,Ltd. All rights reserved.
 */ -->
<script>
  import { Column } from 'carbon-components-svelte';

  export let noPadding = false;

  $: props = {
    ...$$restProps,
    class: [$$restProps.class, noPadding && "no-padding"].filter(Boolean).join(' '),
    style: $$restProps.style,
  };
</script>

<Column {...props} style="height:30px;">
  <slot />
</Column>
