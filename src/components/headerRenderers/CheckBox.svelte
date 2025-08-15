<script lang="ts">
  import { Checkbox } from "carbon-components-svelte";
  import RENDERER_EVENT from "@/constant/Renderer";

  export let params;
  let checked: boolean = false;

  $: props = {
    class: "checkBoxAlign",
    ...$$restProps,
  };

  function onCheckBoxChangeHandler(e: any) {
    const event = {
      type: RENDERER_EVENT.Renderer_Header_CheckBox,
      value: e.target.checked,
    };
    params.api.dispatchEvent(event);
  }
</script>

<Checkbox bind:checked on:click={onCheckBoxChangeHandler} {...props} />
