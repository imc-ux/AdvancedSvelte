<script>
  import Tabs from "carbon-components-svelte/src/Tabs/Tabs.svelte";
  import Tab from "carbon-components-svelte/src/Tabs/Tab.svelte";
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  export let selected = 0;
  export let labelList=[];

  function onChangeHandle(e){
    dispatch('change', {data:selected});
}
</script>

<Tabs bind:selected on:change={onChangeHandle}>
  {#each labelList as list}
    <Tab label={list}/>
  {/each}
</Tabs>
