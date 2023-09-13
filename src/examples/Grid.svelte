<script>
  import { onMount } from "svelte";
  import { Grid } from "ag-grid-community";
  import "ag-grid-community/styles/ag-grid.css";
  import "ag-grid-community/styles/ag-theme-alpine.css";

  let mainElement;
  export let option;

  // let the grid know which columns and what data to use

  onMount(() => {
    new Grid(mainElement, option);
  });
</script>

<div style="height: 500px;" class="ag-theme-alpine" bind:this={mainElement} />
