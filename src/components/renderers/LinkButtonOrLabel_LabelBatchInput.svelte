<script lang="ts">
  import { Link } from "carbon-components-svelte";
  import { createData, bodyBatchInput } from "@/utils/CommonUtils";
  import RENDERER_EVENT from "@/constant/Renderer";
  import { Box } from "@/components/sveltecomponents";
  import "@/styles/core/index.scss";

  export let params;
  export let title = "";
  export const cellData = params.data ?? {};
  export const datafiledArray = params?.colDef?.field?.split("*") ?? [];
  export const data = createData(cellData, datafiledArray);
  export const currentIcon = params?.colDef?.icon ?? "";
  export const upClass = params?.colDef?.upClassName ?? "hor-center";
  export const downClass = params?.colDef?.downClassName ?? "hor-center";
  const showIconButton = data[1];

  function onLinkClickHandler(e) {
    const event = {
      type: RENDERER_EVENT.Renderer_LinkButton,
      value: cellData,
      value1: data[0],
      field: datafiledArray[1],
    };
    params.api.dispatchEvent(event);
  }

  function onLabelClickHandler(e) {
    if (data[2]) {
      bodyBatchInput(e, data[2]);
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

<div class={upClass} style="height: 22px;">
  {#if showIconButton}
    <Link
      {...linkProps}
      {title}
      on:click={onLinkClickHandler}
      on:mouseenter={onMouseEnterHandler}
      href="#">
      {data[0] ?? ""}
    </Link>
  {:else}
    <p {title} {...props} on:mouseenter={onMouseEnterHandler}>
      {data[0] ?? ""}
    </p>
  {/if}
</div>
<div class={downClass} style="height: 22px;">
  <Box f={1} style="width:100%; display:flex;">
    <p
      style="width:100%;"
      {title}
      {...props}
      on:mouseenter={onMouseEnterHandler}
      on:click={onLabelClickHandler}>
      {data[2] ?? ""}
    </p>
  </Box>
</div>

