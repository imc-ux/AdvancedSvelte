<script lang="ts">
  import { Link } from "carbon-components-svelte";
  import { createData, bodyBatchInput } from "@/utils/CommonUtils";
  import RENDERER_EVENT from "@/constant/Renderer";
  import { Box } from "@/components/sveltecomponents";

  export let params;
  export let upTitle = "";
  export const cellData = params.data ?? {};
  export const datafiledArray = params?.colDef?.field?.split("*") ?? [];
  export const data = createData(cellData, datafiledArray);
  export const upClass = params?.colDef?.upClassName ?? "hor-center";
  export const downClass = params?.colDef?.downClassName ?? "hor-center";
  export const upIcon = params?.colDef?.upIcon ?? "";
  export const downIcon = params?.colDef?.downIcon ?? "";

  function onUpLinkClickHandler(e) {
    bodyBatchInput(e, data[1] ?? "");
  }

  function onUpBtnClickHandler(e) {
    const event = {
      type: RENDERER_EVENT.Renderer_Icon_Button,
      value: cellData,
      row: params.rowIndex,
      field: datafiledArray[0],
    };
    params.api.dispatchEvent(event);
  }

  function onUpMouseEnterHandler(e) {
    const textWidth = e.target.scrollWidth;
    const containerWidth = e.target.offsetWidth;
    if (data[0]) {
      if (textWidth > containerWidth) upTitle = data[0];
      else upTitle = "";
    }
  }

  function onDownLinkClickHandler(e) {
    bodyBatchInput(e, data[3] ?? "");
  }

  function onDownBtnClickHandler(e) {
    const event = {
      type: RENDERER_EVENT.Renderer_Icon_Button,
      value: cellData,
      row: params.rowIndex,
      field: datafiledArray[2],
    };
    params.api.dispatchEvent(event);
  }

  function onDownMouseEnterHandler(e) {
    const textWidth = e.target.scrollWidth;
    const containerWidth = e.target.offsetWidth;
    if (data[0]) {
      if (textWidth > containerWidth) upTitle = data[0];
      else upTitle = "";
    }
  }

  $: linkProps = {
    class: "link",
    ...$$restProps,
  };
</script>

<div class={upClass}>
  <Box f={1} style="width:90%; display:flex;">
    <Link
      {...linkProps}
      title={upTitle}
      on:click={onUpLinkClickHandler}
      on:mouseenter={onUpMouseEnterHandler}
      href="#">
      {data[0] ?? ""}
    </Link>
  </Box>
  <Link on:click={onUpBtnClickHandler} icon={upIcon} {...linkProps} />
</div>
<Box class={downClass}>
  <Box f={1} style="width:90%; display:flex;">
    <Link
      {...linkProps}
      title={upTitle}
      on:click={onDownLinkClickHandler}
      on:mouseenter={onDownMouseEnterHandler}
      href="#">
      {data[2] ?? ""}
    </Link>
  </Box>
  <Link
    style="width:25px"
    on:click={onDownBtnClickHandler}
    icon={downIcon}
    {...linkProps} />
</Box>

<style>
  :global(.label) {
    height: 20px;
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :global(.margin-top) {
    margin-top: 80px;
  }
</style>
