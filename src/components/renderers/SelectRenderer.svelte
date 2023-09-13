<!-- /**
 * Summary: Select
 * Created: 2023/5/17
 * Author1: wangrui
 * © 2023 iMarketChina Co.,Ltd. All rights reserved.
 */ -->
<script lang="ts">
  import Select from '@/components/sveltecomponents/AdvancedSelect.svelte';
  import RENDERER_EVENT from '@/constant/Renderer';

  export let params;
  let value;
  let options = params.colDef.options;
  let optionIdentifier = params.colDef.key;
  let labelIdentifier = params.colDef.labelName;

  options.forEach((i) => {
    if (i[optionIdentifier] === params.value) {
      value = i;
    }
  });

  $: props = {
    ...$$restProps,
  };

  function onSelectedHander(e) {
    const event = {
      type: RENDERER_EVENT.Render_Select,
      value: e,
      detail: params,
    };
    value = e;
    params.api.dispatchEvent(event);
  }
</script>

<Select bind:value {options} {...props} {optionIdentifier} {labelIdentifier} isVirtualList="true" onSubmit={onSelectedHander} />
