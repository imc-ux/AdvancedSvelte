<script>
  import { Link } from "carbon-components-svelte";
  import RENDERER_EVENT from "@/constant/Renderer";

  export let params;
  let title = "";
  export let value = params.value;

  $: props = {
    class: "link",
    ...$$restProps,
  };

  function onLinkClickHandler(e) {
    const event = {
      type: RENDERER_EVENT.Renderer_LinkButton,
      value: params.data,
      value1: params.value,
      field: params.colDef.field,
    };
    params.api.dispatchEvent(event);
  }

  function onMouseEnterHandler(e) {
    const textWidth = e.target.scrollWidth;
    const containerWidth = e.target.offsetWidth;
    if (value) {
      if (textWidth > containerWidth) title = value;
      else title = "";
    }
  }
</script>

<Link
  {...props}
  {title}
  on:click={onLinkClickHandler}
  on:mouseenter={onMouseEnterHandler}
  href="#">
  {value}
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
    @include themifyListIpt("color", $theme-color);
  }

  :global(.bx--link:visited) {
    @include themifyList("color", $theme-color);
  }

  :global(.bx--link:hover) {
    @include themifyListIpt("color", $theme-color);
  }

  :global(.bx--link:active) {
    outline: none;
    @include themifyList("color", $theme-color);
  }
</style>
