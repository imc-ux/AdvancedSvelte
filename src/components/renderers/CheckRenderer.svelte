<script lang="ts">
  import { Checkbox } from 'carbon-components-svelte';
  import RENDERER_EVENT from '@/constant/Renderer';
  import { createData } from '@/utils/CommonUtils';

  export let params;
  export const cellData = params.data ?? {};
  export const datafiledArray = params?.colDef?.field?.split('*') ?? [];
  export const data = createData(cellData, datafiledArray);
  let checked: boolean = data[0];

  $: props = {
    class: 'checkBoxRenderer',
    ...$$restProps,
  };
  function onCheckBoxChangeHandler(e: any) {
    const event = {
      type: RENDERER_EVENT.Renderer_Select_Check_Box,
      value: cellData,
      value1: e.target.checked,
      field: datafiledArray[0],
      detail: params,
    };
    params.api.dispatchEvent(event);
  }
</script>
<Checkbox bind:checked on:click={onCheckBoxChangeHandler} {...props} />





