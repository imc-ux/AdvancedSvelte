<!--
/**
* Summary: BatchInput控件
* Created: 2022/08/22
* Author1: ljh
* Author2: kang jiaqi
*/
-->
<script lang="ts">
  import { Box, Text, TextArea } from '@/components/sveltecomponents';
  import { TextInput } from 'carbon-components-svelte';

  export let value: string = '';
  export let dataTotal: number = 0;
  export let useSpace: boolean = false;
  let batch = false;

  $: props = {
    ...$$restProps,
  };

  function inputClickHandler(e: any) {
    batch = true;
    setTimeout(() => {
      document.getElementsByTagName('textarea')[0].focus();
    }, 1);
  }

  function textInputBlurHandler() {
    if (batch) {
      value = switchToTextArea(value);
    } else {
      value = switchToInput(value);
    }
    dataTotal = getTotal(value);
  }

  function textAreaBlurHandler() {
    batch = false;
    value = switchToInput(value);
    dataTotal = getTotal(value);
  }

  function switchToTextArea(value: string) {
    const result = value?.split(',')?.join('\n');
    return result;
  }

  function getTotal(input: string) {
    if (batch) {
      return input ? input.split('\n').length : 0;
    } else {
      return input ? input.split(',').length : 0;
    }
  }

  function switchToInput(value: string) {
    if (!value) return '';
    let result: string = value.replace(/\n/g, ',');
    if (!useSpace) {
      result = result.replace(/\s/g, ' ');
    }
    let resultNoEmpty = result.split(',').filter(v => {
      return v && v.trim();
    });
    const resultNoRepeat: string[] = [];
    resultNoEmpty.forEach(v => {
      if (!resultNoRepeat.includes(v)) {
        resultNoRepeat.push(v);
      }
    });
    return resultNoRepeat.join(',');
  }
</script>

<Box f={1} style="display:flex;">
  {#if !batch}
    <TextInput bind:value {...props} on:click={inputClickHandler} class="root ellipsis" on:blur={textInputBlurHandler} maxlength={100} />
  {:else}
    <TextArea bind:value {...props} class="root index-textArea-bottom-margin" on:blur={textAreaBlurHandler} />
  {/if}
  <Box verticalAlign="middle" class="ellipsis" style="display:block">
    <Text>({dataTotal})</Text>
  </Box>
</Box>

<style>
  :global(.ellipsis) {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  :global(.bx--text-area) {
    padding: 5px 5px;
  }
</style>
