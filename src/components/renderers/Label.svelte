<!-- /**
 * Summary: Label
 * Created: 2022/10/09
 * Author1: kang jiaqi
 * © 2022 iMarketChina Co.,Ltd. All rights reserved.
 */ -->
<script>
  export let cell;
  let title = "";

  $: props = {
    class: "label",
    ...$$restProps,
  };

  function onMouseEnterHandler(e) {
    const textWidth = e.target.scrollWidth;
    const containerWidth = e.target.offsetWidth;
    if (cell.value) {
      if (textWidth > containerWidth) title = cell.value;
      else title = "";
    }
  }
</script>

<p {cell} {title} on:mouseenter={onMouseEnterHandler} {...props}>
  {cell.value}
</p>

<style>
  :global(.label) {
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
