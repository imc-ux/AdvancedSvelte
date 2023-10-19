<script lang="ts">
  import { Link } from "carbon-components-svelte";
  import { createData } from "@/utils/CommonUtils";
  import RENDERER_EVENT from "@/constant/Renderer";

  export let params;
  export let upTitle = "";
  export let downTitle = "";
  export const cellData = params.data ?? {};
  export const datafiledArray = params?.colDef?.field?.split("*") ?? [];
  export const data = createData(cellData, datafiledArray);
  export const upClass = params?.colDef?.upClassName ?? "hor-center";
  export const downClass = params?.colDef?.downClassName ?? "hor-center";

  function onUpLinkClickHandler(e) {
    const event = {
      type: RENDERER_EVENT.Renderer_LinkButton,
      value: cellData,
      row: params.rowIndex,
      field: datafiledArray[0],
    };
    params.api.dispatchEvent(event);
  }

  function onDownLinkClickHandler(e) {
    const event = {
      type: RENDERER_EVENT.Renderer_LinkButton,
      value: cellData,
      row: params.rowIndex,
      field: datafiledArray[1],
    };
    params.api.dispatchEvent(event);
  }

  function onMouseEnterHandler(e) {
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
  <Link
    {...linkProps}
    title={upTitle}
    on:click={onUpLinkClickHandler}
    on:mouseenter={onMouseEnterHandler}
    href="#">
    {data[0] ?? ""}
  </Link>
</div>
<div class={downClass}>
  <Link
    {...linkProps}
    title={downTitle}
    on:click={onDownLinkClickHandler}
    on:mouseenter={onMouseEnterHandler}
    href="#">
    {data[1] ?? ""}
  </Link>
</div>

<style>
  :global(.label) {
    height: 20px;
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
