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
  import "@/styles/core/index.scss";
  
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
