<!-- /**
 * Summary: Link
 * Created: 2022/10/09
 * Author1: kang jiaqi
 * © 2022 iMarketChina Co.,Ltd. All rights reserved.
 */ -->
<script>
  import { Link } from "carbon-components-svelte";
  import { createEventDispatcher } from "svelte";

  export let cell;
  let title = "";
  const dispatch = createEventDispatcher();

  $: props = {
    class: "link",
    ...$$restProps,
  };

  function onLinkClickHandler(e) {
    dispatch("click", { href: e.target.href });
  }

  function onMouseEnterHandler(e) {
    const textWidth = e.target.scrollWidth;
    const containerWidth = e.target.offsetWidth;
    if (cell.value) {
      if (textWidth > containerWidth) title = cell.value;
      else title = "";
    }
  }
</script>

<Link
  {...props}
  {cell}
  {title}
  on:click={onLinkClickHandler}
  on:mouseenter={onMouseEnterHandler}
  href="#">
  {cell.value}
</Link>

<style lang="scss">
  @import "../../styles/theme/var";
  @import "../../styles/theme/mixin";

  :global(.bx--link) {
    margin-top: 4px;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
