<script lang="ts">
  import { Toggle } from "carbon-components-svelte";
  import RENDERER_EVENT from "@/constant/Renderer";

  export let params: any;
  export let labelA = "";
  export let labelB = "";
  export let toggled: boolean;

  function onSwichClickHandler(e) {
    const event = {
      type: RENDERER_EVENT.Renderer_Switch,
      toggled: e.detail.toggled,
      detail: params,
    };
    params.api.dispatchEvent(event);
  }
</script>

<Toggle {toggled} {labelA} {labelB} on:toggle={onSwichClickHandler} />
