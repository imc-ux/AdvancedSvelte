<script lang="ts">
  import { createData } from "@/utils/CommonUtils";
  import "@/styles/core/index.scss";

  export let params;
  export const cellData = params.data ?? {};
  export const datafiledArray = params?.colDef?.field?.split("*") ?? [];
  export const data = createData(cellData, datafiledArray);
  export const upClass = params?.colDef?.upClassName ?? "hor-center";
  export const downClass = params?.colDef?.downClassName ?? "hor-center";

  let upTitle = "";
  let downTitle = "";

  function onMouseUpEnterHandler(e) {
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

  $: props = {
    class: "label",
    ...$$restProps,
  };
</script>

<div class={upClass}>
  <p title={upTitle} {...props} on:mouseenter={onMouseUpEnterHandler}>
    {data[0] ?? ""}
  </p>
</div>
<div class={downClass}>
  <p title={downTitle} {...props} on:mouseenter={onMouseDownEnterHandler}>
    {data[1] ?? ""}
  </p>
</div>


