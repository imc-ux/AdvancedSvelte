<script lang="ts">
  import { Link } from "carbon-components-svelte";
  import { createData, bodyBatchInput } from "@/utils/CommonUtils";
  import RENDERER_EVENT from "@/constant/Renderer";
  import { Box } from "@/components/sveltecomponents";

  export let params;
  export let title = "";
  export const cellData = params.data ?? {};
  export const datafiledArray = params?.colDef?.field?.split("*") ?? [];
  export const data = createData(cellData, datafiledArray);
  export const currentIcon = params?.colDef?.icon ?? "";
  export const upClass = params?.colDef?.upClassName ?? "hor-center";
  export const downClass = params?.colDef?.downClassName ?? "hor-center";
  const showIconButton = data[0];

  function onBtnClickHandler(e) {
    const event = {
      type: RENDERER_EVENT.Renderer_Icon_Button,
      value: cellData,
      value1: data[0],
      field: datafiledArray[0],
    };
    params.api.dispatchEvent(event);
  }

  function onLabelClickHandler(e) {
    if (data[1]) {
      bodyBatchInput(e, data[1]);
    }
  }

  function onMouseEnterHandler(e) {
    const textWidth = e.target.scrollWidth;
    const containerWidth = e.target.offsetWidth;
    if (data[1]) {
      if (textWidth > containerWidth) title = data[1];
      else title = "";
    }
  }

  $: linkProps = {
    class: "link",
    ...$$restProps,
  };

  $: props = {
    class: "label",
    ...$$restProps,
  };
</script>

<div class={upClass} style="height: 20px;">
  {#if showIconButton}
    <Link on:click={onBtnClickHandler} icon={currentIcon} {...linkProps} />
  {/if}
</div>
<Box class={downClass} style="height: 20px;">
  <Box f={1} style="width:100%; display:flex;">
    <p
      {title}
      {...props}
      style="width:100%;"
      on:mouseenter={onMouseEnterHandler}
      on:click={onLabelClickHandler}>
      {data[1] ?? ""}
    </p>
  </Box>
</Box>

<style lang="scss">
  @import "../../styles/theme/var";
  @import "../../styles/theme/mixin";

  :global(.label) {
    height: 20px;
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :global(.iconButton) {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    @include themifyList("color", $theme-color);
    margin-top: 10px;
  }
</style>
