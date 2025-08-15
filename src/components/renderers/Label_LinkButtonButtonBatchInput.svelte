<script lang="ts">
  import { Link } from "carbon-components-svelte";
  import { createData, bodyBatchInput } from "@/utils/CommonUtils";
  import RENDERER_EVENT from "@/constant/Renderer";
  import { Box } from "@/components/sveltecomponents";
  import "@/styles/core/index.scss";

  export let params;
  export let upTitle = "";
  export let downTitle = "";
  export const cellData = params.data ?? {};
  export const datafiledArray = params?.colDef?.field?.split("*") ?? [];
  export const data = createData(cellData, datafiledArray);
  export const upClass = params?.colDef?.upClassName ?? "hor-center";
  export const downClass = params?.colDef?.downClassName ?? "hor-center";
  export const currentIcon = params?.colDef?.icon ?? "";

  function onLinkClickHandler(e) {
    bodyBatchInput(e, data[2] ?? "");
  }

  function onBtnClickHandler(e) {
    const event = {
      type: RENDERER_EVENT.Renderer_Icon_Button,
      value: cellData,
      row: params.rowIndex,
      field: datafiledArray[1],
    };
    params.api.dispatchEvent(event);
  }

  function onMouseEnterHandler(e) {
    const textWidth = e.target.scrollWidth;
    const containerWidth = e.target.offsetWidth;
    if (data[1]) {
      if (textWidth > containerWidth) upTitle = data[1];
      else upTitle = "";
    }
  }

  function onMouseUpEnterHandler(e) {
    const textWidth = e.target.scrollWidth;
    const containerWidth = e.target.offsetWidth;
    if (data[0]) {
      if (textWidth > containerWidth) downTitle = data[0];
      else downTitle = "";
    }
  }

  $: props = {
    class: "label",
    ...$$restProps,
  };

  $: linkProps = {
    class: "link",
    ...$$restProps,
  };
</script>

<Box class={upClass} height="22px">
  <p title={upTitle} {...props} on:mouseenter={onMouseUpEnterHandler}>
    {data[0] ?? ""}
  </p>
</Box>
<Box class={downClass} height="22px">
  <Box f={1} style="width:90%; display:flex;">
    <Link
      {...linkProps}
      title={upTitle}
      on:click={onLinkClickHandler}
      on:mouseenter={onMouseEnterHandler}
      style="width:100%"
      href="#">
      {data[1] ?? ""}
    </Link>
  </Box>
  <Link
    style="width:25px"
    on:click={onBtnClickHandler}
    icon={currentIcon}
    {...linkProps} />
</Box>


