<script>
  import { Link } from "carbon-components-svelte";
  import RENDERER_EVENT from "@/constant/Renderer";
  import "@/styles/core/index.scss";

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


