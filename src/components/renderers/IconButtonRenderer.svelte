<script>
  import { Link } from "carbon-components-svelte";
  import RENDERER_EVENT from "@/constant/Renderer";

  export let params;
  export let currentIcon = params.data.btnIcon;

  $: props = {
    class: "iconButton",
    ...$$restProps,
  };

  function onBtnClickHandler(e) {
    const event = {
      type: RENDERER_EVENT.Renderer_Icon_Button,
      value: params.data,
      value1: params.value,
      field: params.colDef.field,
    };
    params.api.dispatchEvent(event);
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
    @include themifyList("color", $theme-color);
    margin-top: 10px;
  }
</style>
