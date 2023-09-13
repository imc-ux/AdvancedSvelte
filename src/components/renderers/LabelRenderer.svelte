<script>
  import { onDestroy, onMount } from 'svelte';
  export let params;
  export let value = params.value ?? '';
  let title = '';
  let statusColor;
  const show = params.data.show;

  onMount(() => {
    const endDate = new Date(params.data.endDate).getTime() + 16 * 60 * 60 * 1000;
    const moment = new Date().getTime();
    const breakFlag = params.data.breakFlag;
    if (breakFlag === 'N') {
      if (moment > endDate && Number(params.data.taskProgress) < 100) {
        statusColor = '#ff0000';
      }
    }

    if (params.colDef.key) {
      value = show;
    }
  });

  $: props = {
    class: 'label',
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
</script>

<p {title} on:mouseenter={onMouseEnterHandler} {...props} style="--status-color:{statusColor}">
  {value}
</p>

<style>
  :global(.label) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
