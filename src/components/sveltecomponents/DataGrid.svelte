<!--
/**
 * Summary: DataGrid
 * Created: 2023/05/05
 * Author1: wangrui
-->
<script lang="ts">
  import { Grid, GridOptions, GridApi } from "ag-grid-community";
  import Pagination from "@/components/sveltecomponents/Pagination.svelte";
  import type { GridReadyEvent } from "ag-grid-community";
  import { onMount, onDestroy } from "svelte";

  let grid: any;
  export let rowData: any[] | null = null;
  export let columnDefs: any[];
  export let id: string = Math.random().toString();
  export let headerRows: number = 1;
  export let pageCount: number = 10;
  export let currentPage: number = 0;
  export let overlayNoRowsTemplate: string = "No Data";
  export let pageShowFlag: boolean = true;
  export let onPageChange = (e: CustomEvent) => {};
  export let onGridReady = (event: GridReadyEvent) => {};

  const rowHeightMap: Map<number, number> = new Map([
    [1, 35],
    [2, 50],
  ]);

  const headerRowHeight: Map<number, number> = new Map([
    [1, 35],
    [2, 25],
  ]);

  const gridOptions: GridOptions = {
    columnDefs: columnDefs,
    rowData: rowData,
    headerHeight: headerRowHeight.get(headerRows),
    rowHeight: rowHeightMap.get(headerRows),
    overlayNoRowsTemplate: overlayNoRowsTemplate,
    onGridReady: onGridReady,
    onGridSizeChanged: onGridSizeChange,
  };

  $: {
    gridOptions?.api?.setRowData(rowData);
    gridOptions?.api?.sizeColumnsToFit();
  }

  onMount(() => {
    const gridTarget = document.getElementById(id);
    grid = new Grid(gridTarget, gridOptions);
    gridOptions.api.hideOverlay();
  });

  onDestroy(() => {});

  function onGridSizeChange() {
    gridOptions?.api?.sizeColumnsToFit();
  }
</script>

<div
  style="justify-content:center; align-item:center;display:flex;flex-direction:column;flex:1;height:100%">
  <div style="flex:1" {id} class="grid-font-family" />
  {#if pageShowFlag}
    {#if rowData && rowData.length > 0}
      <div style="height:76px">
        <Pagination
          total={rowData?.[0]?.totalCount}
          {pageCount}
          {currentPage}
          {onPageChange} />
      </div>
    {/if}
  {/if}
</div>

<style>
  .grid-font-family {
    font-size: 14px;
    font-family: "微软雅黑" !important;
  }

  :global(.ag-header-group-cell-label) {
    justify-content: center;
  }
</style>
