<script>
  import { DataTable } from 'carbon-components-svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  $: props = {
    ...$$restProps,
  };
</script>

<DataTable {...$$restProps}>
  <slot />
</DataTable>
