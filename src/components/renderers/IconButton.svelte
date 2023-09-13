<!--
/**
 * Summary: IconButton
 * Created: 2022/10/28
 * Author1: kang jiaqi
 * Author2:
 */
-->
<script>
  import { Link } from "carbon-components-svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let currentIcon = null;

  $: props = {
    class: "iconButton",
    ...$$restProps,
  };

  function onBtnClickHandler(e) {
    dispatch("click", {
      event: e,
    });
  }
</script>

<Link on:click={onBtnClickHandler} icon={currentIcon} {...props} />

<style lang="scss">
  @import "../../styles/theme/var";
  @import "../../styles/theme/mixin";

  :global(.iconButton) {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    @include themifyList("color", $theme-color);
    margin-top: 10px;
  }
</style>
