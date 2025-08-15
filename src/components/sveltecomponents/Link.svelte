<!-- /**
 * Summary: Link
 * Created: 2021/06/18
 * Author1: liuzhe
 * © 2021 iMarketChina Co.,Ltd. All rights reserved.
 */ -->
<script>
  import { Link } from "carbon-components-svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  function onLinkClickHandler(e) {
    dispatch("click", { href: e.target.href });
  }
</script>

<Link
  href="#"
  {...$$restProps}
  on:click={onLinkClickHandler}
  class="link-style">
  <slot />
</Link>

