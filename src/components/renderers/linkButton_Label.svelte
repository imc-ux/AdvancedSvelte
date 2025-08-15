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

  function onLinkClickHandler(e) {
    const event = {
      type: RENDERER_EVENT.Renderer_LinkButton,
      value: cellData,
      row: params.rowIndex,
      field: datafiledArray[0],
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

  function onMouseDownEnterHandler(e) {
    const textWidth = e.target.scrollWidth;
    const containerWidth = e.target.offsetWidth;
    if (data[1]) {
      if (textWidth > containerWidth) downTitle = data[1];
      else downTitle = "";
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

<div class={upClass} style="height: 22px;">
  <Link
    {...linkProps}
    title={upTitle}
    on:click={onLinkClickHandler}
    on:mouseenter={onMouseEnterHandler}
    href="#">
    {data[0] ?? ""}
  </Link>
</div>
<div class={downClass} style="height: 22px;">
  <p title={downTitle} {...props} on:mouseenter={onMouseDownEnterHandler}>
    {data[1] ?? ""}
  </p>
</div>

<style>
  :global(.label) {
    height: 22px;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
