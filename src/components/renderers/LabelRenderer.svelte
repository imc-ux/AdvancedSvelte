<script>
  export let params;
  export let value = params.value;
  let title = '';

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

<p {title} on:mouseenter={onMouseEnterHandler} {...props}>
  {value}
</p>

<style>
  :global(.label) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
