<!--
/**
 * Summary: DataGrid
 * Created: 2023/05/05
 * Author1: wangrui
-->
<script lang="ts">
  import { Grid, GridOptions } from 'ag-grid-community';
  import type { GridReadyEvent, GridSizeChangedEvent } from 'ag-grid-community';
  import { onMount, onDestroy } from 'svelte';
  import Pagination from '@/components/sveltecomponents/Pagination.svelte';

  let grid: any;
  export let rowData: any[] | null = null;
  export let columnDefs: any[];
  export let id: string;
  export let headerHeight: number = 35;
  export let rowHeight: number = 35;
  export let pageCount: number;
  export let currentPage: number;
  export let onPageChange = (e: CustomEvent) => {};
  export let onGridReady = (event: GridReadyEvent) => {};

  const gridOptions: GridOptions = {
    columnDefs: columnDefs,
    rowData: rowData,
    headerHeight: headerHeight,
    rowHeight: rowHeight,
    suppressCellSelection: true,
    pagination: true,
    suppressPaginationPanel: true,
    onGridReady: onGridReady,
    onGridSizeChanged: onGridSizeChange,
  };

  $: {
    gridOptions?.api?.setRowData(rowData);
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

<div style="justify-content:center; align-item:center;height:100% ;display:flex;flex-direction:column">
  <div style="flex:1" {id} />
  {#if rowData}
    <div style="flex:1">
      <Pagination total={rowData?.[0]?.totalCount} {pageCount} {currentPage} {onPageChange} />
    </div>
  {/if}
</div>

<!-- <style>
  .grid-height {
    height: 100%;
  }
</style> -->
